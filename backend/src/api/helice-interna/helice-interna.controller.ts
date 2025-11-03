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

      console.log('=== CREAR REGISTRO ===');
      console.log('Usuario ID:', userId);
      console.log('Tipo:', datosRegistro.tipo);
      console.log('Datos recibidos:', JSON.stringify(datosRegistro, null, 2));

      const registro = await this.heliceInternaService.crearRegistro(
        userId,
        datosRegistro
      );

      res.status(201).json(registro);
    } catch (error: any) {
      console.error('Error al crear registro:', error);
      console.error('Error stack:', error.stack);
      console.error('Error message:', error.message);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
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

      console.log('=== ACTUALIZAR REGISTRO ===');
      console.log('Usuario ID:', userId);
      console.log('Registro ID:', registroId);
      console.log('Tipo:', req.body.tipo);
      console.log('ODS recibido:', JSON.stringify(req.body.ods, null, 2));
      console.log('Total items ODS:', req.body.ods?.length || 0);

      const registro = await this.heliceInternaService.actualizarRegistro(
        registroId,
        userId,
        req.body
      );

      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json(registro);
    } catch (error: any) {
      console.error('Error al actualizar registro:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
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

  // Obtener información de una disciplina específica
  getDisciplinaById = async (req: Request, res: Response) => {
    try {
      const disciplinaId = parseInt(req.params.disciplinaId);
      const disciplina = await this.heliceInternaService.getDisciplinaById(disciplinaId);
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina no encontrada' });
      }
      res.json(disciplina);
    } catch (error) {
      console.error('Error al obtener disciplina:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener información de una sub-área específica
  getSubAreaById = async (req: Request, res: Response) => {
    try {
      const subAreaId = parseInt(req.params.subAreaId);
      const subArea = await this.heliceInternaService.getSubAreaById(subAreaId);
      if (!subArea) {
        return res.status(404).json({ error: 'Sub-área no encontrada' });
      }
      res.json(subArea);
    } catch (error) {
      console.error('Error al obtener sub-área:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Obtener información de una meta específica
  getMetaById = async (req: Request, res: Response) => {
    try {
      const metaId = parseInt(req.params.metaId);
      const meta = await this.heliceInternaService.getMetaById(metaId);
      if (!meta) {
        return res.status(404).json({ error: 'Meta no encontrada' });
      }
      res.json(meta);
    } catch (error) {
      console.error('Error al obtener meta:', error);
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

  // ADMIN: Obtener todas las capacidades (perfiles de hélice interna)
  obtenerTodasCapacidades = async (req: Request, res: Response) => {
    try {
      const userRole = req.user?.rol;
      if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden ver todas las capacidades' });
      }

      const capacidades = await this.heliceInternaService.obtenerTodasCapacidades();
      res.json(capacidades);
    } catch (error: any) {
      console.error('Error al obtener todas las capacidades:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error.message 
      });
    }
  };
}