// /backend/src/api/users/users.service.ts
import dbPool from '../../config/db';
import { RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcrypt';

export type Rol = 'admin' | 'externo' | 'interno';

export interface UserRow {
  usuario_id: number;
  email: string;
  rol: Rol;
  nombres_apellidos: string | null;
  telefono: string | null;
  unidad_academica: string | null;
}

export async function listUsers(
  q?: string,
  role?: Rol,
  page: number = 1,
  pageSize: number = 10
): Promise<{ data: UserRow[]; total: number }> {
  // Sanitizar y asegurar enteros finitos
  const safePageSize = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10;
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const offset = (safePage - 1) * safePageSize;

  const search = q ? `%${q}%` : '%';
  const roleCond = role ? 'AND u.rol = ?' : '';

  // Parámetros para WHERE (NO incluyen limit/offset)
  const paramsList: any[] = [search, search];
  const paramsCount: any[] = [search, search];
  if (role) {
    paramsList.push(role);
    paramsCount.push(role);
  }

  // Consulta simplificada usando solo la tabla Usuarios
  const listSql = `
    SELECT 
      u.usuario_id, 
      u.email, 
      u.rol,
      u.nombres_apellidos,
      NULL AS telefono,
      NULL AS unidad_academica
    FROM Usuarios u
    WHERE (u.email LIKE ? OR COALESCE(u.nombres_apellidos, '') LIKE ?)
      ${roleCond}
    ORDER BY u.usuario_id DESC
    LIMIT ${safePageSize} OFFSET ${offset}
  `;

  const [rows] = await dbPool.execute<RowDataPacket[]>(listSql, paramsList);

  const countSql = `
    SELECT COUNT(*) AS total
    FROM Usuarios u
    WHERE (u.email LIKE ? OR COALESCE(u.nombres_apellidos, '') LIKE ?)
      ${roleCond}
  `;
  const [countRows] = await dbPool.execute<RowDataPacket[]>(countSql, paramsCount);
  const total = Number((countRows[0] as any)?.total ?? 0);

  return { data: rows as unknown as UserRow[], total };
}

export async function deleteUser(userId: number): Promise<void> {
  // Eliminar el usuario directamente
  await dbPool.execute('DELETE FROM Usuarios WHERE usuario_id = ?', [userId]);
}

export async function createAdminUser(email: string, password: string, nombresApellidos?: string): Promise<number> {
  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await dbPool.execute<any>(
    'INSERT INTO Usuarios (email, password_hash, rol, nombres_apellidos) VALUES (?, ?, ?, ?)',
    [email, passwordHash, 'admin', nombresApellidos || null]
  );

  return result.insertId;
}
