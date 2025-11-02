import { RowDataPacket, ResultSetHeader } from 'mysql2';
import db from '../../config/db';

interface TipoHeliceInterna {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface RegistroHeliceInterna {
  id?: number;
  tipo_id: number;
  usuario_id: number;
  nombre_completo?: string;
  nombre_entidad?: string;
  email_corporativo: string;
  telefono: string;
  oficina_departamento: string;
  estado: 'borrador' | 'completado' | 'aprobado' | 'rechazado';
  paso_actual: number;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
  fecha_completado?: Date;
  fecha_aprobacion?: Date;
}

interface DatosRegistroCompleto {
  // Información básica
  nombre_completo?: string;
  nombre_entidad?: string;
  email_corporativo: string;
  telefono: string;
  oficina_departamento: string;
  cti_vitae?: string;

  // Áreas OCDE
  areas_ocde?: number[];
  sub_areas_ocde?: number[];
  disciplinas_ocde?: number[];

  // ODS
  objetivos_ods?: number[];
  metas_ods?: number[];

  // Nivel de aporte
  nivel_aporte?: 'alto' | 'medio' | 'bajo';
  descripcion_aporte?: string;

  // Integrantes CTI (para grupos/centros/institutos)
  integrantes_cti?: string[];

  // Niveles tecnológicos
  nivel_trl?: number;
  descripcion_trl?: string;
  nivel_crl?: number;
  descripcion_crl?: string;

  // PIU
  piu?: {
    articulos_q1?: number;
    articulos_q2?: number;
    articulos_q3?: number;
    articulos_q4?: number;
    articulos_otros?: number;
    libros_investigacion?: number;
    capitulos_libro?: number;
    patentes_otorgadas?: number;
    patentes_solicitadas?: number;
    modelos_utilidad?: number;
    disenos_industriales?: number;
    software_registrado?: number;
    prototipos?: number;
    tesis_doctorado?: number;
    tesis_maestria?: number;
    tesis_pregrado?: number;
    informes_tecnicos?: number;
    consultoria_especializada?: number;
  };

  // Soluciones
  soluciones?: Array<{
    problema: string;
    solucion: string;
  }>;

  // Paso actual
  paso_actual?: number;
}

export class HeliceInternaService {
  
  async getTipos(): Promise<TipoHeliceInterna[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM tipos_helice_interna WHERE activo = TRUE ORDER BY id'
    );
    return rows as TipoHeliceInterna[];
  }

