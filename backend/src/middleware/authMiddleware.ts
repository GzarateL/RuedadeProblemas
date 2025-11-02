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

    // Intentar obtener el ID del perfil desde registros_helice_interna si existe
    try {
      const [heliceRecords] = await dbPool.execute<RowDataPacket[]>(
        'SELECT id FROM registros_helice_interna WHERE usuario_id = ? LIMIT 1',
        [req.user.userId]
      );
      if (heliceRecords.length > 0) {
        req.profileId = heliceRecords[0].id;
        if (req.user.rol === 'interno') {
          req.user.investigador_id = heliceRecords[0].id;
        } else if (req.user.rol === 'externo') {
          req.user.participante_id = heliceRecords[0].id;
        }
      }
    } catch (error) {
      // Si la tabla no existe, continuar sin perfil
      console.log('No se pudo obtener el perfil desde hélice interna');
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

