import pool from "../../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class HeliceExternaService {
  
  async registrarGobierno(userId: number, data: any) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Insertar en Registro_Gobierno
      const [registroResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO Registro_Gobierno 
        (usuario_id, nombre_institucion, nombre_completo, cargo, tipo_gobierno, email, telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          data.nombre_institucion,
          data.nombre_completo,
          data.cargo,
          data.tipo_gobierno,
          data.email,
          data.telefono
        ]
      );

      // 2. Insertar en Registros_Participantes
      await connection.query(
        `INSERT INTO Registros_Participantes 
        (usuario_id, tipo_participante, tipo_participacion)
        VALUES (?, 'gobierno', ?)`,
        [userId, data.tipo_participacion || 'presencial']
      );

      // 3. Insertar días de interés si existen
      if (data.dias_interes && data.dias_interes.length > 0) {
        for (const sesionId of data.dias_interes) {
          await connection.query(
            `INSERT INTO Registro_Dias_Interes (usuario_id, sesion_id) VALUES (?, ?)`,
            [userId, sesionId]
          );
        }
      }

      await connection.commit();

      return {
        success: true,
        message: "Registro de gobierno completado exitosamente",
        registroId: registroResult.insertId
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async registrarColegioProfesional(userId: number, data: any) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [registroResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO Registro_Colegio_Profesional 
        (usuario_id, nombre_institucion, nombre_completo, cargo, programa_estudio, email, telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          data.nombre_institucion,
          data.nombre_completo,
          data.cargo,
          data.programa_estudio,
          data.email,
          data.telefono
        ]
      );

      await connection.query(
        `INSERT INTO Registros_Participantes 
        (usuario_id, tipo_participante, tipo_participacion)
        VALUES (?, 'colegio_profesional', ?)`,
        [userId, data.tipo_participacion || 'presencial']
      );

      if (data.dias_interes && data.dias_interes.length > 0) {
        for (const sesionId of data.dias_interes) {
          await connection.query(
            `INSERT INTO Registro_Dias_Interes (usuario_id, sesion_id) VALUES (?, ?)`,
            [userId, sesionId]
          );
        }
      }

      await connection.commit();

      return {
        success: true,
        message: "Registro de colegio profesional completado exitosamente",
        registroId: registroResult.insertId
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async registrarEmpresa(userId: number, data: any) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [registroResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO Registro_Empresa 
        (usuario_id, nombre_empresa, nombre_completo, cargo, tipo_empresa, tamano_empresa, clasificacion_empresa, email, telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          data.nombre_empresa,
          data.nombre_completo,
          data.cargo,
          data.tipo_empresa,
          data.tamano_empresa,
          data.clasificacion_empresa,
          data.email,
          data.telefono
        ]
      );

      await connection.query(
        `INSERT INTO Registros_Participantes 
        (usuario_id, tipo_participante, tipo_participacion)
        VALUES (?, 'empresa', ?)`,
        [userId, data.tipo_participacion || 'presencial']
      );

      if (data.dias_interes && data.dias_interes.length > 0) {
        for (const sesionId of data.dias_interes) {
          await connection.query(
            `INSERT INTO Registro_Dias_Interes (usuario_id, sesion_id) VALUES (?, ?)`,
            [userId, sesionId]
          );
        }
      }

      await connection.commit();

      return {
        success: true,
        message: "Registro de empresa completado exitosamente",
        registroId: registroResult.insertId
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async registrarSociedadCivil(userId: number, data: any) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [registroResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO Registro_Sociedad_Civil 
        (usuario_id, nombre_organizacion, nombre_completo, cargo, tipo_organizacion, tamano_organizacion, email, telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          data.nombre_organizacion,
          data.nombre_completo,
          data.cargo,
          data.tipo_organizacion,
          data.tamano_organizacion,
          data.email,
          data.telefono
        ]
      );

      await connection.query(
        `INSERT INTO Registros_Participantes 
        (usuario_id, tipo_participante, tipo_participacion)
        VALUES (?, 'sociedad_civil', ?)`,
        [userId, data.tipo_participacion || 'presencial']
      );

      if (data.dias_interes && data.dias_interes.length > 0) {
        for (const sesionId of data.dias_interes) {
          await connection.query(
            `INSERT INTO Registro_Dias_Interes (usuario_id, sesion_id) VALUES (?, ?)`,
            [userId, sesionId]
          );
        }
      }

      await connection.commit();

      return {
        success: true,
        message: "Registro de sociedad civil completado exitosamente",
        registroId: registroResult.insertId
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async obtenerMisRegistros(userId: number) {
    const connection = await pool.getConnection();
    
    try {
      const [registros] = await connection.query<RowDataPacket[]>(
        `SELECT 
          rp.tipo_participante,
          rp.tipo_participacion,
          rp.fecha_registro
        FROM Registros_Participantes rp
        WHERE rp.usuario_id = ?`,
        [userId]
      );

      return registros;
    } finally {
      connection.release();
    }
  }

  async obtenerDesafios(userId: number) {
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

  async verificarRegistro(userId: number) {
    const connection = await pool.getConnection();
    
    try {
      const [registros] = await connection.query<RowDataPacket[]>(
        `SELECT tipo_participante FROM Registros_Participantes WHERE usuario_id = ? LIMIT 1`,
        [userId]
      );

      return {
        tieneRegistro: registros.length > 0,
        tipoParticipante: registros.length > 0 ? registros[0].tipo_participante : null
      };
    } finally {
      connection.release();
    }
  }
}
