// /frontend/src/types/chat.ts

export interface Chat {
  chat_id: number;
  solicitud_id: number;
  usuario1_tipo: 'unsa' | 'externo';
  usuario1_id: number;
  usuario2_tipo: 'unsa' | 'externo';
  usuario2_id: number;
  tipo_match: 'capacidad' | 'desafio';
  match_id: number;
  titulo_chat: string;
  activo: boolean;
  fecha_creacion: string;
  ultima_actividad: string;
  otro_usuario_nombre?: string;
  mensajes_no_leidos?: number;
}

export interface Mensaje {
  mensaje_id: number;
  chat_id: number;
  remitente_tipo: 'unsa' | 'externo';
  remitente_id: number;
  remitente_nombre: string;
  contenido: string;
  fecha_envio: string;
  leido?: boolean;
}
