// /backend/src/api/chats/chats.routes.ts
import { Router } from 'express';
import * as chatsController from './chats.controller';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);
router.use(authorizeRole(['unsa', 'externo']));

// Obtener todos los chats del usuario
router.get('/', chatsController.getChatsController);

// Obtener mensajes de un chat
router.get('/:chat_id/mensajes', chatsController.getMensajesController);

// Enviar mensaje a un chat
router.post('/:chat_id/mensajes', chatsController.enviarMensajeController);

// Obtener conteo de mensajes no leídos
router.get('/no-leidos/count', chatsController.getConteoMensajesNoLeidosController);

export default router;
