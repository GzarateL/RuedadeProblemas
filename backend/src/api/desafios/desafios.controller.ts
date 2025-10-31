// /backend/src/api/desafios/desafios.controller.ts
import { Request, Response } from 'express';
import * as desafioService from './desafios.service';
import multer from 'multer';

export const createDesafioController = async (req: Request, res: Response) => {
  try {
    // Verificaciones de autenticación y autorización (ya hechas por middleware)
    if (!req.user || req.user.rol !== 'externo' || !req.profileId) {
      // Esta verificación es redundante si los middlewares funcionan, pero es una salvaguarda
      return res.status(403).json({ message: 'Acción no permitida o perfil no encontrado.' });
    }

    // Log para depuración: Muestra lo que Multer puso en req.body y req.file
    console.log("CONTROLLER - req.body:", req.body);
    console.log("CONTROLLER - req.file:", req.file);

    // Verificación EXPLÍCITA del título en req.body
    const { titulo, descripcion, impacto, intentos_previos, solucion_imaginada, palabrasClave } = req.body;

    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
         console.error("Error: Título ausente o inválido en req.body después de Multer:", titulo);
         // Devuelve el error que viste en el frontend
         return res.status(400).json({ message: 'El título del desafío es obligatorio.' });
    }


    // Construye la URL o path del archivo si existe
    // Ajusta el path base según dónde sirvas los archivos estáticos o tu estrategia de almacenamiento
    const adjuntoUrl = req.file
         ? `/uploads/${req.file.filename}` // Ejemplo: URL relativa si sirves la carpeta 'uploads'
         // O podrías guardar la ruta completa: req.file.path
         : undefined;

    // Prepara los datos para el servicio, incluyendo el profileId del middleware
    const desafioData = {
      participante_id: req.profileId, // Obtenido por authenticateToken
      titulo: titulo.trim(), // Asegura quitar espacios extra
      descripcion: descripcion, // El servicio los convertirá a null si son falsy
      impacto: impacto,
      intentos_previos: intentos_previos,
      solucion_imaginada: solucion_imaginada,
      palabrasClave: palabrasClave,
      adjunto_url: adjuntoUrl,
    };

    console.log("CONTROLLER - Datos enviados al servicio:", desafioData);

    const result = await desafioService.createDesafio(desafioData);

    res.status(201).json({ message: 'Desafío registrado exitosamente', desafioId: result.insertId });

  } catch (error: any) {
     console.error("Error capturado en createDesafioController:", error);

     // Manejo específico si el error viene de Multer (ej: tipo de archivo inválido)
     if (error instanceof multer.MulterError) {
         return res.status(400).json({ message: `Error de Multer: ${error.message}` });
     } else if (error.message.startsWith('Tipo de archivo no permitido')) {
         return res.status(400).json({ message: error.message });
     }

     // Error general del servicio u otro
     res.status(500).json({ message: error.message || 'Error interno del servidor al registrar desafío' });
  }
};

// --- getMisDesafiosController y getAllDesafiosController sin cambios ---
export const getMisDesafiosController = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.rol !== 'externo' || !req.profileId) {
             return res.status(403).json({ message: 'Acción no permitida o perfil no encontrado.' });
        }
        const desafios = await desafioService.getDesafiosByParticipante(req.profileId);
        res.status(200).json(desafios);
    } catch (error: any) {
        console.error("Error en getMisDesafiosController:", error);
        res.status(500).json({ message: error.message || 'Error al obtener mis desafíos' });
    }
};

export const getAllDesafiosController = async (req: Request, res: Response) => {
     try {
        // Asume que el rol 'admin' ya fue verificado por authorizeRole
        const desafios = await desafioService.getAllDesafios();
        res.status(200).json(desafios);
    } catch (error: any) {
        console.error("Error en getAllDesafiosController:", error);
        res.status(500).json({ message: error.message || 'Error al obtener todos los desafíos' });
    }
}

export const getDesafioByIdController = async (req: Request, res: Response) => {
    try {
        const desafioId = parseInt(req.params.id);
        
        if (isNaN(desafioId)) {
            return res.status(400).json({ message: 'ID de desafío inválido' });
        }

        const desafio = await desafioService.getDesafioById(desafioId);
        
        if (!desafio) {
            return res.status(404).json({ message: 'Desafío no encontrado' });
        }

        // Verificar que el usuario sea el dueño o admin
        if (req.user?.rol !== 'admin' && desafio.participante_id !== req.profileId) {
            return res.status(403).json({ message: 'No tienes permiso para ver este desafío' });
        }

        res.status(200).json(desafio);
    } catch (error: any) {
        console.error("Error en getDesafioByIdController:", error);
        res.status(500).json({ message: error.message || 'Error al obtener el desafío' });
    }
}

export const updateDesafioController = async (req: Request, res: Response) => {
    try {
        if (!req.user || req.user.rol !== 'externo' || !req.profileId) {
            return res.status(403).json({ message: 'Acción no permitida' });
        }

        const desafioId = parseInt(req.params.id);
        
        if (isNaN(desafioId)) {
            return res.status(400).json({ message: 'ID de desafío inválido' });
        }

        // Verificar que el desafío existe y pertenece al usuario
        const desafioExistente = await desafioService.getDesafioById(desafioId);
        
        if (!desafioExistente) {
            return res.status(404).json({ message: 'Desafío no encontrado' });
        }

        if (desafioExistente.participante_id !== req.profileId) {
            return res.status(403).json({ message: 'No tienes permiso para editar este desafío' });
        }

        const { titulo, descripcion, impacto, intentos_previos, solucion_imaginada, palabrasClave } = req.body;

        if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
            return res.status(400).json({ message: 'El título del desafío es obligatorio.' });
        }

        const desafioData = {
            titulo: titulo.trim(),
            descripcion: descripcion || null,
            impacto: impacto || null,
            intentos_previos: intentos_previos || null,
            solucion_imaginada: solucion_imaginada || null,
            palabrasClave: palabrasClave || null,
        };

        await desafioService.updateDesafio(desafioId, desafioData);

        res.status(200).json({ message: 'Desafío actualizado exitosamente' });
    } catch (error: any) {
        console.error("Error en updateDesafioController:", error);
        res.status(500).json({ message: error.message || 'Error al actualizar el desafío' });
    }
}