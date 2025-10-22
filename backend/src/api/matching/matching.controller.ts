// /backend/src/api/matching/matching.controller.ts
import { Request, Response } from 'express';
import * as matchingService from './matching.service';

/**
 * Controlador para obtener capacidades que coinciden con un desafío.
 */
export const getCapacidadMatchesController = async (req: Request, res: Response) => {
  try {
    const desafioId = parseInt(req.params.id, 10);
    if (isNaN(desafioId)) {
      return res.status(400).json({ message: 'ID de desafío inválido.' });
    }

    const matches = await matchingService.findCapacidadMatchesForDesafio(desafioId);
    res.status(200).json(matches);

  } catch (error: any) {
    console.error("Error en getCapacidadMatchesController:", error);
    res.status(500).json({ message: error.message || 'Error interno al buscar coincidencias de capacidad.' });
  }
};

/**
 * Controlador para obtener desafíos que coinciden con una capacidad.
 */
export const getDesafioMatchesController = async (req: Request, res: Response) => {
   try {
    const capacidadId = parseInt(req.params.id, 10);
    if (isNaN(capacidadId)) {
      return res.status(400).json({ message: 'ID de capacidad inválido.' });
    }

    const matches = await matchingService.findDesafioMatchesForCapacidad(capacidadId);
    res.status(200).json(matches);

  } catch (error: any) {
    console.error("Error en getDesafioMatchesController:", error);
    res.status(500).json({ message: error.message || 'Error interno al buscar coincidencias de desafío.' });
  }
};

/**
 * Controlador para obtener el estado del sistema de matching
 */
export const getMatchingStatusController = async (req: Request, res: Response) => {
  try {
    const activo = await matchingService.getMatchingStatus();
    res.status(200).json({ activo });
  } catch (error: any) {
    console.error("Error en getMatchingStatusController:", error);
    res.status(500).json({ message: error.message || 'Error al obtener estado del matching.' });
  }
};

/**
 * Controlador para activar/desactivar el sistema de matching
 */
export const toggleMatchingStatusController = async (req: Request, res: Response) => {
  try {
    const { activo } = req.body;
    
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ message: 'El campo "activo" debe ser un booleano.' });
    }

    await matchingService.toggleMatchingStatus(activo);
    res.status(200).json({ 
      message: `Sistema de matching ${activo ? 'activado' : 'desactivado'} exitosamente.`,
      activo 
    });

  } catch (error: any) {
    console.error("Error en toggleMatchingStatusController:", error);
    res.status(500).json({ message: error.message || 'Error al cambiar estado del matching.' });
  }
};

/**
 * Controlador para obtener matches personalizados para el usuario actual
 */
export const getMyMatchesController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const profileId = req.profileId;
    
    console.log('=== DEBUG getMyMatchesController ===');
    console.log('User:', user);
    console.log('ProfileId:', profileId);
    
    if (!user) {
      console.error('Usuario no autenticado');
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    // Verificar si el matching está activo
    const matchingActivo = await matchingService.getMatchingStatus();
    console.log('Matching activo:', matchingActivo);
    
    if (!matchingActivo) {
      return res.status(200).json({ 
        matches: [], 
        message: 'El sistema de matching no está activo actualmente.' 
      });
    }

    let matches;
    
    if (user.rol === 'unsa') {
      // Para usuarios UNSA, buscar desafíos que coincidan con sus capacidades
      const investigadorId = user.investigador_id || profileId;
      console.log('Buscando matches para investigador:', investigadorId);
      
      if (!investigadorId) {
        console.error('Usuario UNSA sin investigador asociado');
        return res.status(400).json({ message: 'Usuario UNSA sin investigador asociado.' });
      }
      matches = await matchingService.getMatchesForInvestigador(investigadorId, 10);
      console.log('Matches encontrados para UNSA:', matches.length);
    } else if (user.rol === 'externo') {
      // Para usuarios externos, buscar capacidades que coincidan con sus desafíos
      const participanteId = user.participante_id || profileId;
      console.log('Buscando matches para participante:', participanteId);
      
      if (!participanteId) {
        console.error('Usuario externo sin participante asociado');
        return res.status(400).json({ message: 'Usuario externo sin participante asociado.' });
      }
      matches = await matchingService.getMatchesForParticipante(participanteId, 10);
      console.log('Matches encontrados para externo:', matches.length);
    } else {
      console.error('Tipo de usuario no válido:', user.rol);
      return res.status(403).json({ message: 'Tipo de usuario no válido para matching.' });
    }

    console.log('=== FIN DEBUG ===');
    res.status(200).json({ matches, tipo: user.rol });

  } catch (error: any) {
    console.error("Error en getMyMatchesController:", error);
    res.status(500).json({ message: error.message || 'Error al obtener matches personalizados.' });
  }
};