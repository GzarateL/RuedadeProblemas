import pool from "../../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class DesafiosService {
  
  async crearDesafio(userId: number, data: any) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

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
          await connection.query(
            `INSERT INTO Registro_OCDE (usuario_id, disciplina_id) VALUES (?, ?)`,
            [userId, disciplinaId]
          );
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
              `INSERT INTO Registro_ODS (usuario_id, objetivo_id, meta_id) VALUES (?, ?, ?)`,
              [userId, metas[0].objetivo_id, metaId]
            );
          }
        }
      }

      // 4. Insertar Keywords - USANDO TABLAS COMPARTIDAS
      if (data.keyword_ids && data.keyword_ids.length > 0) {
        for (const keywordId of data.keyword_ids) {
          await connection.query(
            `INSERT IGNORE INTO Registro_Keywords (usuario_id, keyword_id) VALUES (?, ?)`,
            [userId, keywordId]
          );
        }
      }

      // 5. Insertar Soluciones propuestas - USANDO TABLAS COMPARTIDAS
      if (data.soluciones && data.soluciones.length > 0) {
        for (const solucion of data.soluciones) {
          await connection.query(
            `INSERT INTO Registro_Soluciones (usuario_id, titulo, problema, solucion, orden)
            VALUES (?, ?, ?, ?, ?)`,
            [userId, solucion.titulo, solucion.problema, solucion.solucion, solucion.orden || 1]
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
      // Obtener desafío básico
      const [desafios] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Desafios WHERE desafio_id = ? AND usuario_id = ?`,
        [desafioId, userId]
      );

      if (desafios.length === 0) {
        throw new Error("Desafío no encontrado");
      }

      const desafio = desafios[0];

      // Obtener OCDE del usuario
      const [ocde] = await connection.query<RowDataPacket[]>(
        `SELECT disciplina_id FROM Registro_OCDE WHERE usuario_id = ?`,
        [userId]
      );

      // Obtener ODS del usuario
      const [ods] = await connection.query<RowDataPacket[]>(
        `SELECT meta_id FROM Registro_ODS WHERE usuario_id = ?`,
        [userId]
      );

      // Obtener Keywords del usuario
      const [keywords] = await connection.query<RowDataPacket[]>(
        `SELECT keyword_id FROM Registro_Keywords WHERE usuario_id = ?`,
        [userId]
      );

      // Obtener Soluciones del usuario
      const [soluciones] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Registro_Soluciones WHERE usuario_id = ? ORDER BY orden`,
        [userId]
      );

      return {
        ...desafio,
        ocde_ids: ocde.map(o => o.disciplina_id),
        ods_ids: ods.map(o => o.meta_id),
        keyword_ids: keywords.map(k => k.keyword_id),
        soluciones: soluciones
      };
    } finally {
      connection.release();
    }
  }
}
