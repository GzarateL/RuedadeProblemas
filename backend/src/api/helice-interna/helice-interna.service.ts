import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import db from '../../config/db';

interface TipoHeliceInterna {
  tipo: string;
  nombre: string;
}

// Interfaces para cada tipo de registro según la BD
interface RegistroDocenteInvestigador {
  registro_id?: number;
  usuario_id: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  programa_estudio: string;
  url_cti_vitae?: string;
  estado: 'borrador' | 'completado' | 'en_revision' | 'aprobado' | 'rechazado';
  paso_actual: number;
}

interface RegistroGrupoCentroInstituto {
  registro_id?: number;
  usuario_id: number;
  nombre: string; // Nombre del grupo/centro/instituto
  nombre_completo_responsable: string;
  email: string;
  telefono: string;
  oficina_departamento_vinculado: string;
  estado: 'borrador' | 'completado' | 'en_revision' | 'aprobado' | 'rechazado';
  paso_actual: number;
}

interface RegistroLaboratorio {
  registro_id?: number;
  usuario_id: number;
  nombre: string; 
  nombre_completo_responsable: string;
  email: string;
  telefono: string;
  oficina_departamento_vinculado: string;
  estado: 'borrador' | 'completado' | 'en_revision' | 'aprobado' | 'rechazado';
  paso_actual: number;
}

interface RegistroCentroProduccion {
  registro_id?: number;
  usuario_id: number;
  nombre: string; // Nombre del centro de producción
  nombre_completo_responsable: string;
  email: string;
  telefono: string;
  oficina_departamento_vinculado: string;
  estado: 'borrador' | 'completado' | 'en_revision' | 'aprobado' | 'rechazado';
  paso_actual: number;
}

interface DatosRegistroCompleto {
  // Tipo de registro
  tipo: 'docente_investigador' | 'grupo_centro_instituto' | 'laboratorio' | 'centro_produccion';
  
  // Información básica - Docente Investigador
  nombre_completo?: string;
  email?: string;
  telefono?: string;
  programa_estudio?: string;
  url_cti_vitae?: string;

  // Información básica - Grupos/Centros/Institutos/Laboratorios/Producción
  nombre?: string; // Nombre de la entidad
  nombre_completo_responsable?: string;
  oficina_departamento_vinculado?: string;

  // Áreas OCDE (múltiples registros)
  ocde?: Array<{
    area_id?: number;
    sub_area_id?: number;
    disciplina_id?: number;
  }>;

  // ODS (múltiples registros)
  ods?: Array<{
    objetivo_id: number;
    meta_id?: number;
  }>;

  // Nivel de aporte (DEL y DS en escala 1-7)
  nivel_aporte_del?: number;
  nivel_aporte_ds?: number;

  // CTI Vitae (múltiples URLs para grupos/centros/institutos)
  cti_vitae_urls?: string[];

  // Niveles tecnológicos
  nivel_trl?: number;
  nivel_crl?: number;

  // PIU (Producción Intelectual Universitaria)
  piu?: {
    tesis?: number;
    libros?: number;
    capitulos_libro?: number;
    manuscritos_publicados?: number;
    manuscritos_aceptados?: number;
    manuscritos_evaluacion?: number;
    pi_patente_invencion?: number;
    pi_patente_modalidad_uso?: number;
    pi_sui_generis?: number;
    pi_derecho_autor_software?: number;
    pi_derecho_obras_literarias?: number;
    pi_otras?: number;
  };

  // Palabras clave
  keywords?: number[]; // IDs de keywords_catalog

  // Soluciones
  soluciones?: Array<{
    titulo: string;
    problema: string;
    solucion: string;
  }>;

  // Archivos adjuntos
  archivos?: Array<{
    nombre_archivo: string;
    ruta_archivo: string;
    tipo_archivo?: string;
    tamano_archivo?: number;
    descripcion?: string;
  }>;

  // Paso actual
  paso_actual?: number;
}

export class HeliceInternaService {
  
  async getTipos(): Promise<TipoHeliceInterna[]> {
    return [
      { tipo: 'docente_investigador', nombre: 'Docente Investigador' },
      { tipo: 'grupo_centro_instituto', nombre: 'Grupo, Centro o Instituto' },
      { tipo: 'laboratorio', nombre: 'Laboratorio' },
      { tipo: 'centro_produccion', nombre: 'Centro de Producción' }
    ];
  }

