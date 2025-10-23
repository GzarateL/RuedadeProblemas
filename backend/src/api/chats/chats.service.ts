// /backend/src/api/chats/chats.service.ts
import dbPool from '../../config/db';
import { RowDataPacket, OkPacket } from 'mysql2/promise';

export interface Chat extends RowDataPacket {
  chat_id: number;
  solicitud_id: number;
  usuario1_tipo: 'unsa' | 'externo';
  usuario1_id: number;
  usuario2_tipo: 'unsa' | 'externo';
  usuario2_id: number;
  tipo_match: 'capacidad' | 'desafio';
  match_id: number;
  titulo_chat: string;
  activo: boolean;
  fecha_creacion: string;
  ultima_actividad: string;
  // Campos adicionales del join
  otro_usuario_nombre?: string;
  mensajes_no_leidos?: number;
}

export interface Mensaje extends RowDataPacket {
  mensaje_id: number;
  chat_id: number;
  remitente_tipo: 'unsa' | 'externo';
  remitente_id: number;
  contenido: string;
  leido: boolean;
  fecha_envio: string;
  remitente_nombre?: string;
}

/**
 * Crear un chat cuando se acepta una solicitud
 */
export const crearChatDesdeSolicitud = async (solicitudId: number): Promise<number> => {
  const connection = await dbPool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Obtener datos de la solicitud
    const [solicitudes] = await connection.execute<RowDataPacket[]>(
      `SELECT 
        s.*,
        CASE
          WHEN s.tipo_match = 'capacidad' THEN c.descripcion_capacidad
          WHEN s.tipo_match = 'desafio' THEN d.titulo
        END AS titulo_match
       FROM Solicitudes s
       LEFT JOIN Capacidades_UNSA c ON s.tipo_match = 'capacidad' AND s.match_id = c.capacidad_id
       LEFT JOIN Desafios d ON s.tipo_match = 'desafio' AND s.match_id = d.desafio_id
       WHERE s.solicitud_id = ? AND s.estado = 'aceptada'`,
      [solicitudId]
    );
    
    if (solicitudes.length === 0) {
      throw new Error('Solicitud no encontrada o no está aceptada.');
    }
    
    const solicitud = solicitudes[0];
    
    // Verificar si ya existe un chat para esta solicitud
    const [chatsExistentes] = await connection.execute<RowDataPacket[]>(
      'SELECT chat_id FROM Chats WHERE solicitud_id = ?',
      [solicitudId]
    );
    
    if (chatsExistentes.length > 0) {
      await connection.commit();
      return chatsExistentes[0].chat_id;
    }
    
    // Crear el chat
    const [result] = await connection.execute<OkPacket>(
      `INSERT INTO Chats 
       (solicitud_id, usuario1_tipo, usuario1_id, usuario2_tipo, usuario2_id, tipo_match, match_id, titulo_chat)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        solicitudId,
        solicitud.remitente_tipo,
        solicitud.remitente_id,
        solicitud.destinatario_tipo,
        solicitud.destinatario_id,
        solicitud.tipo_match,
        solicitud.match_id,
        solicitud.titulo_match || 'Chat de colaboración'
      ]
    );
    
    await connection.commit();
    console.log(`✅ Chat creado: ID ${result.insertId} para solicitud ${solicitudId}`);
    return result.insertId;
    
  } catch (error: any) {
    await connection.rollback();
    console.error('Error al crear chat:', error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Obtener chats de un usuario
 */
export const getChatsDeUsuario = async (
  tipo: 'unsa' | 'externo',
  userId: number
): Promise<Chat[]> => {
  try {
    const query = `
      SELECT 
        c.*,
        CASE 
          WHEN c.usuario1_tipo = ? AND c.usuario1_id = ? THEN
            CASE 
              WHEN c.usuario2_tipo = 'unsa' THEN i.nombres_apellidos
              WHEN c.usuario2_tipo = 'externo' THEN p.nombres_apellidos
            END
          ELSE
            CASE 
              WHEN c.usuario1_tipo = 'unsa' THEN i2.nombres_apellidos
              WHEN c.usuario1_tipo = 'externo' THEN p2.nombres_apellidos
            END
        END AS otro_usuario_nombre,
        (SELECT COUNT(*) FROM Mensajes m 
         WHERE m.chat_id = c.chat_id 
         AND m.leido = FALSE 
         AND NOT (m.remitente_tipo = ? AND m.remitente_id = ?)) AS mensajes_no_leidos
      FROM Chats c
      LEFT JOIN Investigadores_UNSA i ON c.usuario2_tipo = 'unsa' AND c.usuario2_id = i.investigador_id
      LEFT JOIN Participantes_Externos p ON c.usuario2_tipo = 'externo' AND c.usuario2_id = p.participante_id
      LEFT JOIN Investigadores_UNSA i2 ON c.usuario1_tipo = 'unsa' AND c.usuario1_id = i2.investigador_id
      LEFT JOIN Participantes_Externos p2 ON c.usuario1_tipo = 'externo' AND c.usuario1_id = p2.participante_id
      WHERE (c.usuario1_tipo = ? AND c.usuario1_id = ?) 
         OR (c.usuario2_tipo = ? AND c.usuario2_id = ?)
      ORDER BY c.ultima_actividad DESC
    `;
    
    const [rows] = await dbPool.execute<Chat[]>(query, [
      tipo, userId, tipo, userId, tipo, userId, tipo, userId
    ]);
    
    return rows;
  } catch (error: any) {
    console.error('Error al obtener chats:', error);
    throw new Error('Error al obtener chats.');
  }
};

/**
 * Obtener mensajes de un chat
 */
export const getMensajesDeChat = async (
  chatId: number,
  tipo: 'unsa' | 'externo',
  userId: number
): Promise<Mensaje[]> => {
  try {
    // Verificar que el usuario pertenece al chat
    const [chats] = await dbPool.execute<RowDataPacket[]>(
      `SELECT chat_id FROM Chats 
       WHERE chat_id = ? 
       AND ((usuario1_tipo = ? AND usuario1_id = ?) OR (usuario2_tipo = ? AND usuario2_id = ?))`,
      [chatId, tipo, userId, tipo, userId]
    );
    
    if (chats.length === 0) {
      throw new Error('No tienes acceso a este chat.');
    }
    
    // Obtener mensajes
    const query = `
      SELECT 
        m.*,
        CASE 
          WHEN m.remitente_tipo = 'unsa' THEN i.nombres_apellidos
          WHEN m.remitente_tipo = 'externo' THEN p.nombres_apellidos
        END AS remitente_nombre
      FROM Mensajes m
      LEFT JOIN Investigadores_UNSA i ON m.remitente_tipo = 'unsa' AND m.remitente_id = i.investigador_id
      LEFT JOIN Participantes_Externos p ON m.remitente_tipo = 'externo' AND m.remitente_id = p.participante_id
      WHERE m.chat_id = ?
      ORDER BY m.fecha_envio ASC
    `;
    
    const [rows] = await dbPool.execute<Mensaje[]>(query, [chatId]);
    return rows;
  } catch (error: any) {
    console.error('Error al obtener mensajes:', error);
    throw error;
  }
};

/**
 * Enviar un mensaje
 */
export const enviarMensaje = async (
  chatId: number,
  remitenteTipo: 'unsa' | 'externo',
  remitenteId: number,
  contenido: string
): Promise<number> => {
  try {
    // Verificar acceso al chat
    const [chats] = await dbPool.execute<RowDataPacket[]>(
      `SELECT chat_id FROM Chats 
       WHERE chat_id = ? 
       AND ((usuario1_tipo = ? AND usuario1_id = ?) OR (usuario2_tipo = ? AND usuario2_id = ?))`,
      [chatId, remitenteTipo, remitenteId, remitenteTipo, remitenteId]
    );
    
    if (chats.length === 0) {
      throw new Error('No tienes acceso a este chat.');
    }
    
    // Insertar mensaje
    const [result] = await dbPool.execute<OkPacket>(
      `INSERT INTO Mensajes (chat_id, remitente_tipo, remitente_id, contenido)
       VALUES (?, ?, ?, ?)`,
      [chatId, remitenteTipo, remitenteId, contenido]
    );
    
    console.log(`✅ Mensaje enviado: ID ${result.insertId}`);
    return result.insertId;
  } catch (error: any) {
    console.error('Error al enviar mensaje:', error);
    throw error;
  }
};

/**
 * Marcar mensajes como leídos
 */
export const marcarMensajesComoLeidos = async (
  chatId: number,
  tipo: 'unsa' | 'externo',
  userId: number
): Promise<void> => {
  try {
    await dbPool.execute(
      `UPDATE Mensajes 
       SET leido = TRUE 
       WHERE chat_id = ? 
       AND NOT (remitente_tipo = ? AND remitente_id = ?)
       AND leido = FALSE`,
      [chatId, tipo, userId]
    );
  } catch (error: any) {
    console.error('Error al marcar mensajes como leídos:', error);
    throw new Error('Error al marcar mensajes como leídos.');
  }
};

/**
 * Obtener conteo de mensajes no leídos
 */
export const getConteoMensajesNoLeidos = async (
  tipo: 'unsa' | 'externo',
  userId: number
): Promise<number> => {
  try {
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total 
       FROM Mensajes m
       JOIN Chats c ON m.chat_id = c.chat_id
       WHERE m.leido = FALSE 
       AND NOT (m.remitente_tipo = ? AND m.remitente_id = ?)
       AND ((c.usuario1_tipo = ? AND c.usuario1_id = ?) OR (c.usuario2_tipo = ? AND c.usuario2_id = ?))`,
      [tipo, userId, tipo, userId, tipo, userId]
    );
    
    return rows[0].total;
  } catch (error: any) {
    console.error('Error al obtener conteo de mensajes:', error);
    return 0;
  }
};
