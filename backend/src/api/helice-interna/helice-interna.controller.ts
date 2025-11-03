import { Request, Response } from 'express';
import { HeliceInternaService } from './helice-interna.service';

export class HeliceInternaController {
  private heliceInternaService: HeliceInternaService;

  constructor() {
    this.heliceInternaService = new HeliceInternaService();
  }

  // Obtener tipos de hélice interna disponibles
  getTipos = async (req: Request, res: Response) => {
    try {
      const tipos = await this.heliceInternaService.getTipos();
      res.json(tipos);
    } catch (error) {
      console.error('Error al obtener tipos de hélice interna:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Crear un nuevo registro de hélice interna
  crearRegistro = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const datosRegistro = req.body;
      
      const registro = await this.heliceInternaService.crearRegistro(
        userId,
        datosRegistro
      );

      res.status(201).json(registro);
    } catch (error) {
      console.error('Error al crear registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Actualizar un registro existente
  actualizarRegistro = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const registroId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const registro = await this.heliceInternaService.actualizarRegistro(
        registroId,
        userId,
        req.body
      );

      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json(registro);
    } catch (error) {
      console.error('Error al actualizar registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener registros del usuario
  getRegistrosUsuario = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const registros = await this.heliceInternaService.getRegistrosByUsuario(userId);
      res.json(registros);
    } catch (error) {
      console.error('Error al obtener registros del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener un registro específico
  getRegistro = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const registroId = parseInt(req.params.id);
      const tipo = req.query.tipo as string;
      
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      if (!tipo) {
        return res.status(400).json({ error: 'Tipo de registro requerido' });
      }

      const registro = await this.heliceInternaService.getRegistroById(registroId, userId, tipo);
      
      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json(registro);
    } catch (error) {
      console.error('Error al obtener registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Completar y enviar registro para aprobación
  completarRegistro = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const registroId = parseInt(req.params.id);
      const { tipo } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      if (!tipo) {
        return res.status(400).json({ error: 'Tipo de registro requerido' });
      }

      const registro = await this.heliceInternaService.completarRegistro(registroId, userId, tipo);
      
      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json(registro);
    } catch (error) {
      console.error('Error al completar registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Eliminar un registro
  eliminarRegistro = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const registroId = parseInt(req.params.id);
      const tipo = req.query.tipo as string;
      
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      if (!tipo) {
        return res.status(400).json({ error: 'Tipo de registro requerido' });
      }

      const eliminado = await this.heliceInternaService.eliminarRegistro(registroId, userId, tipo);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener áreas OCDE (público)
  getAreasOCDE = async (req: Request, res: Response) => {
    try {
      const areas = await this.heliceInternaService.getAreasOCDE();
      res.json(areas);
    } catch (error) {
      console.error('Error al obtener áreas OCDE:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener sub-áreas OCDE por área
  getSubAreasOCDE = async (req: Request, res: Response) => {
    try {
      const areaId = parseInt(req.params.areaId);
      const subAreas = await this.heliceInternaService.getSubAreasByArea(areaId);
      res.json(subAreas);
    } catch (error) {
      console.error('Error al obtener sub-áreas OCDE:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener disciplinas OCDE por sub-área
  getDisciplinasOCDE = async (req: Request, res: Response) => {
    try {
      const subAreaId = parseInt(req.params.subAreaId);
      const disciplinas = await this.heliceInternaService.getDisciplinasBySubArea(subAreaId);
      res.json(disciplinas);
    } catch (error) {
      console.error('Error al obtener disciplinas OCDE:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener objetivos ODS
  getObjetivosODS = async (req: Request, res: Response) => {
    try {
      const objetivos = await this.heliceInternaService.getObjetivosODS();
      res.json(objetivos);
    } catch (error) {
      console.error('Error al obtener objetivos ODS:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener metas ODS por objetivo
  getMetasODS = async (req: Request, res: Response) => {
    try {
      const objetivoId = parseInt(req.params.objetivoId);
      const metas = await this.heliceInternaService.getMetasByObjetivo(objetivoId);
      res.json(metas);
    } catch (error) {
      console.error('Error al obtener metas ODS:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener catálogo de palabras clave
  getKeywords = async (req: Request, res: Response) => {
    try {
      const keywords = await this.heliceInternaService.getKeywords();
      res.json(keywords);
    } catch (error) {
      console.error('Error al obtener palabras clave:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // ADMIN: Obtener todos los registros para aprobación
  getRegistrosParaAprobacion = async (req: Request, res: Response) => {
    try {
      const userRole = req.user?.rol;
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
      }

      const registros = await this.heliceInternaService.getRegistrosParaAprobacion();
      res.json(registros);
    } catch (error) {
      console.error('Error al obtener registros para aprobación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // ADMIN: Aprobar o rechazar registro
  aprobarRechazarRegistro = async (req: Request, res: Response) => {
    try {
      const userRole = req.user?.rol;
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' });
      }

      const registroId = parseInt(req.params.id);
      const { tipo, estado, observaciones } = req.body;

      if (!tipo) {
        return res.status(400).json({ error: 'Tipo de registro requerido' });
      }

      if (!['aprobado', 'rechazado'].includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      const registro = await this.heliceInternaService.aprobarRechazarRegistro(
        registroId,
        tipo,
        estado,
        observaciones
      );

      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json(registro);
    } catch (error) {
      console.error('Error al aprobar/rechazar registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
}