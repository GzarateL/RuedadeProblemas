// /backend/src/api/matching/matching.routes.ts
import { Router } from 'express';
import * as matchingController from './matching.controller';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware';

const router = Router();

// Rutas para usuarios autenticados (obtener sus propios matches)
router.get('/my-matches', authenticateToken, matchingController.getMyMatchesController);

// Rutas administrativas (solo admins)
router.get('/status', authenticateToken, authorizeRole(['admin']), matchingController.getMatchingStatusController);
router.post('/toggle', authenticateToken, authorizeRole(['admin']), matchingController.toggleMatchingStatusController);

// Ruta para obtener capacidades que coinciden con un desafío específico
router.get('/desafio/:id', authenticateToken, authorizeRole(['admin']), matchingController.getCapacidadMatchesController);

// Ruta para obtener desafíos que coinciden con una capacidad específica
router.get('/capacidad/:id', authenticateToken, authorizeRole(['admin']), matchingController.getDesafioMatchesController);

export default router;