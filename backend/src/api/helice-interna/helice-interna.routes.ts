import { Router } from 'express';
import { HeliceInternaController } from './helice-interna.controller';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = Router();
const heliceInternaController = new HeliceInternaController();

// Rutas públicas (no requieren autenticación - necesarias para el registro)
router.get('/tipos', heliceInternaController.getTipos);
router.get('/ocde/areas', heliceInternaController.getAreasOCDE);
router.get('/ocde/areas/:areaId/sub-areas', heliceInternaController.getSubAreasOCDE);
router.get('/ocde/sub-areas/:subAreaId/disciplinas', heliceInternaController.getDisciplinasOCDE);
router.get('/ocde/sub-areas/:subAreaId', heliceInternaController.getSubAreaById);
router.get('/ocde/disciplinas/:disciplinaId', heliceInternaController.getDisciplinaById);
router.get('/ods/objetivos', heliceInternaController.getObjetivosODS);
router.get('/ods/objetivos/:objetivoId/metas', heliceInternaController.getMetasODS);
router.get('/ods/metas/:metaId', heliceInternaController.getMetaById);
router.get('/keywords', heliceInternaController.getKeywords);

// Rutas para usuarios UNSA
router.post('/registros', authenticateToken, heliceInternaController.crearRegistro);
router.get('/registros', authenticateToken, heliceInternaController.getRegistrosUsuario);
router.get('/registros/:id', authenticateToken, heliceInternaController.getRegistro);
router.put('/registros/:id', authenticateToken, heliceInternaController.actualizarRegistro);
router.delete('/registros/:id', authenticateToken, heliceInternaController.eliminarRegistro);
router.post('/registros/:id/completar', authenticateToken, heliceInternaController.completarRegistro);

// Rutas para administradores
router.get('/admin/registros', authenticateToken, heliceInternaController.getRegistrosParaAprobacion);
router.post('/admin/registros/:id/aprobar-rechazar', authenticateToken, heliceInternaController.aprobarRechazarRegistro);
router.get('/admin/capacidades', authenticateToken, heliceInternaController.obtenerTodasCapacidades);

export { router as heliceInternaRoutes };