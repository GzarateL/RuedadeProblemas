// /backend/src/api/matching/matching.service.ts
import dbPool from '../../config/db';
import { RowDataPacket, OkPacket } from 'mysql2/promise';

// Interfaz para describir un resultado de match (Capacidad encontrada para un Desafío)
export interface CapacidadMatch extends RowDataPacket {
  capacidad_id: number;
  descripcion_capacidad: string;
  investigador_id: number;
  investigador_nombre: string | null;
  palabras_coincidentes: string;
  total_coincidencias: number;
}

// Interfaz para describir un resultado de match (Desafío encontrado para una Capacidad)
export interface DesafioMatch extends RowDataPacket {
  desafio_id: number;
  titulo: string;
  descripcion: string | null;
  participante_id: number;
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
 * ACTUALIZADO: Usa registros_helice_interna en lugar de Capacidades_UNSA
 */
export const findCapacidadMatchesForDesafio = async (desafioId: number): Promise<CapacidadMatch[]> => {
  if (!desafioId || typeof desafioId !== 'number' || !Number.isInteger(desafioId) || desafioId <= 0) {
    throw new Error('ID de desafío inválido.');
  }

  try {
    const query = `
      SELECT
          r.id AS capacidad_id,
          COALESCE(r.nombre_completo, r.nombre_entidad) AS descripcion_capacidad,
          r.investigador_id,
          i.nombres_apellidos AS investigador_nombre,
          GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') AS palabras_coincidentes,
          COUNT(DISTINCT pc.palabra_clave_id) AS total_coincidencias
      FROM Desafios_PalabrasClave dpc
      JOIN registro_keywords rk ON dpc.palabra_clave_id = rk.palabra_clave_id
      JOIN PalabrasClave pc ON dpc.palabra_clave_id = pc.palabra_clave_id
      JOIN registros_helice_interna r ON rk.registro_id = r.id
      LEFT JOIN Investigadores_UNSA i ON r.investigador_id = i.investigador_id
      WHERE dpc.desafio_id = ? AND r.estado = 'aprobado'
      GROUP BY r.id
      ORDER BY total_coincidencias DESC, r.id ASC;
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
 * ACTUALIZADO: Usa registros_helice_interna en lugar de Capacidades_UNSA
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
           d.participante_id,
           p.nombre_organizacion AS participante_nombre,
           p.nombre_organizacion AS organizacion,
           GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') AS palabras_coincidentes,
           COUNT(DISTINCT pc.palabra_clave_id) AS total_coincidencias
       FROM registro_keywords rk
       JOIN Desafios_PalabrasClave dpc ON rk.palabra_clave_id = dpc.palabra_clave_id
       JOIN PalabrasClave pc ON rk.palabra_clave_id = pc.palabra_clave_id
       JOIN Desafios d ON dpc.desafio_id = d.desafio_id
       LEFT JOIN Participantes_Externos p ON d.participante_id = p.participante_id
       WHERE rk.registro_id = ?
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
 * ACTUALIZADO: Usa registros_helice_interna en lugar de Capacidades_UNSA
 */
export const getMatchesForInvestigador = async (investigadorId: number, limit: number = 10): Promise<DesafioMatch[]> => {
  try {
    // Asegurar que limit sea un número entero válido
    const limitValue = Math.max(1, Math.min(100, Math.floor(limit)));
    
    const query = `
      SELECT DISTINCT
          d.desafio_id,
          d.titulo,
          d.descripcion,
          d.participante_id,
          p.nombre_organizacion AS participante_nombre,
          p.nombre_organizacion AS organizacion,
          GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') AS palabras_coincidentes,
          COUNT(DISTINCT pc.palabra_clave_id) AS total_coincidencias
      FROM registros_helice_interna r
      JOIN registro_keywords rk ON r.id = rk.registro_id
      JOIN Desafios_PalabrasClave dpc ON rk.palabra_clave_id = dpc.palabra_clave_id
      JOIN PalabrasClave pc ON rk.palabra_clave_id = pc.palabra_clave_id
      JOIN Desafios d ON dpc.desafio_id = d.desafio_id
      LEFT JOIN Participantes_Externos p ON d.participante_id = p.participante_id
      WHERE r.investigador_id = ? AND r.estado = 'aprobado'
      GROUP BY d.desafio_id
      ORDER BY total_coincidencias DESC, d.desafio_id DESC
      LIMIT ${limitValue};
    `;

    const [rows] = await dbPool.execute<DesafioMatch[]>(query, [investigadorId]);
    return rows;
  } catch (error: any) {
    console.error(`Error al obtener matches para investigador ${investigadorId}:`, error);
    throw new Error('Error al obtener matches para el investigador.');
  }
};

/**
 * Obtiene los mejores matches para un participante externo (basado en sus desafíos)
 * ACTUALIZADO: Usa registros_helice_interna en lugar de Capacidades_UNSA
 */
export const getMatchesForParticipante = async (participanteId: number, limit: number = 10): Promise<CapacidadMatch[]> => {
  try {
    // Asegurar que limit sea un número entero válido
    const limitValue = Math.max(1, Math.min(100, Math.floor(limit)));
    
    const query = `
      SELECT DISTINCT
          r.id AS capacidad_id,
          COALESCE(r.nombre_completo, r.nombre_entidad) AS descripcion_capacidad,
          r.investigador_id,
          i.nombres_apellidos AS investigador_nombre,
          GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') AS palabras_coincidentes,
          COUNT(DISTINCT pc.palabra_clave_id) AS total_coincidencias
      FROM Desafios d
      JOIN Desafios_PalabrasClave dpc ON d.desafio_id = dpc.desafio_id
      JOIN registro_keywords rk ON dpc.palabra_clave_id = rk.palabra_clave_id
      JOIN PalabrasClave pc ON dpc.palabra_clave_id = pc.palabra_clave_id
      JOIN registros_helice_interna r ON rk.registro_id = r.id
      LEFT JOIN Investigadores_UNSA i ON r.investigador_id = i.investigador_id
      WHERE d.participante_id = ? AND r.estado = 'aprobado'
      GROUP BY r.id
      ORDER BY total_coincidencias DESC, r.id DESC
      LIMIT ${limitValue};
    `;

    const [rows] = await dbPool.execute<CapacidadMatch[]>(query, [participanteId]);
    return rows;
  } catch (error: any) {
    console.error(`Error al obtener matches para participante ${participanteId}:`, error);
    throw new Error('Error al obtener matches para el participante.');
  }
};

/**
 * NUEVO: Calcula el matching avanzado entre un desafío y todas las capacidades
 * Pesos: OCDE (60%), ODS (25%), Keywords (15%)
 */
export interface CapacidadMatchAvanzado extends RowDataPacket {
  registro_id: number;
  usuario_id: number;
  tipo_registro: string;
  nombre_completo?: string;
  nombre?: string;
  email: string;
  telefono: string;
  programa_estudio?: string;
  oficina_departamento_vinculado?: string;
  
  // Métricas de matching
  score_total: number;
  score_ocde: number;
  score_ods: number;
  score_keywords: number;
  
  // Coincidencias
  ocde_coincidencias: number;
  ods_coincidencias: number;
  keywords_coincidencias: number;
  
  // Detalles
  keywords_comunes?: string;
}

export const findCapacidadesForDesafioAvanzado = async (
  desafioId: number,
  limit: number = 20
): Promise<CapacidadMatchAvanzado[]> => {
  try {
    const connection = await dbPool.getConnection();
    
    try {
      // 1. Obtener datos del desafío
      const [desafioRows] = await connection.query<RowDataPacket[]>(
        'SELECT usuario_id FROM Desafios WHERE desafio_id = ?',
        [desafioId]
      );
      
      if (desafioRows.length === 0) {
        return [];
      }
      
      const desafioUserId = desafioRows[0].usuario_id;
      
      console.log(`\n=== MATCHING AVANZADO PARA DESAFÍO ${desafioId} ===`);
      console.log(`Usuario del desafío: ${desafioUserId}`);
      
      // 2. Obtener OCDE, ODS y Keywords del desafío
      const [desafioOCDE] = await connection.query<RowDataPacket[]>(
        'SELECT DISTINCT disciplina_id FROM Registro_OCDE WHERE registro_id = ? AND usuario_id = ?',
        [desafioId, desafioUserId]
      );
      console.log(`Query OCDE desafío - Rows encontrados:`, desafioOCDE.length);
      
      const [desafioODS] = await connection.query<RowDataPacket[]>(
        'SELECT DISTINCT meta_id FROM Registro_ODS WHERE registro_id = ? AND usuario_id = ?',
        [desafioId, desafioUserId]
      );
      console.log(`Query ODS desafío - Rows encontrados:`, desafioODS.length);
      
      const [desafioKeywords] = await connection.query<RowDataPacket[]>(
        'SELECT keyword_id, kc.keyword FROM Registro_Keywords rk JOIN keywords_catalog kc ON rk.keyword_id = kc.id WHERE rk.registro_id = ? AND rk.usuario_id = ?',
        [desafioId, desafioUserId]
      );
      console.log(`Query Keywords desafío - Rows encontrados:`, desafioKeywords.length);
      
      const desafioOCDEIds = desafioOCDE.map(r => r.disciplina_id).filter(id => id);
      const desafioODSIds = desafioODS.map(r => r.meta_id).filter(id => id);
      const desafioKeywordIds = desafioKeywords.map(r => r.keyword_id).filter(id => id);
      
      console.log(`\n📊 DATOS DEL DESAFÍO:`);
      console.log(`  - OCDE (disciplinas): ${desafioOCDEIds.length} → [${desafioOCDEIds.join(', ')}]`);
      console.log(`  - ODS (metas): ${desafioODSIds.length} → [${desafioODSIds.join(', ')}]`);
      console.log(`  - Keywords: ${desafioKeywordIds.length} → [${desafioKeywordIds.join(', ')}]`);
      if (desafioKeywords.length > 0) {
        console.log(`  - Keywords nombres:`, desafioKeywords.map(k => k.keyword).join(', '));
      }
      
      // 3. Obtener todas las capacidades y calcular matching
      const capacidades: CapacidadMatchAvanzado[] = [];
      
      const tablas = [
        { tabla: 'Registro_Docente_Investigador', tipo: 'docente_investigador', campoNombre: 'nombre_completo' },
        { tabla: 'Registro_Grupo_Centro_Instituto', tipo: 'grupo_centro_instituto', campoNombre: 'nombre' },
        { tabla: 'Registro_Laboratorio', tipo: 'laboratorio', campoNombre: 'nombre' },
        { tabla: 'Registro_Centro_Produccion', tipo: 'centro_produccion', campoNombre: 'nombre' }
      ];
      
      for (const { tabla, tipo, campoNombre } of tablas) {
        const [registros] = await connection.query<RowDataPacket[]>(
          `SELECT * FROM ${tabla}`
        );
        
        console.log(`\n--- Procesando ${registros.length} registros de tipo: ${tipo} ---`);
        
        for (const registro of registros) {
          // Obtener OCDE, ODS y Keywords de esta capacidad
          const [capOCDE] = await connection.query<RowDataPacket[]>(
            'SELECT DISTINCT disciplina_id FROM Registro_OCDE WHERE registro_id = ? AND usuario_id = ? AND tipo = ?',
            [registro.registro_id, registro.usuario_id, tipo]
          );
          
          const [capODS] = await connection.query<RowDataPacket[]>(
            'SELECT DISTINCT meta_id FROM Registro_ODS WHERE registro_id = ? AND usuario_id = ? AND tipo = ?',
            [registro.registro_id, registro.usuario_id, tipo]
          );
          
          const [capKeywords] = await connection.query<RowDataPacket[]>(
            'SELECT keyword_id, kc.keyword FROM Registro_Keywords rk JOIN keywords_catalog kc ON rk.keyword_id = kc.id WHERE rk.registro_id = ? AND rk.usuario_id = ? AND rk.tipo = ?',
            [registro.registro_id, registro.usuario_id, tipo]
          );
          
          const capOCDEIds = capOCDE.map(r => r.disciplina_id).filter(id => id);
          const capODSIds = capODS.map(r => r.meta_id).filter(id => id);
          const capKeywordIds = capKeywords.map(r => r.keyword_id).filter(id => id);
          
          // Calcular coincidencias
          const ocdeCoincidencias = capOCDEIds.filter(id => desafioOCDEIds.includes(id)).length;
          const odsCoincidencias = capODSIds.filter(id => desafioODSIds.includes(id)).length;
          const keywordsCoincidencias = capKeywordIds.filter(id => desafioKeywordIds.includes(id)).length;
          
          // Identificar cuáles coinciden
          const ocdeCoincidentesIds = capOCDEIds.filter(id => desafioOCDEIds.includes(id));
          const odsCoincidentesIds = capODSIds.filter(id => desafioODSIds.includes(id));
          const keywordsCoincidentesIds = capKeywordIds.filter(id => desafioKeywordIds.includes(id));
          
          // Log detallado de cada capacidad
          const nombreCap = registro[campoNombre] || 'Sin nombre';
          console.log(`\n  📋 Capacidad: ${nombreCap} (${tipo})`);
          console.log(`    OCDE Capacidad: [${capOCDEIds.join(', ')}]`);
          console.log(`    OCDE Desafío:   [${desafioOCDEIds.join(', ')}]`);
          console.log(`    ✓ Coincidencias OCDE: ${ocdeCoincidencias} → [${ocdeCoincidentesIds.join(', ')}]`);
          console.log(`    ODS Capacidad: [${capODSIds.join(', ')}]`);
          console.log(`    ODS Desafío:   [${desafioODSIds.join(', ')}]`);
          console.log(`    ✓ Coincidencias ODS: ${odsCoincidencias} → [${odsCoincidentesIds.join(', ')}]`);
          console.log(`    Keywords Capacidad: [${capKeywordIds.join(', ')}]`);
          if (capKeywords.length > 0) {
            console.log(`    Keywords Capacidad (nombres): ${capKeywords.map(k => k.keyword).join(', ')}`);
          }
          console.log(`    Keywords Desafío:   [${desafioKeywordIds.join(', ')}]`);
          console.log(`    ✓ Coincidencias Keywords: ${keywordsCoincidencias} → [${keywordsCoincidentesIds.join(', ')}]`);
          
          // Solo incluir si hay al menos una coincidencia
          if (ocdeCoincidencias > 0 || odsCoincidencias > 0 || keywordsCoincidencias > 0) {
            // Calcular scores (pesos: OCDE 60%, ODS 25%, Keywords 15%)
            const scoreOCDE = capOCDEIds.length > 0 ? (ocdeCoincidencias / capOCDEIds.length) * 100 : 0;
            const scoreODS = capODSIds.length > 0 ? (odsCoincidencias / capODSIds.length) * 100 : 0;
            const scoreKeywords = capKeywordIds.length > 0 ? (keywordsCoincidencias / capKeywordIds.length) * 100 : 0;
            
            const scoreTotal = (scoreOCDE * 0.6) + (scoreODS * 0.25) + (scoreKeywords * 0.15);
            
            // Keywords comunes
            const keywordsComunes = capKeywords
              .filter(kw => desafioKeywordIds.includes(kw.keyword_id))
              .map(kw => kw.keyword)
              .join(', ');
            
            capacidades.push({
              registro_id: registro.registro_id,
              usuario_id: registro.usuario_id,
              tipo_registro: tipo,
              nombre_completo: tipo === 'docente_investigador' ? registro[campoNombre] : undefined,
              nombre: tipo !== 'docente_investigador' ? registro[campoNombre] : undefined,
              email: registro.email,
              telefono: registro.telefono,
              programa_estudio: registro.programa_estudio,
              oficina_departamento_vinculado: registro.oficina_departamento_vinculado,
              score_total: Math.round(scoreTotal * 100) / 100,
              score_ocde: Math.round(scoreOCDE * 100) / 100,
              score_ods: Math.round(scoreODS * 100) / 100,
              score_keywords: Math.round(scoreKeywords * 100) / 100,
              ocde_coincidencias: ocdeCoincidencias,
              ods_coincidencias: odsCoincidencias,
              keywords_coincidencias: keywordsCoincidencias,
              keywords_comunes: keywordsComunes || undefined
            } as CapacidadMatchAvanzado);
          }
        }
      }
      
      // Ordenar por score total descendente
      capacidades.sort((a, b) => b.score_total - a.score_total);
      
      // Limitar resultados
      const limitValue = Math.max(1, Math.min(100, Math.floor(limit)));
      const resultado = capacidades.slice(0, limitValue);
      
      console.log(`\n✅ RESULTADO FINAL:`);
      console.log(`  Total capacidades analizadas: ${capacidades.length}`);
      console.log(`  Capacidades con coincidencias: ${resultado.length}`);
      if (resultado.length > 0) {
        console.log(`\n  Top 5 matches:`);
        resultado.slice(0, 5).forEach((cap, i) => {
          const nombre = cap.nombre_completo || cap.nombre;
          console.log(`    ${i + 1}. ${nombre} - Score: ${cap.score_total}% (OCDE: ${cap.score_ocde}%, ODS: ${cap.score_ods}%, KW: ${cap.score_keywords}%)`);
        });
      }
      console.log(`=== FIN MATCHING AVANZADO ===\n`);
      
      return resultado;
      
    } finally {
      connection.release();
    }

  } catch (error: any) {
    console.error(`Error en matching avanzado para desafío ${desafioId}:`, error);
    throw new Error('Error al calcular matching avanzado.');
  }
};
