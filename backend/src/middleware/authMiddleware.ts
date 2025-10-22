// /backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import dbPool from '../config/db'; // Needed to get profile ID
import { RowDataPacket } from 'mysql2';

// Extiende la interfaz Request para añadir la propiedad user y profileId
declare global {
  namespace Express {
    interface Request {
      user?: { 
        userId: number; 
        rol: string;
        investigador_id?: number;
        participante_id?: number;
      };
      profileId?: number; // ID del participante o investigador
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Token no proporcionado.' });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: number; rol: string };
    req.user = payload; // Guarda el payload básico

    // Solo buscar/crear perfiles para usuarios no-admin
    if (req.user.rol === 'admin') {
      // Los admins no necesitan perfil adicional
      next();
      return;
    }

    // Obtener el ID del perfil específico (participante_id o investigador_id)
    let profileIdResult: RowDataPacket[] = [];
    if (req.user.rol === 'externo') {
      [profileIdResult] = await dbPool.execute<RowDataPacket[]>(
        'SELECT participante_id FROM Participantes_Externos WHERE usuario_id = ?',
        [req.user.userId]
      );
      if (profileIdResult.length > 0) {
        req.profileId = profileIdResult[0].participante_id;
        req.user.participante_id = profileIdResult[0].participante_id;
      } else {
        // AUTO-FIX: Crear perfil automáticamente si no existe
        console.warn(`⚠️ Usuario externo ${req.user.userId} sin perfil. Creando automáticamente...`);
        try {
          const [result] = await dbPool.execute<any>(
            `INSERT INTO Participantes_Externos 
             (usuario_id, helice_id, nombres_apellidos, cargo, organizacion) 
             VALUES (?, 2, 'Perfil pendiente', 'Por completar', 'Por completar')`,
            [req.user.userId]
          );
          req.profileId = result.insertId;
          req.user.participante_id = result.insertId;
          console.log(`✅ Perfil creado automáticamente: participante_id=${result.insertId}`);
        } catch (createError) {
          console.error('❌ Error al crear perfil automático:', createError);
          return res.status(500).json({ 
            message: 'Error al crear perfil de usuario. Contacte al administrador.' 
          });
        }
      }
    } else if (req.user.rol === 'unsa') {
      [profileIdResult] = await dbPool.execute<RowDataPacket[]>(
        'SELECT investigador_id FROM Investigadores_UNSA WHERE usuario_id = ?',
        [req.user.userId]
      );
       if (profileIdResult.length > 0) {
        req.profileId = profileIdResult[0].investigador_id;
        req.user.investigador_id = profileIdResult[0].investigador_id;
      } else {
        // AUTO-FIX: Crear perfil automáticamente si no existe
        console.warn(`⚠️ Usuario UNSA ${req.user.userId} sin perfil. Creando automáticamente...`);
        try {
          const [result] = await dbPool.execute<any>(
            `INSERT INTO Investigadores_UNSA 
             (usuario_id, nombres_apellidos, cargo, unidad_academica) 
             VALUES (?, 'Perfil pendiente', 'Por completar', 'Por completar')`,
            [req.user.userId]
          );
          req.profileId = result.insertId;
          req.user.investigador_id = result.insertId;
          console.log(`✅ Perfil creado automáticamente: investigador_id=${result.insertId}`);
        } catch (createError) {
          console.error('❌ Error al crear perfil automático:', createError);
          return res.status(500).json({ 
            message: 'Error al crear perfil de usuario. Contacte al administrador.' 
          });
        }
      }
    }

    next(); // Pasa al siguiente middleware o controlador
  } catch (err) {
    console.error("Error al verificar token:", err);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

// Middleware específico para roles (opcional pero útil)
export const authorizeRole = (allowedRoles: string[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
       if (!req.user || !allowedRoles.includes(req.user.rol)) {
           return res.status(403).json({ message: 'Acceso denegado para este rol.' });
       }
       next();
   };
};

