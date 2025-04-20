import api from './apiConfig';
import { Pet, PetForm } from '../types';

export const petService = {
  getPets: async (): Promise<Pet[]> => {
    const response = await api.get('/mascotas');
    return response.data;
  },

  getPet: async (id: string): Promise<Pet> => {
    const response = await api.get(`/mascotas/${id}`);
    return response.data;
  },

  getClientPets: async (clientId: string): Promise<Pet[]> => {
    const response = await api.get(`/mascotas/cliente/${clientId}`);
    return response.data;
  },

  createPet: async (data: PetForm): Promise<Pet> => {
    const response = await api.post('/mascotas', data);
    return response.data;
  },

  updatePet: async (id: string, data: Partial<PetForm>): Promise<Pet> => {
    const response = await api.put(`/mascotas/${id}`, data);
    return response.data;
  },

  deletePet: async (id: string): Promise<void> => {
    await api.delete(`/mascotas/${id}`);
  }
}; 