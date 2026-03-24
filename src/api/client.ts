import axios from 'axios';

export const INTERNAL_OPS_API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token from localStorage on init
const token = localStorage.getItem('auth_token');
if (token) {
  INTERNAL_OPS_API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
  INTERNAL_OPS_API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token');
  delete INTERNAL_OPS_API.defaults.headers.common['Authorization'];
}

export const apiGet = <T>(url: string) =>
  INTERNAL_OPS_API.get<{ data: T }>(url).then(r => r.data.data);

export const apiPost = <T>(url: string, data?: unknown) =>
  INTERNAL_OPS_API.post<{ data: T }>(url, data).then(r => r.data.data);

export const apiPut = <T>(url: string, data?: unknown) =>
  INTERNAL_OPS_API.put<{ data: T }>(url, data).then(r => r.data.data);
