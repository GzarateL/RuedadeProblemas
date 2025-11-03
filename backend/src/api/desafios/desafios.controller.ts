import { Request, Response } from "express";
import { DesafiosService } from "./desafios.service";

export class DesafiosController {
  private service: DesafiosService;

  constructor() {
    this.service = new DesafiosService();
  }

  crearDesafio = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (!user || !user.userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (user.rol !== 'externo') {
        return res.status(403).json({ error: "Solo usuarios externos pueden crear desafíos" });
      }

      const userId = user.userId;
      const data = req.body;

      const result = await this.service.crearDesafio(userId, data);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error en crearDesafio:", error);
      res.status(500).json({ error: error.message });
    }
  };

  obtenerMisDesafios = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const result = await this.service.obtenerDesafiosPorUsuario(userId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error en obtenerMisDesafios:", error);
      res.status(500).json({ error: error.message });
    }
  };

  obtenerDesafio = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const desafioId = parseInt(req.params.id);

      const result = await this.service.obtenerDesafio(desafioId, userId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error en obtenerDesafio:", error);
      res.status(500).json({ error: error.message });
    }
  };

  actualizarDesafio = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (!user || !user.userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (user.rol !== 'externo') {
        return res.status(403).json({ error: "Solo usuarios externos pueden actualizar desafíos" });
      }

      const userId = user.userId;
      const desafioId = parseInt(req.params.id);
      const data = req.body;

      const result = await this.service.actualizarDesafio(desafioId, userId, data);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error en actualizarDesafio:", error);
      res.status(500).json({ error: error.message });
    }
  };

  eliminarDesafio = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (!user || !user.userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (user.rol !== 'externo') {
        return res.status(403).json({ error: "Solo usuarios externos pueden eliminar desafíos" });
      }

      const userId = user.userId;
      const desafioId = parseInt(req.params.id);

      const result = await this.service.eliminarDesafio(desafioId, userId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error en eliminarDesafio:", error);
      res.status(500).json({ error: error.message });
    }
  };
}
