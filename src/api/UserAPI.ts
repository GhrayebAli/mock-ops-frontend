import { INTERNAL_OPS_API } from './client';
import type { User } from '../interfaces/User';

export const UserAPI = {
  fetchUsers: async (): Promise<User[]> => {
    const response = await INTERNAL_OPS_API.request<{ data: User[] }>({
      method: 'GET',
      url: '/users',
    });
    return response.data.data;
  },

  fetchUserDetails: async (userId: string): Promise<User> => {
    const response = await INTERNAL_OPS_API.request<{ data: User }>({
      method: 'GET',
      url: `/users/${userId}`,
    });
    return response.data.data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const response = await INTERNAL_OPS_API.request<{ data: User }>({
      method: 'POST',
      url: '/users',
      data: userData,
    });
    return response.data.data;
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await INTERNAL_OPS_API.request<{ data: User }>({
      method: 'PUT',
      url: `/users/${userId}`,
      data: userData,
    });
    return response.data.data;
  },

  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await INTERNAL_OPS_API.request<{ data: { user: User; token: string } }>({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });
    return response.data.data;
  },
};
