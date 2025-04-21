import api from './apiConfig';
import { LoginForm, RegisterForm, User } from '../types';

export const authService = {
  login: async (credentials: LoginForm): Promise<{ token: string; user: User }> => {
    try {
      // Usa la ruta correcta según la documentación
      const response = await api.post('/api/auth/login', credentials);
      console.log('Respuesta de login:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  register: async (data: RegisterForm): Promise<User> => {
    try {
      // Corrige también esta ruta
      const response = await api.post('/api/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
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