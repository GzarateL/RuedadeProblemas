// Configuración centralizada de la API
// Por defecto usa el puerto 3000 donde corre el backend
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  register: `${API_URL}/api/auth/register`,
  login: `${API_URL}/api/auth/login`,
  verify: `${API_URL}/api/auth/verify`,
  me: `${API_URL}/api/auth/me`,
  
  // Matches
  myMatches: `${API_URL}/api/matches/my-matches`,
  matchStatus: `${API_URL}/api/matches/status`,
  matchToggle: `${API_URL}/api/matches/toggle`,
  matchDesafio: (id: number) => `${API_URL}/api/matches/desafio/${id}`,
  matchCapacidad: (id: number) => `${API_URL}/api/matches/capacidad/${id}`,
  
  // Solicitudes
  solicitudes: `${API_URL}/api/solicitudes`,
  solicitudesEnviadas: `${API_URL}/api/solicitudes/enviadas`,
  solicitudesRecibidas: `${API_URL}/api/solicitudes/recibidas`,
  solicitudesPendientesCount: `${API_URL}/api/solicitudes/pendientes/count`,
  solicitudEstadoMatch: `${API_URL}/api/solicitudes/estado-match`,
  responderSolicitud: (id: number) => `${API_URL}/api/solicitudes/${id}/responder`,
  
  // Chats
  chats: `${API_URL}/api/chats`,
  chatMensajes: (id: number) => `${API_URL}/api/chats/${id}/mensajes`,
  chatsNoLeidos: `${API_URL}/api/chats/no-leidos/count`,
  
  // Desafíos
  desafios: `${API_URL}/api/desafios`,
  misDesafios: `${API_URL}/api/desafios/mis-desafios`,
  
  // Capacidades
  capacidades: `${API_URL}/api/capacidades`,
  misCapacidades: `${API_URL}/api/capacidades/mis-capacidades`,
  
  // Cronograma
  cronograma: `${API_URL}/api/cronograma`,
  
  // Palabras Clave
  palabrasClaveStats: `${API_URL}/api/palabras-clave/stats`,
  
  // Usuarios
  users: `${API_URL}/api/users`,
  usersExport: `${API_URL}/api/users/export`,
};
