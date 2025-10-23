// /backend/src/api/chats/chats.controller.ts
import { Request, Response } from 'express';
import * as chatsService from './chats.service';

/**
 * Obtener todos los chats del usuario
 */
export const getChatsController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    const tipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    const chats = await chatsService.getChatsDeUsuario(tipo, profileId);
    
    res.status(200).json({ chats });
  } catch (error: any) {
    console.error('Error en getChatsController:', error);
    res.status(500).json({ message: error.message || 'Error al obtener chats.' });
  }
};

/**
 * Obtener mensajes de un chat específico
 */
export const getMensajesController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    const { chat_id } = req.params;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    const tipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    const mensajes = await chatsService.getMensajesDeChat(
      parseInt(chat_id),
      tipo,
      profileId
    );
    
    // Marcar mensajes como leídos
    await chatsService.marcarMensajesComoLeidos(parseInt(chat_id), tipo, profileId);
    
    res.status(200).json({ mensajes });
  } catch (error: any) {
    console.error('Error en getMensajesController:', error);
    res.status(500).json({ message: error.message || 'Error al obtener mensajes.' });
  }
};

/**
 * Enviar un mensaje
 */
export const enviarMensajeController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    const { chat_id } = req.params;
    const { contenido } = req.body;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    if (!contenido || contenido.trim().length === 0) {
      return res.status(400).json({ message: 'El contenido del mensaje es requerido.' });
    }
    
    const tipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    const mensajeId = await chatsService.enviarMensaje(
      parseInt(chat_id),
      tipo,
      profileId,
      contenido.trim()
    );
    
    res.status(201).json({ 
      message: 'Mensaje enviado exitosamente.',
      mensaje_id: mensajeId 
    });
  } catch (error: any) {
    console.error('Error en enviarMensajeController:', error);
    res.status(500).json({ message: error.message || 'Error al enviar mensaje.' });
  }
};

/**
 * Obtener conteo de mensajes no leídos
 */
export const getConteoMensajesNoLeidosController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    
    if (!user || !profileId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    
    const tipo = user.rol === 'unsa' ? 'unsa' : 'externo';
    const total = await chatsService.getConteoMensajesNoLeidos(tipo, profileId);
    
    res.status(200).json({ total });
  } catch (error: any) {
    console.error('Error en getConteoMensajesNoLeidosController:', error);
    res.status(500).json({ message: error.message || 'Error al obtener conteo.' });
  }
};
