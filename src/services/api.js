import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5237/api',
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
export const atenderTicket = (id) => API.put(`/admin/tickets/${id}/atender`);
export const resolverTicket = (id) => API.put(`/admin/tickets/${id}/resolver`);
export const cancelarTicket = (id) => API.delete(`/admin/tickets/${id}`);

// ── Auth ──────────────────────────────────────────
export const login = (credentials) => API.post('/auth/login', credentials);
