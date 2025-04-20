import api from './apiConfig';
import { LoginForm, RegisterForm, User } from '../types';

export const authService = {
  login: async (credentials: LoginForm): Promise<{ token: string; user: User }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterForm): Promise<User> => {
    const response = await api.post('/auth/registro', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/usuario');
    return response.data;
  },

  updatePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.put('/auth/password', { oldPassword, newPassword });
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/auth/recuperar', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  }
}; 