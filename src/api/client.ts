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
