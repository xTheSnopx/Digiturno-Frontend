import axios from 'axios';

// En producción, VITE_API_URL vendrá de las variables de entorno de Vercel.
// En local, usará el fallback de localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to protected requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('digiturno_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Public: Tickets ──────────────────────────────
export const getCola = () => API.get('/tickets/cola');
export const crearTicket = (data) => API.post('/tickets', data);

// ── Admin (JWT protected) ─────────────────────────
export const getTicketsHoy = () => API.get('/admin/tickets');
export const getStats = () => API.get('/admin/stats');
export const atenderTicket = (id, nombreTecnico) =>
  API.put(`/admin/tickets/${id}/atender`, { nombreTecnico });
export const resolverTicket = (id, nombreTecnico) =>
  API.put(`/admin/tickets/${id}/resolver`, { nombreTecnico });

// ── Auth ──────────────────────────────────────────
export const login = (credentials) => API.post('/auth/login', credentials);
