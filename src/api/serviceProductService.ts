import api from './apiConfig';
import { Service, ServiceForm, Product, ProductForm } from '../types';

export const serviceProductService = {
  // Servicios
  getServices: async (): Promise<Service[]> => {
    const response = await api.get('/servicios');
    return response.data;
  },

  getService: async (id: string): Promise<Service> => {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
  },

  createService: async (data: ServiceForm): Promise<Service> => {
    const response = await api.post('/servicios', data);
    return response.data;
  },

  updateService: async (id: string, data: Partial<ServiceForm>): Promise<Service> => {
    const response = await api.put(`/servicios/${id}`, data);
    return response.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/servicios/${id}`);
  },

  // Productos
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/productos');
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  createProduct: async (data: ProductForm): Promise<Product> => {
    const response = await api.post('/productos', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<ProductForm>): Promise<Product> => {
    const response = await api.put(`/productos/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/productos/${id}`);
  },

  updateStock: async (id: string, quantity: number): Promise<Product> => {
    const response = await api.put(`/productos/${id}/stock`, { quantity });
    return response.data;
  }
}; 