import { Router } from "express";
import { HeliceExternaController } from "./helice-externa.controller";
import { authenticateToken } from "../../middleware/authMiddleware";

const router = Router();
const controller = new HeliceExternaController();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de registro para cada tipo
router.post("/gobierno", controller.registrarGobierno);
router.post("/colegio-profesional", controller.registrarColegioProfesional);
router.post("/empresa", controller.registrarEmpresa);
router.post("/sociedad-civil", controller.registrarSociedadCivil);

// Rutas para obtener registros del usuario
router.get("/mis-registros", controller.obtenerMisRegistros);
router.get("/desafios", controller.obtenerDesafios);

export default router;
