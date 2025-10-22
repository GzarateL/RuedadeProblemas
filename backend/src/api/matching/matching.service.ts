// /backend/src/api/matching/matching.service.ts
import dbPool from '../../config/db';
import { RowDataPacket, OkPacket } from 'mysql2/promise';

// Interfaz para describir un resultado de match (Capacidad encontrada para un Desafío)
export interface CapacidadMatch extends RowDataPacket {
  capacidad_id: number;
  descripcion_capacidad: string;
  investigador_nombre: string | null;
  palabras_coincidentes: string;
  total_coincidencias: number;
}

// Interfaz para describir un resultado de match (Desafío encontrado para una Capacidad)
export interface DesafioMatch extends RowDataPacket {
  desafio_id: number;
  titulo: string;
  descripcion: string | null;
  participante_nombre: string | null;
  organizacion: string | null;
  palabras_coincidentes: string;
  total_coincidencias: number;
}

// Interfaz para el estado del matching
export interface MatchingStatus extends RowDataPacket {
  activo: boolean;
  fecha_activacion: string | null;
}

/**
 * Encuentra Capacidades que coinciden con las palabras clave de un Desafío específico.
 */
export const findCapacidadMatchesForDesafio = async (desafioId: number): Promise<CapacidadMatch[]> => {
  if (!desafioId || typeof desafioId !== 'number' || !Number.isInteger(desafioId) || desafioId <= 0) {
    throw new Error('ID de desafío inválido.');
  }

  try {
    const query = `
      SELECT
          c.capacidad_id,
          c.descripcion_capacidad,
          i.nombres_apellidos AS investigador_nombre,
          GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') AS palabras_coincidentes,
          COUNT(DISTINCT pc.palabra_clave_id) AS total_coincidencias
      FROM Desafios_PalabrasClave dpc
      JOIN Capacidades_PalabrasClave cpc ON dpc.palabra_clave_id = cpc.palabra_clave_id
      JOIN PalabrasClave pc ON dpc.palabra_clave_id = pc.palabra_clave_id
      JOIN Capacidades_UNSA c ON cpc.capacidad_id = c.capacidad_id
      LEFT JOIN Investigadores_UNSA i ON c.investigador_id = i.investigador_id
      WHERE dpc.desafio_id = ?
      GROUP BY c.capacidad_id
      ORDER BY total_coincidencias DESC, c.capacidad_id ASC;
    `;

    const [rows] = await dbPool.execute<CapacidadMatch[]>(query, [desafioId]);
    console.log(`Encontradas ${rows.length} capacidades coincidentes para desafío ${desafioId}`);
    return rows;

  } catch (error: any) {
    console.error(`Error al buscar matches de capacidad para desafío ${desafioId}:`, error);
    throw new Error('Error al buscar capacidades coincidentes.');
  }
};

/**
 * Encuentra Desafíos que coinciden con las palabras clave de una Capacidad específica.
 */
export const findDesafioMatchesForCapacidad = async (capacidadId: number): Promise<DesafioMatch[]> => {
   if (!capacidadId || typeof capacidadId !== 'number' || !Number.isInteger(capacidadId) || capacidadId <= 0) {
    throw new Error('ID de capacidad inválido.');
  }
   try {
     const query = `
       SELECT
           d.desafio_id,
           d.titulo,
           d.descripcion,
           p.nombres_apellidos AS participante_nombre,
           p.organizacion,
           GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') AS palabras_coincidentes,
           COUNT(DISTINCT pc.palabra_clave_id) AS total_coincidencias
       FROM Capacidades_PalabrasClave cpc
       JOIN Desafios_PalabrasClave dpc ON cpc.palabra_clave_id = dpc.palabra_clave_id
       JOIN PalabrasClave pc ON cpc.palabra_clave_id = pc.palabra_clave_id
       JOIN Desafios d ON dpc.desafio_id = d.desafio_id
       LEFT JOIN Participantes_Externos p ON d.participante_id = p.participante_id
       WHERE cpc.capacidad_id = ?
       GROUP BY d.desafio_id
       ORDER BY total_coincidencias DESC, d.desafio_id ASC;
     `;

     const [rows] = await dbPool.execute<DesafioMatch[]>(query, [capacidadId]);
     console.log(`Encontrados ${rows.length} desafíos coincidentes para capacidad ${capacidadId}`);
     return rows;

   } catch (error: any) {
     console.error(`Error al buscar matches de desafío para capacidad ${capacidadId}:`, error);
     throw new Error('Error al buscar desafíos coincidentes.');
   }
};

