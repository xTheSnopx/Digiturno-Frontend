import { login as apiLogin } from './api';

const TOKEN_KEY = 'digiturno_token';
const USER_KEY  = 'digiturno_user';

export async function loginTecnico(username, password) {
  const res = await apiLogin({ username, password });
  localStorage.setItem(TOKEN_KEY, res.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify({
    nombreCompleto: res.data.nombreCompleto,
    username: res.data.username,
  }));
  return res.data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!getToken();
}
