import { Router } from "express";
import { DesafiosController } from "./desafios.controller";
import { authenticateToken } from "../../middleware/authMiddleware";

const router = Router();
const controller = new DesafiosController();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de desafíos
router.post("/", controller.crearDesafio);
router.get("/", controller.obtenerMisDesafios);
router.get("/:id", controller.obtenerDesafio);
router.put("/:id", controller.actualizarDesafio);
router.delete("/:id", controller.eliminarDesafio);

export default router;
