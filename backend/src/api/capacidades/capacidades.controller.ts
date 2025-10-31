// /backend/src/api/capacidades/capacidades.controller.ts
import { Request, Response } from 'express';
import * as capacidadService from './capacidades.service';

export const createCapacidadController = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.rol !== 'unsa' || !req.profileId) {
      return res.status(403).json({ message: 'Acción no permitida o perfil no encontrado.' });
    }

    const capacidadData = {
      ...req.body,
      investigador_id: req.profileId, // Usa el ID del perfil obtenido por el middleware
    };

    const result = await capacidadService.createCapacidad(capacidadData);
    res.status(201).json({ message: 'Capacidad registrada exitosamente', capacidadId: result.insertId });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

export const getMisCapacidadesController = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.rol !== 'unsa' || !req.profileId) {
             return res.status(403).json({ message: 'Acción no permitida o perfil no encontrado.' });
        }
        const capacidades = await capacidadService.getCapacidadesByInvestigador(req.profileId);
        res.status(200).json(capacidades);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error al obtener capacidades' });
    }
};

// (Opcional: Controlador para admin)
export const getAllCapacidadesController = async (req: Request, res: Response) => {
     try {
        // Asegúrate de que solo el admin acceda (ya protegido por authorizeRole en rutas)
        const capacidades = await capacidadService.getAllCapacidades();
        res.status(200).json(capacidades);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error al obtener todas las capacidades' });
    }
}

export const getCapacidadByIdController = async (req: Request, res: Response) => {
    try {
        const capacidadId = parseInt(req.params.id);
        
        if (isNaN(capacidadId)) {
            return res.status(400).json({ message: 'ID de capacidad inválido' });
        }

        const capacidad = await capacidadService.getCapacidadById(capacidadId);
        
        if (!capacidad) {
            return res.status(404).json({ message: 'Capacidad no encontrada' });
        }

        // Verificar que el usuario sea el dueño o admin
        if (req.user?.rol !== 'admin' && capacidad.investigador_id !== req.profileId) {
            return res.status(403).json({ message: 'No tienes permiso para ver esta capacidad' });
        }

        res.status(200).json(capacidad);
    } catch (error: any) {
        console.error("Error en getCapacidadByIdController:", error);
        res.status(500).json({ message: error.message || 'Error al obtener la capacidad' });
    }
}

export const updateCapacidadController = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.rol !== 'unsa' || !req.profileId) {
            return res.status(403).json({ message: 'Acción no permitida' });
        }

        const capacidadId = parseInt(req.params.id);
        
        if (isNaN(capacidadId)) {
            return res.status(400).json({ message: 'ID de capacidad inválido' });
        }

        // Verificar que la capacidad existe y pertenece al usuario
        const capacidadExistente = await capacidadService.getCapacidadById(capacidadId);
        
        if (!capacidadExistente) {
            return res.status(404).json({ message: 'Capacidad no encontrada' });
        }

        if (capacidadExistente.investigador_id !== req.profileId) {
            return res.status(403).json({ message: 'No tienes permiso para editar esta capacidad' });
        }

        const { descripcion_capacidad, problemas_que_resuelven, tipos_proyectos, equipamiento, palabrasClave, clave_interna } = req.body;

        if (!descripcion_capacidad || typeof descripcion_capacidad !== 'string' || descripcion_capacidad.trim() === '') {
            return res.status(400).json({ message: 'La descripción de la capacidad es obligatoria.' });
        }

        const capacidadData = {
            descripcion_capacidad: descripcion_capacidad.trim(),
            problemas_que_resuelven: problemas_que_resuelven || null,
            tipos_proyectos: tipos_proyectos || null,
            equipamiento: equipamiento || null,
            palabrasClave: palabrasClave || null,
            clave_interna: clave_interna || null,
        };

        await capacidadService.updateCapacidad(capacidadId, capacidadData);

        res.status(200).json({ message: 'Capacidad actualizada exitosamente' });
    } catch (error: any) {
        console.error("Error en updateCapacidadController:", error);
        res.status(500).json({ message: error.message || 'Error al actualizar la capacidad' });
    }
}