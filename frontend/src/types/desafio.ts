// /frontend/src/types/desafio.ts
export interface DesafioAdmin {
  desafio_id: number;
  usuario_id: number;
  titulo: string;
  descripcion: string;
  impacto: 'microlocal' | 'local' | 'distrital' | 'provincial' | 'regional';
  intentos_previos: string | null;
  fecha_creacion: string;
  nombre: string; // Nombre del usuario
  email: string; // Email del usuario
  tipo_participante: string | null; // Tipo de participante (empresa, gobierno, etc.)
  nombre_organizacion: string | null; // Nombre de la organización
}