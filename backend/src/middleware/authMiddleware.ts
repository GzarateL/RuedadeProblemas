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

    // Intentar obtener el ID del perfil según el rol
    if (req.user.rol === 'interno') {
      // Buscar en las tablas de hélice interna
      const tablas = [
        'Registro_Docente_Investigador',
        'Registro_Grupo_Centro_Instituto',
        'Registro_Laboratorio',
        'Registro_Centro_Produccion'
      ];
      
      for (const tabla of tablas) {
        try {
          const [records] = await dbPool.execute<RowDataPacket[]>(
            `SELECT registro_id FROM ${tabla} WHERE usuario_id = ? LIMIT 1`,
            [req.user.userId]
          );
          if (records.length > 0) {
            req.profileId = records[0].registro_id;
            req.user.investigador_id = records[0].registro_id;
            break;
          }
        } catch (error) {
          // Continuar con la siguiente tabla
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