  private getTablaByTipo(tipo: string): string {
    const tablas: Record<string, string> = {
      'docente_investigador': 'Registro_Docente_Investigador',
      'grupo_centro_instituto': 'Registro_Grupo_Centro_Instituto',
      'laboratorio': 'Registro_Laboratorio',
      'centro_produccion': 'Registro_Centro_Produccion'
    };
    return tablas[tipo] || 'Registro_Docente_Investigador';
  }

  async crearRegistro(
    usuarioId: number, 
    datos: DatosRegistroCompleto
  ): Promise<any> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      console.log('=== SERVICE: Iniciando creación de registro ===');
      console.log('Usuario ID:', usuarioId);
      console.log('Tipo:', datos.tipo);
      console.log('=== DEBUG OCDE BACKEND ===');
      console.log('datos.ocde recibido:', JSON.stringify(datos.ocde, null, 2));
      console.log('datos.ocde?.length:', datos.ocde?.length);

      const tabla = this.getTablaByTipo(datos.tipo);
      console.log('Tabla a usar:', tabla);
      
      // NOTA: Permitimos múltiples registros del mismo tipo para el mismo usuario
      // No eliminamos registros existentes, simplemente creamos uno nuevo
      
      let registroId: number;

      // Crear registro principal según el tipo
      if (datos.tipo === 'docente_investigador') {
        console.log('Insertando docente investigador...');
        const [result] = await connection.execute<ResultSetHeader>(
          `INSERT INTO ${tabla} 
           (usuario_id, nombre_completo, email, telefono, programa_estudio, url_cti_vitae, estado, paso_actual) 
           VALUES (?, ?, ?, ?, ?, ?, 'borrador', ?)`,
          [
            usuarioId,
            datos.nombre_completo,
            datos.email,
            datos.telefono,
            datos.programa_estudio,
            datos.url_cti_vitae || null,
            datos.paso_actual || 1
          ]
        );
        registroId = result.insertId;
        console.log('Registro creado con ID:', registroId);
      } else {
        // Para grupos, centros, institutos, laboratorios y centros de producción
        console.log('Insertando grupo/centro/instituto/laboratorio/producción...');
        console.log('Datos a insertar:', {
          usuarioId,
          nombre: datos.nombre,
          nombre_completo_responsable: datos.nombre_completo_responsable,
          email: datos.email,
          telefono: datos.telefono,
          oficina_departamento_vinculado: datos.oficina_departamento_vinculado,
          paso_actual: datos.paso_actual || 1
        });
        
        const [result] = await connection.execute<ResultSetHeader>(
          `INSERT INTO ${tabla} 
           (usuario_id, nombre, nombre_completo_responsable, email, telefono, oficina_departamento_vinculado, estado, paso_actual) 
           VALUES (?, ?, ?, ?, ?, ?, 'borrador', ?)`,
          [
            usuarioId,
            datos.nombre,
            datos.nombre_completo_responsable,
            datos.email,
            datos.telefono,
            datos.oficina_departamento_vinculado,
            datos.paso_actual || 1
          ]
        );
        registroId = result.insertId;
        console.log('Registro creado con ID:', registroId);
      }

      // Guardar datos compartidos
      console.log('Guardando datos compartidos...');
      
