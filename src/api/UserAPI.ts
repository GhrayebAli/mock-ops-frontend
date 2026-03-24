import { apiGet, apiPost, apiPut } from './client';
import type { User } from '../interfaces/User';

export const UserAPI = {
  fetchUsers: () => apiGet<User[]>('/users'),
  fetchUserDetails: (userId: string) => apiGet<User>(`/users/${userId}`),
  createUser: (data: Partial<User>) => apiPost<User>('/users', data),
  updateUser: (userId: string, data: Partial<User>) => apiPut<User>(`/users/${userId}`, data),
  login: (email: string, password: string) => apiPost<{ user: User; token: string }>('/auth/login', { email, password }),
};
