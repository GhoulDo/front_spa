import api from './apiConfig';
import { Invoice, InvoiceForm } from '../types';

export const invoiceService = {
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get('/facturas');
    return response.data;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/facturas/${id}`);
    return response.data;
  },

  createInvoice: async (data: InvoiceForm): Promise<Invoice> => {
    const response = await api.post('/facturas', data);
    return response.data;
  },

  updateInvoice: async (id: string, data: InvoiceForm): Promise<Invoice> => {
    const response = await api.put(`/facturas/${id}`, data);
    return response.data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/facturas/${id}`);
  },

  downloadInvoice: async (id: string): Promise<Blob> => {
    const response = await api.get(`/facturas/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
};