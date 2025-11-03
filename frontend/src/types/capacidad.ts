// /frontend/src/types/capacidad.ts
export interface CapacidadAdmin {
  registro_id: number;
  usuario_id: number;
  tipo_registro: 'docente_investigador' | 'grupo_centro_instituto' | 'laboratorio' | 'centro_produccion';
  
  // Información básica
  nombre_completo?: string; // Para docente investigador
  nombre?: string; // Para grupos/centros/laboratorios
  nombre_completo_responsable?: string; // Para grupos/centros/laboratorios
  email: string;
  telefono: string;
  programa_estudio?: string; // Para docente investigador
  oficina_departamento_vinculado?: string; // Para grupos/centros/laboratorios
  
  // Estado
  estado: 'borrador' | 'completado' | 'en_revision' | 'aprobado' | 'rechazado';
  fecha_creacion: string;
  
  // Datos relacionados (agregados por el backend)
  keywords: Array<{ id: number; keyword: string; category: string }>;
  ocde: Array<{ 
    area_id: number; 
    area_nombre: string;
    sub_area_id?: number;
    sub_area_nombre?: string;
    disciplina_id?: number; 
    disciplina_nombre?: string;
  }>;
  ods: Array<{ 
    objetivo_id: number; 
    objetivo_nombre: string;
    meta_id?: number;
    meta_codigo?: string;
    meta_descripcion?: string;
  }>;
  soluciones: Array<{
    titulo: string;
    problema: string;
    solucion: string;
  }>;
}