      // Limpiar datos compartidos existentes de ESTE registro específico antes de insertar nuevos
      console.log(`Limpiando datos compartidos previos del registro ${registroId}, tipo ${datos.tipo}...`);
      await connection.execute('DELETE FROM Registro_OCDE WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      await connection.execute('DELETE FROM Registro_ODS WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      await connection.execute('DELETE FROM Registro_Aportes WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      await connection.execute('DELETE FROM Registro_CTI_Vitae WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      await connection.execute('DELETE FROM Registro_Niveles_Tecnologicos WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      await connection.execute('DELETE FROM Registro_PIU WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      await connection.execute('DELETE FROM Registro_Keywords WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      await connection.execute('DELETE FROM Registro_Soluciones WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      await connection.execute('DELETE FROM Registro_Archivos WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
      
      if (datos.ocde && datos.ocde.length > 0) {
        console.log('Guardando OCDE:', datos.ocde);
        await this.guardarOCDE(connection, usuarioId, registroId, datos.tipo, datos.ocde);
      }

      if (datos.ods && datos.ods.length > 0) {
        console.log('Guardando ODS:', datos.ods);
        await this.guardarODS(connection, usuarioId, registroId, datos.tipo, datos.ods);
      }

      if (datos.nivel_aporte_del !== undefined && datos.nivel_aporte_ds !== undefined) {
        console.log('Guardando aportes:', { del: datos.nivel_aporte_del, ds: datos.nivel_aporte_ds });
        await this.guardarAportes(connection, usuarioId, registroId, datos.tipo, datos.nivel_aporte_del, datos.nivel_aporte_ds);
      }

      if (datos.cti_vitae_urls && datos.cti_vitae_urls.length > 0) {
        console.log('Guardando CTI Vitae:', datos.cti_vitae_urls);
        await this.guardarCTIVitae(connection, usuarioId, registroId, datos.tipo, datos.cti_vitae_urls);
      }

      if (datos.nivel_trl !== undefined || datos.nivel_crl !== undefined) {
        console.log('Guardando niveles tecnológicos:', { trl: datos.nivel_trl, crl: datos.nivel_crl });
        await this.guardarNivelesTecnologicos(connection, usuarioId, registroId, datos.tipo, datos.nivel_trl, datos.nivel_crl);
      }

      if (datos.piu) {
        console.log('Guardando PIU:', datos.piu);
        await this.guardarPIU(connection, usuarioId, registroId, datos.tipo, datos.piu);
      }

      if (datos.keywords && datos.keywords.length > 0) {
        console.log('Guardando keywords:', datos.keywords);
        await this.guardarKeywords(connection, usuarioId, registroId, datos.tipo, datos.keywords);
      }

      if (datos.soluciones && datos.soluciones.length > 0) {
        console.log('Guardando soluciones:', datos.soluciones.length, 'soluciones');
        await this.guardarSoluciones(connection, usuarioId, registroId, datos.tipo, datos.soluciones);
      }

      if (datos.archivos && datos.archivos.length > 0) {
        console.log('Guardando archivos:', datos.archivos);
        await this.guardarArchivos(connection, usuarioId, registroId, datos.tipo, datos.archivos);
      }
      
      console.log('Todos los datos guardados exitosamente');

      await connection.commit();

      // Obtener el registro completo
      const registro = await this.getRegistroById(registroId, usuarioId, datos.tipo);
      return registro;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async actualizarRegistro(
    registroId: number,
    usuarioId: number,
    datos: DatosRegistroCompleto
  ): Promise<any> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const tabla = this.getTablaByTipo(datos.tipo);

      // Actualizar registro principal según el tipo
      if (datos.tipo === 'docente_investigador') {
        await connection.execute(
          `UPDATE ${tabla} 
           SET nombre_completo = ?, email = ?, telefono = ?, programa_estudio = ?, 
               url_cti_vitae = ?, paso_actual = ?, fecha_actualizacion = CURRENT_TIMESTAMP
           WHERE registro_id = ? AND usuario_id = ?`,
          [
            datos.nombre_completo,
            datos.email,
            datos.telefono,
            datos.programa_estudio,
            datos.url_cti_vitae || null,
            datos.paso_actual || 1,
            registroId,
            usuarioId
          ]
        );
      } else {
        await connection.execute(
          `UPDATE ${tabla} 
           SET nombre = ?, nombre_completo_responsable = ?, email = ?, telefono = ?, 
               oficina_departamento_vinculado = ?, paso_actual = ?, fecha_actualizacion = CURRENT_TIMESTAMP
           WHERE registro_id = ? AND usuario_id = ?`,
          [
            datos.nombre,
            datos.nombre_completo_responsable,
            datos.email,
            datos.telefono,
            datos.oficina_departamento_vinculado,
            datos.paso_actual || 1,
            registroId,
            usuarioId
          ]
        );
      }

      // Actualizar datos compartidos (eliminar y reinsertar)
      if (datos.ocde !== undefined) {
        await connection.execute('DELETE FROM Registro_OCDE WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
        if (datos.ocde.length > 0) {
          await this.guardarOCDE(connection, usuarioId, registroId, datos.tipo, datos.ocde);
        }
      }

      if (datos.ods !== undefined) {
        await connection.execute('DELETE FROM Registro_ODS WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
        if (datos.ods.length > 0) {
          await this.guardarODS(connection, usuarioId, registroId, datos.tipo, datos.ods);
        }
      }

      if (datos.nivel_aporte_del !== undefined || datos.nivel_aporte_ds !== undefined) {
        await connection.execute('DELETE FROM Registro_Aportes WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
        if (datos.nivel_aporte_del !== undefined && datos.nivel_aporte_ds !== undefined) {
          await this.guardarAportes(connection, usuarioId, registroId, datos.tipo, datos.nivel_aporte_del, datos.nivel_aporte_ds);
        }
      }

      if (datos.cti_vitae_urls !== undefined) {
        await connection.execute('DELETE FROM Registro_CTI_Vitae WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
        if (datos.cti_vitae_urls.length > 0) {
          await this.guardarCTIVitae(connection, usuarioId, registroId, datos.tipo, datos.cti_vitae_urls);
        }
      }

      if (datos.nivel_trl !== undefined || datos.nivel_crl !== undefined) {
        await connection.execute('DELETE FROM Registro_Niveles_Tecnologicos WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
        if (datos.nivel_trl !== undefined || datos.nivel_crl !== undefined) {
          await this.guardarNivelesTecnologicos(connection, usuarioId, registroId, datos.tipo, datos.nivel_trl, datos.nivel_crl);
        }
      }

      if (datos.piu !== undefined) {
        await connection.execute('DELETE FROM Registro_PIU WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
        if (datos.piu) {
          await this.guardarPIU(connection, usuarioId, registroId, datos.tipo, datos.piu);
        }
      }

      if (datos.keywords !== undefined) {
        await connection.execute('DELETE FROM Registro_Keywords WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
        if (datos.keywords.length > 0) {
          await this.guardarKeywords(connection, usuarioId, registroId, datos.tipo, datos.keywords);
        }
      }

      if (datos.soluciones !== undefined) {
        await connection.execute('DELETE FROM Registro_Soluciones WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, datos.tipo]);
        if (datos.soluciones.length > 0) {
          await this.guardarSoluciones(connection, usuarioId, registroId, datos.tipo, datos.soluciones);
        }
      }

      await connection.commit();

      // Obtener el registro actualizado
      const registro = await this.getRegistroById(registroId, usuarioId, datos.tipo);
      return registro;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Métodos auxiliares para guardar datos compartidos
  private async guardarOCDE(connection: PoolConnection, usuarioId: number, registroId: number, tipo: string, ocde: Array<{area_id?: number, sub_area_id?: number, disciplina_id?: number}>) {
    console.log(`Guardando ${ocde.length} registros OCDE para usuario ${usuarioId}, registro ${registroId}, tipo ${tipo}`);
    for (const item of ocde) {
      console.log('Insertando OCDE:', { usuarioId, registroId, tipo, ...item });
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO Registro_OCDE (usuario_id, registro_id, tipo, area_id, sub_area_id, disciplina_id) VALUES (?, ?, ?, ?, ?, ?)',
        [usuarioId, registroId, tipo, item.area_id || null, item.sub_area_id || null, item.disciplina_id || null]
      );
      console.log('OCDE insertado con ID:', result.insertId);
    }
  }

  private async guardarODS(connection: PoolConnection, usuarioId: number, registroId: number, tipo: string, ods: Array<{objetivo_id: number | null, meta_id?: number | null}>) {
    for (const item of ods) {
      let objetivoId = item.objetivo_id;
      
      // Si solo se proporcionó meta_id, buscar el objetivo_id correspondiente
      if (!objetivoId && item.meta_id) {
        const [metaRows] = await connection.execute<RowDataPacket[]>(
          'SELECT objetivo_id FROM metas WHERE id = ?',
          [item.meta_id]
        );
        if (metaRows.length > 0) {
          objetivoId = metaRows[0].objetivo_id;
        }
      }
      
      // Solo insertar si tenemos al menos un objetivo_id
      if (objetivoId) {
        await connection.execute(
          'INSERT INTO Registro_ODS (usuario_id, registro_id, tipo, objetivo_id, meta_id) VALUES (?, ?, ?, ?, ?)',
          [usuarioId, registroId, tipo, objetivoId, item.meta_id || null]
        );
      }
    }
  }

  private async guardarAportes(connection: PoolConnection, usuarioId: number, registroId: number, tipo: string, nivelDEL: number, nivelDS: number) {
    await connection.execute(
      `INSERT INTO Registro_Aportes (usuario_id, registro_id, tipo, nivel_aporte_del, nivel_aporte_ds) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       nivel_aporte_del = VALUES(nivel_aporte_del),
       nivel_aporte_ds = VALUES(nivel_aporte_ds)`,
      [usuarioId, registroId, tipo, nivelDEL, nivelDS]
    );
  }

  private async guardarCTIVitae(connection: PoolConnection, usuarioId: number, registroId: number, tipo: string, urls: string[]) {
    for (let i = 0; i < urls.length; i++) {
      await connection.execute(
        'INSERT INTO Registro_CTI_Vitae (usuario_id, registro_id, tipo, url_cti, orden) VALUES (?, ?, ?, ?, ?)',
        [usuarioId, registroId, tipo, urls[i], i + 1]
      );
    }
  }

  private async guardarNivelesTecnologicos(connection: PoolConnection, usuarioId: number, registroId: number, tipo: string, nivelTRL?: number, nivelCRL?: number) {
    await connection.execute(
      `INSERT INTO Registro_Niveles_Tecnologicos (usuario_id, registro_id, tipo, nivel_trl, nivel_crl) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       nivel_trl = VALUES(nivel_trl),
       nivel_crl = VALUES(nivel_crl)`,
      [usuarioId, registroId, tipo, nivelTRL || null, nivelCRL || null]
    );
  }

  private async guardarPIU(connection: PoolConnection, usuarioId: number, registroId: number, tipo: string, piu: any) {
    await connection.execute(
      `INSERT INTO Registro_PIU 
       (usuario_id, registro_id, tipo, tesis, libros, capitulos_libro, manuscritos_publicados, manuscritos_aceptados, 
        manuscritos_evaluacion, pi_patente_invencion, pi_patente_modalidad_uso, pi_sui_generis, 
        pi_derecho_autor_software, pi_derecho_obras_literarias, pi_otras) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       tesis = VALUES(tesis),
       libros = VALUES(libros),
       capitulos_libro = VALUES(capitulos_libro),
       manuscritos_publicados = VALUES(manuscritos_publicados),
       manuscritos_aceptados = VALUES(manuscritos_aceptados),
       manuscritos_evaluacion = VALUES(manuscritos_evaluacion),
       pi_patente_invencion = VALUES(pi_patente_invencion),
       pi_patente_modalidad_uso = VALUES(pi_patente_modalidad_uso),
       pi_sui_generis = VALUES(pi_sui_generis),
       pi_derecho_autor_software = VALUES(pi_derecho_autor_software),
       pi_derecho_obras_literarias = VALUES(pi_derecho_obras_literarias),
       pi_otras = VALUES(pi_otras)`,
      [
        usuarioId,
        registroId,
        tipo,
        piu.tesis || 0,
        piu.libros || 0,
        piu.capitulos_libro || 0,
        piu.manuscritos_publicados || 0,
        piu.manuscritos_aceptados || 0,
        piu.manuscritos_evaluacion || 0,
        piu.pi_patente_invencion || 0,
        piu.pi_patente_modalidad_uso || 0,
        piu.pi_sui_generis || 0,
        piu.pi_derecho_autor_software || 0,
        piu.pi_derecho_obras_literarias || 0,
        piu.pi_otras || 0
      ]
    );
  }

  private async guardarKeywords(connection: PoolConnection, usuarioId: number, registroId: number, tipo: string, keywords: number[]) {
    for (const keywordId of keywords) {
      await connection.execute(
        'INSERT INTO Registro_Keywords (usuario_id, registro_id, tipo, keyword_id) VALUES (?, ?, ?, ?)',
        [usuarioId, registroId, tipo, keywordId]
      );
    }
  }

  private async guardarSoluciones(connection: PoolConnection, usuarioId: number, registroId: number, tipo: string, soluciones: Array<{titulo: string, problema: string, solucion: string}>) {
    for (let i = 0; i < soluciones.length; i++) {
      await connection.execute(
        'INSERT INTO Registro_Soluciones (usuario_id, registro_id, tipo, titulo, problema, solucion, orden) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [usuarioId, registroId, tipo, soluciones[i].titulo, soluciones[i].problema, soluciones[i].solucion, i + 1]
      );
    }
  }

  private async guardarArchivos(connection: PoolConnection, usuarioId: number, registroId: number, tipoRegistro: string, archivos: Array<any>) {
    for (const archivo of archivos) {
      await connection.execute(
        'INSERT INTO Registro_Archivos (usuario_id, registro_id, tipo, nombre_archivo, ruta_archivo, tipo_archivo, tamano_archivo, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [usuarioId, registroId, tipoRegistro, archivo.nombre_archivo, archivo.ruta_archivo, archivo.tipo_archivo || null, archivo.tamano_archivo || null, archivo.descripcion || null]
      );
    }
  }

  async getRegistrosByUsuario(usuarioId: number): Promise<any[]> {
    const registros: any[] = [];

    // Buscar en todas las tablas
    const tablas = [
      { tabla: 'Registro_Docente_Investigador', tipo: 'docente_investigador' },
      { tabla: 'Registro_Grupo_Centro_Instituto', tipo: 'grupo_centro_instituto' },
      { tabla: 'Registro_Laboratorio', tipo: 'laboratorio' },
      { tabla: 'Registro_Centro_Produccion', tipo: 'centro_produccion' }
    ];

    for (const { tabla, tipo } of tablas) {
      const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT *, '${tipo}' as tipo FROM ${tabla} WHERE usuario_id = ? ORDER BY fecha_creacion DESC`,
        [usuarioId]
      );
      registros.push(...rows);
    }

    return registros;
  }

  async getRegistroById(registroId: number, usuarioId: number, tipo: string): Promise<any> {
    const tabla = this.getTablaByTipo(tipo);
    
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM ${tabla} WHERE registro_id = ? AND usuario_id = ?`,
      [registroId, usuarioId]
    );

    if (rows.length === 0) {
      return null;
    }

    const registro = rows[0];

    // Obtener datos compartidos de este registro específico
    const [ocde] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_OCDE WHERE usuario_id = ? AND registro_id = ? AND tipo = ?',
      [usuarioId, registroId, tipo]
    );

    const [ods] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_ODS WHERE usuario_id = ? AND registro_id = ? AND tipo = ?',
      [usuarioId, registroId, tipo]
    );

    const [aportes] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_Aportes WHERE usuario_id = ? AND registro_id = ? AND tipo = ?',
      [usuarioId, registroId, tipo]
    );

    const [ctiVitae] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_CTI_Vitae WHERE usuario_id = ? AND registro_id = ? AND tipo = ? ORDER BY orden',
      [usuarioId, registroId, tipo]
    );

    const [niveles] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_Niveles_Tecnologicos WHERE usuario_id = ? AND registro_id = ? AND tipo = ?',
      [usuarioId, registroId, tipo]
    );

    const [piu] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_PIU WHERE usuario_id = ? AND registro_id = ? AND tipo = ?',
      [usuarioId, registroId, tipo]
    );

    const [keywords] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_Keywords WHERE usuario_id = ? AND registro_id = ? AND tipo = ?',
      [usuarioId, registroId, tipo]
    );

    const [soluciones] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_Soluciones WHERE usuario_id = ? AND registro_id = ? AND tipo = ? ORDER BY orden',
      [usuarioId, registroId, tipo]
    );

    const [archivos] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM Registro_Archivos WHERE usuario_id = ? AND registro_id = ? AND tipo = ?',
      [usuarioId, registroId, tipo]
    );

    return {
      ...registro,
      tipo,
      ocde,
      ods,
      aportes: aportes[0] || null,
      cti_vitae: ctiVitae,
      niveles: niveles[0] || null,
      piu: piu[0] || null,
      keywords,
      soluciones,
      archivos
    };
  }

  async completarRegistro(registroId: number, usuarioId: number, tipo: string): Promise<any> {
    const tabla = this.getTablaByTipo(tipo);
    
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE ${tabla} 
       SET estado = 'completado', fecha_completado = CURRENT_TIMESTAMP
       WHERE registro_id = ? AND usuario_id = ? AND estado = 'borrador'`,
      [registroId, usuarioId]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.getRegistroById(registroId, usuarioId, tipo);
  }

  async eliminarRegistro(registroId: number, usuarioId: number, tipo: string): Promise<boolean> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      console.log(`Eliminando registro ${registroId} del usuario ${usuarioId}, tipo ${tipo}`);

      // Eliminar datos compartidos de este registro específico (en cascada)
      await connection.execute('DELETE FROM Registro_OCDE WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);
      await connection.execute('DELETE FROM Registro_ODS WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);
      await connection.execute('DELETE FROM Registro_Aportes WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);
      await connection.execute('DELETE FROM Registro_CTI_Vitae WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);
      await connection.execute('DELETE FROM Registro_Niveles_Tecnologicos WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);
      await connection.execute('DELETE FROM Registro_PIU WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);
      await connection.execute('DELETE FROM Registro_Keywords WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);
      await connection.execute('DELETE FROM Registro_Soluciones WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);
      await connection.execute('DELETE FROM Registro_Archivos WHERE usuario_id = ? AND registro_id = ? AND tipo = ?', [usuarioId, registroId, tipo]);

      // Eliminar el registro principal
      const tabla = this.getTablaByTipo(tipo);
      const [result] = await connection.execute<ResultSetHeader>(
        `DELETE FROM ${tabla} WHERE registro_id = ? AND usuario_id = ?`,
        [registroId, usuarioId]
      );

      await connection.commit();
      console.log(`Registro eliminado exitosamente. Filas afectadas: ${result.affectedRows}`);

      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Error al eliminar registro:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Métodos para obtener datos OCDE y ODS
  async getAreasOCDE() {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM areas ORDER BY codigo'
    );
    return rows;
  }

  async getSubAreasByArea(areaId: number) {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM sub_areas WHERE area_id = ? ORDER BY codigo',
      [areaId]
    );
    return rows;
  }

  async getDisciplinasBySubArea(subAreaId: number) {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM disciplinas WHERE sub_area_id = ? ORDER BY codigo',
      [subAreaId]
    );
    return rows;
  }

  async getObjetivosODS() {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM objetivos ORDER BY id'
    );
    return rows;
  }

  async getMetasByObjetivo(objetivoId: number) {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM metas WHERE objetivo_id = ? ORDER BY codigo',
      [objetivoId]
    );
    return rows;
  }

  async getKeywords() {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM keywords_catalog ORDER BY category, keyword'
    );
    return rows;
  }

  // Métodos para administradores
  async getRegistrosParaAprobacion() {
    const registros: any[] = [];

    const tablas = [
      { tabla: 'Registro_Docente_Investigador', tipo: 'docente_investigador' },
      { tabla: 'Registro_Grupo_Centro_Instituto', tipo: 'grupo_centro_instituto' },
      { tabla: 'Registro_Laboratorio', tipo: 'laboratorio' },
      { tabla: 'Registro_Centro_Produccion', tipo: 'centro_produccion' }
    ];

    for (const { tabla, tipo } of tablas) {
      const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT r.*, u.email as usuario_email, '${tipo}' as tipo
         FROM ${tabla} r
         JOIN Usuarios u ON r.usuario_id = u.usuario_id
         WHERE r.estado = 'completado'
         ORDER BY r.fecha_completado ASC`
      );
      registros.push(...rows);
    }

    return registros;
  }

  async aprobarRechazarRegistro(registroId: number, tipo: string, estado: string, observaciones?: string) {
    const tabla = this.getTablaByTipo(tipo);
    
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE ${tabla} 
       SET estado = ?, observaciones = ?, fecha_aprobacion = CURRENT_TIMESTAMP
       WHERE registro_id = ?`,
      [estado, observaciones || null, registroId]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    // Obtener el usuario_id para devolver el registro completo
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT usuario_id FROM ${tabla} WHERE registro_id = ?`,
      [registroId]
    );

    if (rows.length > 0) {
      return await this.getRegistroById(registroId, rows[0].usuario_id, tipo);
    }

    return null;
  }
}
