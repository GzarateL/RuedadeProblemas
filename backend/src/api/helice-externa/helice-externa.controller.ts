import { Request, Response } from "express";
import { HeliceExternaService } from "./helice-externa.service";

export class HeliceExternaController {
  private service: HeliceExternaService;

  constructor() {
    this.service = new HeliceExternaService();
  }

  registrarGobierno = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      console.log("Usuario autenticado:", user);
      
      if (!user || !user.userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (user.rol !== 'externo') {
        return res.status(403).json({ error: "Solo usuarios externos pueden registrarse en la hélice externa" });
      }

      const userId = user.userId;
      const data = req.body;

      const result = await this.service.registrarGobierno(userId, data);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error en registrarGobierno:", error);
      res.status(500).json({ error: error.message });
    }
  };

  registrarColegioProfesional = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (!user || !user.userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (user.rol !== 'externo') {
        return res.status(403).json({ error: "Solo usuarios externos pueden registrarse en la hélice externa" });
      }

      const userId = user.userId;
      const data = req.body;

      const result = await this.service.registrarColegioProfesional(userId, data);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error en registrarColegioProfesional:", error);
      res.status(500).json({ error: error.message });
    }
  };

  registrarEmpresa = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (!user || !user.userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (user.rol !== 'externo') {
        return res.status(403).json({ error: "Solo usuarios externos pueden registrarse en la hélice externa" });
      }

      const userId = user.userId;
      const data = req.body;

      const result = await this.service.registrarEmpresa(userId, data);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error en registrarEmpresa:", error);
      res.status(500).json({ error: error.message });
    }
  };

  registrarSociedadCivil = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      if (!user || !user.userId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
      }

      if (user.rol !== 'externo') {
        return res.status(403).json({ error: "Solo usuarios externos pueden registrarse en la hélice externa" });
      }

      const userId = user.userId;
      const data = req.body;

      const result = await this.service.registrarSociedadCivil(userId, data);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error en registrarSociedadCivil:", error);
      res.status(500).json({ error: error.message });
    }
  };

  obtenerMisRegistros = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const result = await this.service.obtenerMisRegistros(userId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error en obtenerMisRegistros:", error);
      res.status(500).json({ error: error.message });
    }
  };

  obtenerDesafios = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const result = await this.service.obtenerDesafios(userId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error en obtenerDesafios:", error);
      res.status(500).json({ error: error.message });
    }
  };

  verificarRegistro = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;

      const result = await this.service.verificarRegistro(userId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Error en verificarRegistro:", error);
      res.status(500).json({ error: error.message });
    }
  };
}
