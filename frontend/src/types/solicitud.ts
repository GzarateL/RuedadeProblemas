// /frontend/src/types/solicitud.ts

export interface Solicitud {
  solicitud_id: number;
  remitente_tipo: 'unsa' | 'externo';
  remitente_id: number;
  destinatario_tipo: 'unsa' | 'externo';
  destinatario_id: number;
  tipo_match: 'capacidad' | 'desafio';
  match_id: number;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  mensaje: string | null;
  fecha_creacion: string;
  fecha_respuesta: string | null;
  // Campos adicionales del join
  remitente_nombre?: string;
  destinatario_nombre?: string;
  match_titulo?: string;
  match_descripcion?: string;
}

export interface CrearSolicitudData {
  destinatario_tipo: 'unsa' | 'externo';
  destinatario_id: number;
  tipo_match: 'capacidad' | 'desafio';
  match_id: number;
  mensaje?: string;
}
