// /backend/src/api/capacidades/capacidades.routes.ts
import { Router } from 'express';
import * as capacidadController from './capacidades.controller';
import { authenticateToken, authorizeRole } from '../../middleware/authMiddleware';

const router = Router();

// Crear capacidad (solo rol 'unsa')
router.post(
  '/',
  authenticateToken,
  authorizeRole(['unsa']),
  capacidadController.createCapacidadController
);

// Obtener capacidades del investigador logueado (solo rol 'unsa')
router.get(
    '/mis-capacidades',
    authenticateToken,
    authorizeRole(['unsa']),
    capacidadController.getMisCapacidadesController
);

// Obtener todas las capacidades (solo rol 'admin') - Opcional
router.get(
    '/',
    authenticateToken,
    authorizeRole(['admin']),
    capacidadController.getAllCapacidadesController
);

// Obtener una capacidad por ID (solo el dueño o admin)
router.get(
    '/:id',
    authenticateToken,
    capacidadController.getCapacidadByIdController
);

// Actualizar una capacidad (solo el dueño)
router.put(
    '/:id',
    authenticateToken,
    authorizeRole(['unsa']),
    capacidadController.updateCapacidadController
);

export default router;