/**
 * Obtiene el estado actual del sistema de matching
 */
export const getMatchingStatus = async (): Promise<boolean> => {
  try {
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      'SELECT activo, fecha_activacion FROM estado_matching WHERE id = 1'
    );
    
    if (rows.length === 0) {
      // Si no existe, crear el registro con estado inactivo
      await dbPool.execute(
        'INSERT INTO estado_matching (id, activo) VALUES (1, FALSE)'
      );
      return false;
    }
    
    return rows[0].activo === 1 || rows[0].activo === true;
  } catch (error: any) {
    console.error('Error al obtener estado de matching:', error);
    throw new Error('Error al obtener el estado del matching.');
  }
};

/**
 * Activa o desactiva el sistema de matching
 */
export const toggleMatchingStatus = async (activo: boolean): Promise<void> => {
  try {
    await dbPool.execute(
      `INSERT INTO estado_matching (id, activo, fecha_activacion) 
       VALUES (1, ?, NOW()) 
       ON DUPLICATE KEY UPDATE activo = ?, fecha_activacion = IF(? = TRUE, NOW(), fecha_activacion)`,
      [activo, activo, activo]
    );
    console.log(`Sistema de matching ${activo ? 'activado' : 'desactivado'}`);
  } catch (error: any) {
    console.error('Error al cambiar estado de matching:', error);
    throw new Error('Error al cambiar el estado del matching.');
  }
};

/**
 * Obtiene los mejores matches para un usuario profesional/UNSA (basado en sus capacidades)
 */
export const getMatchesForInvestigador = async (investigadorId: number, limit: number = 10): Promise<DesafioMatch[]> => {
  try {
    const query = `
      SELECT DISTINCT
          d.desafio_id,
          d.titulo,
          d.descripcion,
          p.nombres_apellidos AS participante_nombre,
          p.organizacion,
          GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') AS palabras_coincidentes,
          COUNT(DISTINCT pc.palabra_clave_id) AS total_coincidencias
      FROM Capacidades_UNSA c
      JOIN Capacidades_PalabrasClave cpc ON c.capacidad_id = cpc.capacidad_id
      JOIN Desafios_PalabrasClave dpc ON cpc.palabra_clave_id = dpc.palabra_clave_id
      JOIN PalabrasClave pc ON cpc.palabra_clave_id = pc.palabra_clave_id
      JOIN Desafios d ON dpc.desafio_id = d.desafio_id
      LEFT JOIN Participantes_Externos p ON d.participante_id = p.participante_id
      WHERE c.investigador_id = ?
      GROUP BY d.desafio_id
      ORDER BY total_coincidencias DESC, d.desafio_id DESC
      LIMIT ?;
    `;

    const [rows] = await dbPool.execute<DesafioMatch[]>(query, [investigadorId, limit]);
    return rows;
  } catch (error: any) {
    console.error(`Error al obtener matches para investigador ${investigadorId}:`, error);
    throw new Error('Error al obtener matches para el investigador.');
  }
};

/**
 * Obtiene los mejores matches para un participante externo (basado en sus desafíos)
 */
export const getMatchesForParticipante = async (participanteId: number, limit: number = 10): Promise<CapacidadMatch[]> => {
  try {
    const query = `
      SELECT DISTINCT
          c.capacidad_id,
          c.descripcion_capacidad,
          i.nombres_apellidos AS investigador_nombre,
          GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') AS palabras_coincidentes,
          COUNT(DISTINCT pc.palabra_clave_id) AS total_coincidencias
      FROM Desafios d
      JOIN Desafios_PalabrasClave dpc ON d.desafio_id = dpc.desafio_id
      JOIN Capacidades_PalabrasClave cpc ON dpc.palabra_clave_id = cpc.palabra_clave_id
      JOIN PalabrasClave pc ON dpc.palabra_clave_id = pc.palabra_clave_id
      JOIN Capacidades_UNSA c ON cpc.capacidad_id = c.capacidad_id
      LEFT JOIN Investigadores_UNSA i ON c.investigador_id = i.investigador_id
      WHERE d.participante_id = ?
      GROUP BY c.capacidad_id
      ORDER BY total_coincidencias DESC, c.capacidad_id DESC
      LIMIT ?;
    `;

    const [rows] = await dbPool.execute<CapacidadMatch[]>(query, [participanteId, limit]);
    return rows;
  } catch (error: any) {
    console.error(`Error al obtener matches para participante ${participanteId}:`, error);
    throw new Error('Error al obtener matches para el participante.');
  }
};
