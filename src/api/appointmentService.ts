import api from './apiConfig';
import { Appointment, AppointmentForm } from '../types';

export const appointmentService = {
  getAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/citas');
    return response.data;
  },

  getAppointment: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/citas/${id}`);
    return response.data;
  },

  getClientAppointments: async (clientId: string): Promise<Appointment[]> => {
    const response = await api.get(`/citas/cliente/${clientId}`);
    return response.data;
  },

  createAppointment: async (data: AppointmentForm): Promise<Appointment> => {
    const response = await api.post('/citas', data);
    return response.data;
  },

  updateAppointment: async (id: string, data: Partial<AppointmentForm>): Promise<Appointment> => {
    const response = await api.put(`/citas/${id}`, data);
    return response.data;
  },

  deleteAppointment: async (id: string): Promise<void> => {
    await api.delete(`/citas/${id}`);
  },

  cancelAppointment: async (id: string): Promise<Appointment> => {
    const response = await api.put(`/citas/${id}/cancelar`);
    return response.data;
  },

  completeAppointment: async (id: string): Promise<Appointment> => {
    const response = await api.put(`/citas/${id}/completar`);
    return response.data;
  }
}; 