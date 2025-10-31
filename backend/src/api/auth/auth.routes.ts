import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

// POST /api/auth/register - Legacy
router.post('/register', authController.registerUser);

// POST /api/auth/register/academia
router.post('/register/academia', authController.registerAcademiaUser);

// POST /api/auth/register/gobierno
router.post('/register/gobierno', authController.registerGobiernoUser);

// POST /api/auth/register/empresa
router.post('/register/empresa', authController.registerEmpresaUser);

// POST /api/auth/register/sociedad-civil
router.post('/register/sociedad-civil', authController.registerSociedadCivilUser);

// POST /api/auth/register/unsa
router.post('/register/unsa', authController.registerUnsaUser);

// POST /api/auth/login
router.post('/login', authController.loginUser);

// GET /api/auth/verify
router.get('/verify', authController.verifyToken);

// GET /api/auth/me - Obtener info del usuario actual
router.get('/me', authController.getCurrentUser);

// GET /api/auth/dias - Temporary endpoint to check days
router.get('/dias', authController.getDias);

export default router;