import pool from "../../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class DesafiosService {
  
  async crearDesafio(userId: number, data: any) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Obtener el tipo de participante del usuario
      const [participante] = await connection.query<RowDataPacket[]>(
        `SELECT tipo_participante FROM Registros_Participantes WHERE usuario_id = ? LIMIT 1`,
        [userId]
      );

      if (participante.length === 0) {
        throw new Error("Usuario no tiene registro de participante");
      }

      const tipoParticipante = participante[0].tipo_participante;

      // 1. Insertar desafío
      const [desafioResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO Desafios 
        (usuario_id, titulo, descripcion, impacto, intentos_previos)
        VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          data.titulo,
          data.descripcion,
          data.impacto,
          data.intentos_previos || null
        ]
      );

      const desafioId = desafioResult.insertId;

      // 2. Insertar OCDE (disciplinas) - USANDO TABLAS COMPARTIDAS
      if (data.ocde_ids && data.ocde_ids.length > 0) {
        for (const disciplinaId of data.ocde_ids) {
          // Obtener area_id y sub_area_id de la disciplina
          const [disciplinas] = await connection.query<RowDataPacket[]>(
            `SELECT d.sub_area_id, sa.area_id 
             FROM disciplinas d
             JOIN sub_areas sa ON d.sub_area_id = sa.id
             WHERE d.id = ?`,
            [disciplinaId]
          );
          
          if (disciplinas.length > 0) {
            await connection.query(
              `INSERT INTO Registro_OCDE (usuario_id, registro_id, tipo, area_id, sub_area_id, disciplina_id) 
               VALUES (?, ?, ?, ?, ?, ?)`,
              [userId, desafioId, tipoParticipante, disciplinas[0].area_id, disciplinas[0].sub_area_id, disciplinaId]
            );
          }
        }
      }

      // 3. Insertar ODS (metas) - USANDO TABLAS COMPARTIDAS
      if (data.ods_ids && data.ods_ids.length > 0) {
        for (const metaId of data.ods_ids) {
          // Obtener el objetivo_id de la meta
          const [metas] = await connection.query<RowDataPacket[]>(
            `SELECT objetivo_id FROM metas WHERE id = ?`,
            [metaId]
          );
          
          if (metas.length > 0) {
            await connection.query(
              `INSERT INTO Registro_ODS (usuario_id, registro_id, tipo, objetivo_id, meta_id) VALUES (?, ?, ?, ?, ?)`,
              [userId, desafioId, tipoParticipante, metas[0].objetivo_id, metaId]
            );
          }
        }
      }

      // 4. Insertar Keywords - USANDO TABLAS COMPARTIDAS
      if (data.keyword_ids && data.keyword_ids.length > 0) {
        for (const keywordId of data.keyword_ids) {
          await connection.query(
            `INSERT IGNORE INTO Registro_Keywords (usuario_id, registro_id, tipo, keyword_id) VALUES (?, ?, ?, ?)`,
            [userId, desafioId, tipoParticipante, keywordId]
          );
        }
      }

      // 5. Insertar Soluciones propuestas - USANDO TABLAS COMPARTIDAS
      if (data.soluciones && data.soluciones.length > 0) {
        for (const solucion of data.soluciones) {
          await connection.query(
            `INSERT INTO Registro_Soluciones (usuario_id, registro_id, tipo, titulo, problema, solucion, orden)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, desafioId, tipoParticipante, solucion.titulo, solucion.problema, solucion.solucion, solucion.orden || 1]
          );
        }
      }

      await connection.commit();

      return {
        success: true,
        message: "Desafío creado exitosamente",
        desafioId: desafioId
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async obtenerDesafiosPorUsuario(userId: number) {
    const connection = await pool.getConnection();
    
    try {
      const [desafios] = await connection.query<RowDataPacket[]>(
        `SELECT 
          d.desafio_id,
          d.titulo,
          d.descripcion,
          d.impacto,
          d.intentos_previos,
          d.fecha_creacion
        FROM Desafios d
        WHERE d.usuario_id = ?
        ORDER BY d.fecha_creacion DESC`,
        [userId]
      );

      return desafios;
    } finally {
      connection.release();
    }
  }

  async obtenerDesafio(desafioId: number, userId: number) {
    const connection = await pool.getConnection();
    
    try {
      // Obtener el tipo de participante del usuario
      const [participante] = await connection.query<RowDataPacket[]>(
        `SELECT tipo_participante FROM Registros_Participantes WHERE usuario_id = ? LIMIT 1`,
        [userId]
      );

      if (participante.length === 0) {
        throw new Error("Usuario no tiene registro de participante");
      }

      const tipoParticipante = participante[0].tipo_participante;
      console.log(`=== OBTENER DESAFÍO ${desafioId} ===`);
      console.log(`Usuario: ${userId}, Tipo: ${tipoParticipante}`);

      // Obtener desafío básico
      const [desafios] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Desafios WHERE desafio_id = ? AND usuario_id = ?`,
        [desafioId, userId]
      );

      if (desafios.length === 0) {
        throw new Error("Desafío no encontrado");
      }

      const desafio = desafios[0];

      // Obtener OCDE del desafío específico
      const [ocde] = await connection.query<RowDataPacket[]>(
        `SELECT 
          ro.area_id,
          ro.sub_area_id,
          ro.disciplina_id
        FROM Registro_OCDE ro
        WHERE ro.usuario_id = ? AND ro.registro_id = ? AND ro.tipo = ?`,
        [userId, desafioId, tipoParticipante]
      );
      console.log(`OCDE encontrados: ${ocde.length}`, ocde);

      // Obtener ODS del desafío específico
      const [ods] = await connection.query<RowDataPacket[]>(
        `SELECT 
          ro.objetivo_id,
          ro.meta_id
        FROM Registro_ODS ro
        WHERE ro.usuario_id = ? AND ro.registro_id = ? AND ro.tipo = ?`,
        [userId, desafioId, tipoParticipante]
      );
      console.log(`ODS encontrados: ${ods.length}`, ods);

      // Obtener Keywords del desafío específico
      const [keywords] = await connection.query<RowDataPacket[]>(
        `SELECT keyword_id FROM Registro_Keywords 
         WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`,
        [userId, desafioId, tipoParticipante]
      );
      console.log(`Keywords encontradas: ${keywords.length}`, keywords);

      // Obtener Soluciones del desafío específico
      const [soluciones] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Registro_Soluciones 
         WHERE usuario_id = ? AND registro_id = ? AND tipo = ? 
         ORDER BY orden`,
        [userId, desafioId, tipoParticipante]
      );
      console.log(`Soluciones encontradas: ${soluciones.length}`, soluciones);

      // Extraer IDs únicos
      const areaIds = [...new Set(ocde.map(o => o.area_id).filter(id => id))];
      const subAreaIds = [...new Set(ocde.map(o => o.sub_area_id).filter(id => id))];
      const disciplinaIds = [...new Set(ocde.map(o => o.disciplina_id).filter(id => id))];
      
      const objetivoIds = [...new Set(ods.map(o => o.objetivo_id).filter(id => id))];
      const metaIds = [...new Set(ods.map(o => o.meta_id).filter(id => id))];

      return {
        ...desafio,
        area_ids: areaIds,
        sub_area_ids: subAreaIds,
        disciplina_ids: disciplinaIds,
        objetivo_ids: objetivoIds,
        meta_ids: metaIds,
        keyword_ids: keywords.map(k => k.keyword_id),
        soluciones: soluciones
      };
    } finally {
      connection.release();
    }
  }

  async actualizarDesafio(desafioId: number, userId: number, data: any) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Obtener el tipo de participante del usuario
      const [participante] = await connection.query<RowDataPacket[]>(
        `SELECT tipo_participante FROM Registros_Participantes WHERE usuario_id = ? LIMIT 1`,
        [userId]
      );

      if (participante.length === 0) {
        throw new Error("Usuario no tiene registro de participante");
      }

      const tipoParticipante = participante[0].tipo_participante;

      // Verificar que el desafío pertenece al usuario
      const [desafios] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Desafios WHERE desafio_id = ? AND usuario_id = ?`,
        [desafioId, userId]
      );

      if (desafios.length === 0) {
        throw new Error("Desafío no encontrado o no tiene permisos");
      }

      // 1. Actualizar desafío
      await connection.query(
        `UPDATE Desafios 
        SET titulo = ?, descripcion = ?, impacto = ?, intentos_previos = ?
        WHERE desafio_id = ? AND usuario_id = ?`,
        [
          data.titulo,
          data.descripcion,
          data.impacto,
          data.intentos_previos || null,
          desafioId,
          userId
        ]
      );

      // 2. Eliminar y reinsertar OCDE del desafío específico
      await connection.query(
        `DELETE FROM Registro_OCDE WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`, 
        [userId, desafioId, tipoParticipante]
      );
      if (data.ocde_ids && data.ocde_ids.length > 0) {
        for (const disciplinaId of data.ocde_ids) {
          // Obtener area_id y sub_area_id de la disciplina
          const [disciplinas] = await connection.query<RowDataPacket[]>(
            `SELECT d.sub_area_id, sa.area_id 
             FROM disciplinas d
             JOIN sub_areas sa ON d.sub_area_id = sa.id
             WHERE d.id = ?`,
            [disciplinaId]
          );
          
          if (disciplinas.length > 0) {
            await connection.query(
              `INSERT INTO Registro_OCDE (usuario_id, registro_id, tipo, area_id, sub_area_id, disciplina_id) 
               VALUES (?, ?, ?, ?, ?, ?)`,
              [userId, desafioId, tipoParticipante, disciplinas[0].area_id, disciplinas[0].sub_area_id, disciplinaId]
            );
          }
        }
      }

      // 3. Eliminar y reinsertar ODS del desafío específico
      await connection.query(
        `DELETE FROM Registro_ODS WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`, 
        [userId, desafioId, tipoParticipante]
      );
      if (data.ods_ids && data.ods_ids.length > 0) {
        for (const metaId of data.ods_ids) {
          const [metas] = await connection.query<RowDataPacket[]>(
            `SELECT objetivo_id FROM metas WHERE id = ?`,
            [metaId]
          );
          
          if (metas.length > 0) {
            await connection.query(
              `INSERT INTO Registro_ODS (usuario_id, registro_id, tipo, objetivo_id, meta_id) VALUES (?, ?, ?, ?, ?)`,
              [userId, desafioId, tipoParticipante, metas[0].objetivo_id, metaId]
            );
          }
        }
      }

      // 4. Eliminar y reinsertar Keywords del desafío específico
      await connection.query(
        `DELETE FROM Registro_Keywords WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`, 
        [userId, desafioId, tipoParticipante]
      );
      if (data.keyword_ids && data.keyword_ids.length > 0) {
        for (const keywordId of data.keyword_ids) {
          await connection.query(
            `INSERT IGNORE INTO Registro_Keywords (usuario_id, registro_id, tipo, keyword_id) VALUES (?, ?, ?, ?)`,
            [userId, desafioId, tipoParticipante, keywordId]
          );
        }
      }

      // 5. Eliminar y reinsertar Soluciones del desafío específico
      await connection.query(
        `DELETE FROM Registro_Soluciones WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`, 
        [userId, desafioId, tipoParticipante]
      );
      if (data.soluciones && data.soluciones.length > 0) {
        for (const solucion of data.soluciones) {
          await connection.query(
            `INSERT INTO Registro_Soluciones (usuario_id, registro_id, tipo, titulo, problema, solucion, orden)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, desafioId, tipoParticipante, solucion.titulo, solucion.problema, solucion.solucion, solucion.orden || 1]
          );
        }
      }

      await connection.commit();

      return {
        success: true,
        message: "Desafío actualizado exitosamente"
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async eliminarDesafio(desafioId: number, userId: number) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Obtener el tipo de participante del usuario
      const [participante] = await connection.query<RowDataPacket[]>(
        `SELECT tipo_participante FROM Registros_Participantes WHERE usuario_id = ? LIMIT 1`,
        [userId]
      );

      if (participante.length === 0) {
        throw new Error("Usuario no tiene registro de participante");
      }

      const tipoParticipante = participante[0].tipo_participante;

      // Verificar que el desafío pertenece al usuario
      const [desafios] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Desafios WHERE desafio_id = ? AND usuario_id = ?`,
        [desafioId, userId]
      );

      if (desafios.length === 0) {
        throw new Error("Desafío no encontrado o no tiene permisos");
      }

      // Eliminar datos relacionados en tablas compartidas
      console.log(`Eliminando datos relacionados del desafío ${desafioId}, usuario ${userId}, tipo ${tipoParticipante}`);
      
      await connection.query(
        `DELETE FROM Registro_OCDE WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`,
        [userId, desafioId, tipoParticipante]
      );

      await connection.query(
        `DELETE FROM Registro_ODS WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`,
        [userId, desafioId, tipoParticipante]
      );

      await connection.query(
        `DELETE FROM Registro_Keywords WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`,
        [userId, desafioId, tipoParticipante]
      );

      await connection.query(
        `DELETE FROM Registro_Soluciones WHERE usuario_id = ? AND registro_id = ? AND tipo = ?`,
        [userId, desafioId, tipoParticipante]
      );

      // Eliminar el desafío
      await connection.query(
        `DELETE FROM Desafios WHERE desafio_id = ? AND usuario_id = ?`,
        [desafioId, userId]
      );

      await connection.commit();

      return {
        success: true,
        message: "Desafío eliminado exitosamente"
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
