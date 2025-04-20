import api from './apiConfig';
import { Client, ClientForm } from '../types';

export const clientService = {
  getClients: async (): Promise<Client[]> => {
    const response = await api.get('/clientes');
    return response.data;
  },

  getClient: async (id: string): Promise<Client> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  createClient: async (data: ClientForm): Promise<Client> => {
    const response = await api.post('/clientes', data);
    return response.data;
  },

  updateClient: async (id: string, data: Partial<ClientForm>): Promise<Client> => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },

  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },

  getClientProfile: async (): Promise<Client> => {
    const response = await api.get('/clientes/perfil');
    return response.data;
  },

  updateClientProfile: async (data: Partial<ClientForm>): Promise<Client> => {
    const response = await api.put('/clientes/perfil', data);
    return response.data;
  }
}; 