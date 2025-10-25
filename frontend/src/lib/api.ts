// Configuración centralizada del API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Helper para hacer fetch con autenticación
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}
