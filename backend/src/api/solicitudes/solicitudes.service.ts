// /backend/src/api/solicitudes/solicitudes.service.ts
import dbPool from '../../config/db';
import { RowDataPacket, OkPacket } from 'mysql2/promise';

export interface Solicitud extends RowDataPacket {
  solicitud_id: number;
  remitente_tipo: 'unsa' | 'externo';
  remitente_id: number;
  destinatario_tipo: 'unsa' | 'externo';
  destinatario_id: number;
  tipo_match: 'capacidad' | 'desafio';
  match_id: number;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  mensaje: string | null;
  fecha_creacion: string;
  fecha_respuesta: string | null;
  // Campos adicionales para joins
  remitente_nombre?: string;
  destinatario_nombre?: string;
  match_titulo?: string;
  match_descripcion?: string;
}

interface CrearSolicitudData {
  remitente_tipo: 'unsa' | 'externo';
  remitente_id: number;
  destinatario_tipo: 'unsa' | 'externo';
  destinatario_id: number;
  tipo_match: 'capacidad' | 'desafio';
  match_id: number;
  mensaje?: string;
}

/**
 * Crear una nueva solicitud
 */
export const crearSolicitud = async (data: CrearSolicitudData): Promise<number> => {
  try {
    const [result] = await dbPool.execute<OkPacket>(
      `INSERT INTO Solicitudes 
       (remitente_tipo, remitente_id, destinatario_tipo, destinatario_id, tipo_match, match_id, mensaje)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.remitente_tipo,
        data.remitente_id,
        data.destinatario_tipo,
        data.destinatario_id,
        data.tipo_match,
        data.match_id,
        data.mensaje || null
      ]
    );
    
    console.log(`✅ Solicitud creada: ID ${result.insertId}`);
    return result.insertId;
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Ya existe una solicitud para este perfil.');
    }
    console.error('Error al crear solicitud:', error);
    throw new Error('Error al crear la solicitud.');
  }
};

/**
 * Obtener solicitudes enviadas por un usuario
 */
export const getSolicitudesEnviadas = async (
  tipo: 'unsa' | 'externo',
  userId: number
): Promise<Solicitud[]> => {
  try {
    const query = `
      SELECT 
        s.*,
        CASE 
          WHEN s.destinatario_tipo = 'unsa' THEN i.nombres_apellidos
          WHEN s.destinatario_tipo = 'externo' THEN p.nombres_apellidos
        END AS destinatario_nombre,
        CASE
          WHEN s.tipo_match = 'capacidad' THEN c.descripcion_capacidad
          WHEN s.tipo_match = 'desafio' THEN d.titulo
        END AS match_titulo
      FROM Solicitudes s
      LEFT JOIN Investigadores_UNSA i ON s.destinatario_tipo = 'unsa' AND s.destinatario_id = i.investigador_id
      LEFT JOIN Participantes_Externos p ON s.destinatario_tipo = 'externo' AND s.destinatario_id = p.participante_id
      LEFT JOIN Capacidades_UNSA c ON s.tipo_match = 'capacidad' AND s.match_id = c.capacidad_id
      LEFT JOIN Desafios d ON s.tipo_match = 'desafio' AND s.match_id = d.desafio_id
      WHERE s.remitente_tipo = ? AND s.remitente_id = ?
      ORDER BY s.fecha_creacion DESC
    `;
    
    const [rows] = await dbPool.execute<Solicitud[]>(query, [tipo, userId]);
    return rows;
  } catch (error: any) {
    console.error('Error al obtener solicitudes enviadas:', error);
    throw new Error('Error al obtener solicitudes enviadas.');
  }
};

/**
 * Obtener solicitudes recibidas por un usuario
 */
export const getSolicitudesRecibidas = async (
  tipo: 'unsa' | 'externo',
  userId: number
): Promise<Solicitud[]> => {
  try {
    const query = `
      SELECT 
        s.*,
        CASE 
          WHEN s.remitente_tipo = 'unsa' THEN i.nombres_apellidos
          WHEN s.remitente_tipo = 'externo' THEN p.nombres_apellidos
        END AS remitente_nombre,
        CASE
          WHEN s.tipo_match = 'capacidad' THEN c.descripcion_capacidad
          WHEN s.tipo_match = 'desafio' THEN d.titulo
        END AS match_titulo
      FROM Solicitudes s
      LEFT JOIN Investigadores_UNSA i ON s.remitente_tipo = 'unsa' AND s.remitente_id = i.investigador_id
      LEFT JOIN Participantes_Externos p ON s.remitente_tipo = 'externo' AND s.remitente_id = p.participante_id
      LEFT JOIN Capacidades_UNSA c ON s.tipo_match = 'capacidad' AND s.match_id = c.capacidad_id
      LEFT JOIN Desafios d ON s.tipo_match = 'desafio' AND s.match_id = d.desafio_id
      WHERE s.destinatario_tipo = ? AND s.destinatario_id = ?
      ORDER BY 
        CASE s.estado 
          WHEN 'pendiente' THEN 1 
          WHEN 'aceptada' THEN 2 
          WHEN 'rechazada' THEN 3 
        END,
        s.fecha_creacion DESC
    `;
    
    const [rows] = await dbPool.execute<Solicitud[]>(query, [tipo, userId]);
    return rows;
  } catch (error: any) {
    console.error('Error al obtener solicitudes recibidas:', error);
    throw new Error('Error al obtener solicitudes recibidas.');
  }
};

/**
 * Actualizar estado de una solicitud
 */
export const actualizarEstadoSolicitud = async (
  solicitudId: number,
  destinatarioTipo: 'unsa' | 'externo',
  destinatarioId: number,
  nuevoEstado: 'aceptada' | 'rechazada'
): Promise<void> => {
  try {
    const [result] = await dbPool.execute<OkPacket>(
      `UPDATE Solicitudes 
       SET estado = ?, fecha_respuesta = NOW()
       WHERE solicitud_id = ? 
         AND destinatario_tipo = ? 
         AND destinatario_id = ?
         AND estado = 'pendiente'`,
      [nuevoEstado, solicitudId, destinatarioTipo, destinatarioId]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('Solicitud no encontrada o no tienes permiso para modificarla.');
    }
    
    console.log(`✅ Solicitud ${solicitudId} actualizada a: ${nuevoEstado}`);
  } catch (error: any) {
    console.error('Error al actualizar solicitud:', error);
    throw error;
  }
};

/**
 * Verificar si ya existe una solicitud
 */
export const existeSolicitud = async (
  remitenteTipo: 'unsa' | 'externo',
  remitenteId: number,
  destinatarioTipo: 'unsa' | 'externo',
  destinatarioId: number,
  tipoMatch: 'capacidad' | 'desafio',
  matchId: number
): Promise<boolean> => {
  try {
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      `SELECT solicitud_id FROM Solicitudes 
       WHERE remitente_tipo = ? AND remitente_id = ?
         AND destinatario_tipo = ? AND destinatario_id = ?
         AND tipo_match = ? AND match_id = ?`,
      [remitenteTipo, remitenteId, destinatarioTipo, destinatarioId, tipoMatch, matchId]
    );
    
    return rows.length > 0;
  } catch (error: any) {
    console.error('Error al verificar solicitud existente:', error);
    throw new Error('Error al verificar solicitud.');
  }
};

/**
 * Obtener conteo de solicitudes pendientes
 */
export const getConteoSolicitudesPendientes = async (
  tipo: 'unsa' | 'externo',
  userId: number
): Promise<number> => {
  try {
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM Solicitudes 
       WHERE destinatario_tipo = ? AND destinatario_id = ? AND estado = 'pendiente'`,
      [tipo, userId]
    );
    
    return rows[0].total;
  } catch (error: any) {
    console.error('Error al obtener conteo de solicitudes:', error);
    return 0;
  }
};
