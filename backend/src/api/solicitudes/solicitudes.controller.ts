// /backend/src/api/solicitudes/solicitudes.controller.ts
import { Request, Response } from 'express';
import * as solicitudesService from './solicitudes.service';
import * as chatsService from '../chats/chats.service';

/**
 * Crear una nueva solicitud
 */
export const crearSolicitudController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    const { destinatario_tipo, destinatario_id, tipo_match, match_id, mensaje } = req.body;
    
    // Validaciones
    if (!destinatario_tipo || !destinatario_id || !tipo_match || !match_id) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: destinatario_tipo, destinatario_id, tipo_match, match_id' 
      });
    }
    
    if (!['unsa', 'externo'].includes(destinatario_tipo)) {
      return res.status(400).json({ message: 'destinatario_tipo debe ser "unsa" o "externo"' });
    }
    
    if (!['capacidad', 'desafio'].includes(tipo_match)) {
      return res.status(400).json({ message: 'tipo_match debe ser "capacidad" o "desafio"' });
    }
    
    // Evitar auto-solicitudes
    const remitenteTipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    if (remitenteTipo === destinatario_tipo && profileId === destinatario_id) {
      return res.status(400).json({ message: 'No puedes enviarte una solicitud a ti mismo.' });
    }
    
    // Verificar si ya existe una solicitud
    const existe = await solicitudesService.existeSolicitud(
      remitenteTipo,
      profileId,
      destinatario_tipo,
      destinatario_id,
      tipo_match,
      match_id
    );
    
    if (existe) {
      return res.status(409).json({ message: 'Ya has enviado una solicitud a este perfil.' });
    }
    
    // Crear la solicitud
    const solicitudId = await solicitudesService.crearSolicitud({
      remitente_tipo: remitenteTipo,
      remitente_id: profileId,
      destinatario_tipo,
      destinatario_id,
      tipo_match,
      match_id,
      mensaje
    });
    
    res.status(201).json({ 
      message: 'Solicitud enviada exitosamente.',
      solicitud_id: solicitudId 
    });
    
  } catch (error: any) {
    console.error('Error en crearSolicitudController:', error);
    res.status(500).json({ message: error.message || 'Error al crear solicitud.' });
  }
};

/**
 * Obtener solicitudes enviadas por el usuario actual
 */
export const getSolicitudesEnviadasController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    const tipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    const solicitudes = await solicitudesService.getSolicitudesEnviadas(tipo, profileId);
    
    res.status(200).json({ solicitudes });
    
  } catch (error: any) {
    console.error('Error en getSolicitudesEnviadasController:', error);
    res.status(500).json({ message: error.message || 'Error al obtener solicitudes enviadas.' });
  }
};

/**
 * Obtener solicitudes recibidas por el usuario actual
 */
export const getSolicitudesRecibidasController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    const tipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    const solicitudes = await solicitudesService.getSolicitudesRecibidas(tipo, profileId);
    
    res.status(200).json({ solicitudes });
    
  } catch (error: any) {
    console.error('Error en getSolicitudesRecibidasController:', error);
    res.status(500).json({ message: error.message || 'Error al obtener solicitudes recibidas.' });
  }
};

/**
 * Responder a una solicitud (aceptar o rechazar)
 */
export const responderSolicitudController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    const { solicitud_id } = req.params;
    const { estado } = req.body;
    
    if (!estado || !['aceptada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ message: 'Estado debe ser "aceptada" o "rechazada"' });
    }
    
    const tipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    
    await solicitudesService.actualizarEstadoSolicitud(
      parseInt(solicitud_id),
      tipo,
      profileId,
      estado
    );
    
    let chatId = null;
    
    // Si se acepta, crear el chat automáticamente
    if (estado === 'aceptada') {
      try {
        chatId = await chatsService.crearChatDesdeSolicitud(parseInt(solicitud_id));
        console.log(`✅ Chat creado automáticamente: ${chatId}`);
      } catch (chatError: any) {
        console.error('Error al crear chat:', chatError);
        // No fallar la respuesta si el chat no se crea
      }
    }
    
    res.status(200).json({ 
      message: `Solicitud ${estado} exitosamente.`,
      estado,
      chat_id: chatId // Devolver el ID del chat si se creó
    });
    
  } catch (error: any) {
    console.error('Error en responderSolicitudController:', error);
    res.status(500).json({ message: error.message || 'Error al responder solicitud.' });
  }
};

/**
 * Obtener conteo de solicitudes pendientes
 */
export const getConteoSolicitudesPendientesController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    const tipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    const total = await solicitudesService.getConteoSolicitudesPendientes(tipo, profileId);
    
    res.status(200).json({ total });
    
  } catch (error: any) {
    console.error('Error en getConteoSolicitudesPendientesController:', error);
    res.status(500).json({ message: error.message || 'Error al obtener conteo.' });
  }
};
