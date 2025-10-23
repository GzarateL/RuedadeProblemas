// /backend/src/api/solicitudes/solicitudes.routes.ts
import { Router } from 'express';
import * as solicitudesController from './solicitudes.controller';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware';

const router = Router();

// Todas las rutas requieren autenticación y son para usuarios unsa/externo
router.use(authenticateToken);
router.use(authorizeRole(['unsa', 'externo']));

// Crear una nueva solicitud
router.post('/', solicitudesController.crearSolicitudController);

// Obtener solicitudes enviadas
router.get('/enviadas', solicitudesController.getSolicitudesEnviadasController);

// Obtener solicitudes recibidas
router.get('/recibidas', solicitudesController.getSolicitudesRecibidasController);

// Obtener conteo de solicitudes pendientes
router.get('/pendientes/count', solicitudesController.getConteoSolicitudesPendientesController);

// Responder a una solicitud
router.patch('/:solicitud_id/responder', solicitudesController.responderSolicitudController);

export default router;
