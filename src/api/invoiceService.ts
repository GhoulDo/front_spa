import api from './apiConfig';
import { Invoice, InvoiceForm, InvoiceItem } from '../types';

export const invoiceService = {
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get('/facturas');
    return response.data;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/facturas/${id}`);
    return response.data;
  },

  getClientInvoices: async (clientId: string): Promise<Invoice[]> => {
    const response = await api.get(`/facturas/cliente/${clientId}`);
    return response.data;
  },

  createInvoice: async (data: InvoiceForm): Promise<Invoice> => {
    const response = await api.post('/facturas', data);
    return response.data;
  },

  updateInvoice: async (id: string, data: Partial<InvoiceForm>): Promise<Invoice> => {
    const response = await api.put(`/facturas/${id}`, data);
    return response.data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/facturas/${id}`);
  },

  addItem: async (invoiceId: string, item: InvoiceItem): Promise<Invoice> => {
    const response = await api.post(`/facturas/${invoiceId}/items`, item);
    return response.data;
  },

  removeItem: async (invoiceId: string, itemId: string): Promise<Invoice> => {
    const response = await api.delete(`/facturas/${invoiceId}/items/${itemId}`);
    return response.data;
  },

  downloadInvoice: async (id: string): Promise<Blob> => {
    const response = await api.get(`/facturas/${id}/descargar`, {
      responseType: 'blob'
    });
    return response.data;
  }
}; 