  async crearRegistro(
    usuarioId: number, 
    tipoId: number, 
    datos: DatosRegistroCompleto
  ): Promise<RegistroHeliceInterna> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Crear registro principal
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO registros_helice_interna 
         (tipo_id, usuario_id, nombre_completo, nombre_entidad, email_corporativo, 
          telefono, oficina_departamento, estado, paso_actual) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'borrador', ?)`,
        [
          tipoId,
          usuarioId,
          datos.nombre_completo || null,
          datos.nombre_entidad || null,
          datos.email_corporativo,
          datos.telefono,
          datos.oficina_departamento,
          datos.paso_actual || 1
        ]
      );

      const registroId = result.insertId;

      // Guardar datos adicionales si existen
      if (datos.areas_ocde || datos.sub_areas_ocde || datos.disciplinas_ocde) {
        await this.guardarAreasOCDE(connection, registroId, datos);
      }

      if (datos.objetivos_ods) {
        await this.guardarODS(connection, registroId, datos);
      }

      if (datos.nivel_aporte) {
        await this.guardarNivelAporte(connection, registroId, datos);
      }

      if (datos.integrantes_cti) {
        await this.guardarIntegrantesCTI(connection, registroId, datos.integrantes_cti);
      }

      if (datos.nivel_trl || datos.nivel_crl) {
        await this.guardarNivelesTecnologicos(connection, registroId, datos);
      }

      if (datos.piu) {
        await this.guardarPIU(connection, registroId, datos.piu);
      }

      if (datos.soluciones) {
        await this.guardarSoluciones(connection, registroId, datos.soluciones);
      }

      // El usuario ya tiene rol 'interno' desde el registro inicial
      // No es necesario actualizar el rol

      await connection.commit();

      // Obtener el registro completo
      const registro = await this.getRegistroById(registroId, usuarioId);
      return registro!;

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
  ): Promise<RegistroHeliceInterna | null> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Verificar que el registro pertenece al usuario
      const [registroRows] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM registros_helice_interna WHERE id = ? AND usuario_id = ?',
        [registroId, usuarioId]
      );

      if (registroRows.length === 0) {
        return null;
      }

      // Actualizar registro principal
      await connection.execute(
        `UPDATE registros_helice_interna 
         SET nombre_completo = ?, nombre_entidad = ?, email_corporativo = ?, 
             telefono = ?, oficina_departamento = ?, paso_actual = ?,
             fecha_actualizacion = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
          datos.nombre_completo || null,
          datos.nombre_entidad || null,
          datos.email_corporativo,
          datos.telefono,
          datos.oficina_departamento,
          datos.paso_actual || 1,
          registroId
        ]
      );

      // Actualizar datos relacionados
      if (datos.areas_ocde !== undefined || datos.sub_areas_ocde !== undefined || datos.disciplinas_ocde !== undefined) {
        await connection.execute('DELETE FROM registro_areas_ocde WHERE registro_id = ?', [registroId]);
        if (datos.areas_ocde || datos.sub_areas_ocde || datos.disciplinas_ocde) {
          await this.guardarAreasOCDE(connection, registroId, datos);
        }
      }

      if (datos.objetivos_ods !== undefined) {
        await connection.execute('DELETE FROM registro_ods WHERE registro_id = ?', [registroId]);
        if (datos.objetivos_ods.length > 0) {
          await this.guardarODS(connection, registroId, datos);
        }
      }

      if (datos.nivel_aporte !== undefined) {
        await connection.execute('DELETE FROM registro_nivel_aporte WHERE registro_id = ?', [registroId]);
        if (datos.nivel_aporte) {
          await this.guardarNivelAporte(connection, registroId, datos);
        }
      }

      if (datos.integrantes_cti !== undefined) {
        await connection.execute('DELETE FROM registro_integrantes_cti WHERE registro_id = ?', [registroId]);
        if (datos.integrantes_cti.length > 0) {
          await this.guardarIntegrantesCTI(connection, registroId, datos.integrantes_cti);
        }
      }

      if (datos.nivel_trl !== undefined || datos.nivel_crl !== undefined) {
        await connection.execute('DELETE FROM registro_niveles_tecnologicos WHERE registro_id = ?', [registroId]);
        if (datos.nivel_trl || datos.nivel_crl) {
          await this.guardarNivelesTecnologicos(connection, registroId, datos);
        }
      }

      if (datos.piu !== undefined) {
        await connection.execute('DELETE FROM registro_piu WHERE registro_id = ?', [registroId]);
        if (datos.piu) {
          await this.guardarPIU(connection, registroId, datos.piu);
        }
      }

      if (datos.soluciones !== undefined) {
        await connection.execute('DELETE FROM registro_soluciones WHERE registro_id = ?', [registroId]);
        if (datos.soluciones.length > 0) {
          await this.guardarSoluciones(connection, registroId, datos.soluciones);
        }
      }

      await connection.commit();

      // Obtener el registro actualizado
      const registro = await this.getRegistroById(registroId, usuarioId);
      return registro;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getRegistrosByUsuario(usuarioId: number): Promise<RegistroHeliceInterna[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT r.*, t.nombre as tipo_nombre 
       FROM registros_helice_interna r
       JOIN tipos_helice_interna t ON r.tipo_id = t.id
       WHERE r.usuario_id = ?
       ORDER BY r.fecha_creacion DESC`,
      [usuarioId]
    );
    return rows as RegistroHeliceInterna[];
  }

  async getRegistroById(registroId: number, usuarioId: number): Promise<RegistroHeliceInterna | null> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT r.*, t.nombre as tipo_nombre 
       FROM registros_helice_interna r
       JOIN tipos_helice_interna t ON r.tipo_id = t.id
       WHERE r.id = ? AND r.usuario_id = ?`,
      [registroId, usuarioId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0] as RegistroHeliceInterna;
  }

  async completarRegistro(registroId: number, usuarioId: number): Promise<RegistroHeliceInterna | null> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Actualizar el registro de hélice interna
      const [result] = await connection.execute<ResultSetHeader>(
        `UPDATE registros_helice_interna 
         SET estado = 'aprobado', fecha_completado = CURRENT_TIMESTAMP, fecha_aprobacion = CURRENT_TIMESTAMP
         WHERE id = ? AND usuario_id = ? AND estado = 'borrador'`,
        [registroId, usuarioId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return null;
      }

      // El usuario ya tiene rol 'interno' desde el registro inicial
      // No es necesario actualizar el rol

      await connection.commit();
      connection.release();

      return await this.getRegistroById(registroId, usuarioId);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
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

  // Métodos para administradores
  async getRegistrosParaAprobacion() {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT r.*, t.nombre as tipo_nombre, u.email as usuario_email
       FROM registros_helice_interna r
       JOIN tipos_helice_interna t ON r.tipo_id = t.id
       JOIN Usuarios u ON r.usuario_id = u.usuario_id
       WHERE r.estado = 'completado'
       ORDER BY r.fecha_completado ASC`
    );
    return rows;
  }

  async aprobarRechazarRegistro(registroId: number, estado: string, comentarios?: string) {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE registros_helice_interna 
       SET estado = ?, fecha_aprobacion = CURRENT_TIMESTAMP
       WHERE id = ? AND estado = 'completado'`,
      [estado, registroId]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    // Aquí podrías agregar lógica para enviar notificaciones por email
    
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM vista_registros_helice_completa WHERE id = ?',
      [registroId]
    );

    return rows[0] || null;
  }

  // Métodos privados para guardar datos relacionados
  private async guardarAreasOCDE(connection: any, registroId: number, datos: DatosRegistroCompleto) {
    const areas = datos.areas_ocde || [];
    const subAreas = datos.sub_areas_ocde || [];
    const disciplinas = datos.disciplinas_ocde || [];

    for (const areaId of areas) {
      await connection.execute(
        'INSERT INTO registro_areas_ocde (registro_id, area_id) VALUES (?, ?)',
        [registroId, areaId]
      );
    }

    for (const subAreaId of subAreas) {
      await connection.execute(
        'INSERT INTO registro_areas_ocde (registro_id, sub_area_id) VALUES (?, ?)',
        [registroId, subAreaId]
      );
    }

    for (const disciplinaId of disciplinas) {
      await connection.execute(
        'INSERT INTO registro_areas_ocde (registro_id, disciplina_id) VALUES (?, ?)',
        [registroId, disciplinaId]
      );
    }
  }

  private async guardarODS(connection: any, registroId: number, datos: DatosRegistroCompleto) {
    const objetivos = datos.objetivos_ods || [];
    const metas = datos.metas_ods || [];

    for (const objetivoId of objetivos) {
      await connection.execute(
        'INSERT INTO registro_ods (registro_id, objetivo_id) VALUES (?, ?)',
        [registroId, objetivoId]
      );
    }

    for (const metaId of metas) {
      await connection.execute(
        'INSERT INTO registro_ods (registro_id, meta_id) VALUES (?, ?)',
        [registroId, metaId]
      );
    }
  }

  private async guardarNivelAporte(connection: any, registroId: number, datos: DatosRegistroCompleto) {
    await connection.execute(
      'INSERT INTO registro_nivel_aporte (registro_id, nivel_aporte, descripcion) VALUES (?, ?, ?)',
      [registroId, datos.nivel_aporte, datos.descripcion_aporte || null]
    );
  }

  private async guardarIntegrantesCTI(connection: any, registroId: number, integrantes: string[]) {
    for (let i = 0; i < integrantes.length; i++) {
      const url = integrantes[i].trim();
      if (url) {
        await connection.execute(
          'INSERT INTO registro_integrantes_cti (registro_id, url_cti_vitae, orden) VALUES (?, ?, ?)',
          [registroId, url, i + 1]
        );
      }
    }
  }

  private async guardarNivelesTecnologicos(connection: any, registroId: number, datos: DatosRegistroCompleto) {
    await connection.execute(
      `INSERT INTO registro_niveles_tecnologicos 
       (registro_id, nivel_trl, descripcion_trl, nivel_crl, descripcion_crl) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        registroId,
        datos.nivel_trl || null,
        datos.descripcion_trl || null,
        datos.nivel_crl || null,
        datos.descripcion_crl || null
      ]
    );
  }

  private async guardarPIU(connection: any, registroId: number, piu: any) {
    await connection.execute(
      `INSERT INTO registro_piu 
       (registro_id, articulos_q1, articulos_q2, articulos_q3, articulos_q4, articulos_otros,
        libros_investigacion, capitulos_libro, patentes_otorgadas, patentes_solicitadas,
        modelos_utilidad, disenos_industriales, software_registrado, prototipos,
        tesis_doctorado_dirigidas, tesis_maestria_dirigidas, tesis_pregrado_dirigidas,
        informes_tecnicos, consultoria_especializada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registroId,
        piu.articulos_q1 || 0,
        piu.articulos_q2 || 0,
        piu.articulos_q3 || 0,
        piu.articulos_q4 || 0,
        piu.articulos_otros || 0,
        piu.libros_investigacion || 0,
        piu.capitulos_libro || 0,
        piu.patentes_otorgadas || 0,
        piu.patentes_solicitadas || 0,
        piu.modelos_utilidad || 0,
        piu.disenos_industriales || 0,
        piu.software_registrado || 0,
        piu.prototipos || 0,
        piu.tesis_doctorado || 0,
        piu.tesis_maestria || 0,
        piu.tesis_pregrado || 0,
        piu.informes_tecnicos || 0,
        piu.consultoria_especializada || 0
      ]
    );
  }

  private async guardarSoluciones(connection: any, registroId: number, soluciones: Array<{problema: string, solucion: string}>) {
    for (let i = 0; i < soluciones.length; i++) {
      const sol = soluciones[i];
      if (sol.problema.trim() && sol.solucion.trim()) {
        await connection.execute(
          'INSERT INTO registro_soluciones (registro_id, problema_descripcion, solucion_propuesta, orden) VALUES (?, ?, ?, ?)',
          [registroId, sol.problema, sol.solucion, i + 1]
        );
      }
    }
  }
}