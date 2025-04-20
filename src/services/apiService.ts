import axios from 'axios';
import { 
  User, Client, Pet, Service, Product, Appointment, Invoice,
  LoginForm, RegisterForm, ClientForm, PetForm, ServiceForm, ProductForm, ValidationParams, InvoiceDetail, AddProductsData, BillAppointmentData,
  AppointmentForm, InvoiceForm,
  ApiResponse
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Servicios de autenticación
export const authService = {
  login: async (data: LoginForm): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterForm): Promise<ApiResponse<User>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Servicios de usuarios
export const userService = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Servicios de clientes
export const clientService = {
  getAll: async (): Promise<ApiResponse<Client[]>> => {
    const response = await api.get('/clientes');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Client>> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  create: async (data: ClientForm): Promise<ApiResponse<Client>> => {
    const response = await api.post('/clientes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ClientForm>): Promise<ApiResponse<Client>> => {
    const response = await api.put(`/clientes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },
};

// Servicios de mascotas
export const petService = {
  getAll: async (): Promise<ApiResponse<Pet[]>> => {
    const response = await api.get('/mascotas');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Pet>> => {
    const response = await api.get(`/mascotas/${id}`);
    return response.data;
  },

  create: async (data: PetForm): Promise<ApiResponse<Pet>> => {
    const response = await api.post('/mascotas', data);
    return response.data;
  },

  update: async (id: string, data: Partial<PetForm>): Promise<ApiResponse<Pet>> => {
    const response = await api.put(`/mascotas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/mascotas/${id}`);
    return response.data;
  },

  getByClient: async (clientId: string): Promise<ApiResponse<Pet[]>> => {
    const response = await api.get(`/mascotas/cliente/${clientId}`);
    return response.data;
  },
};

// Servicios de servicios
export const serviceService = {
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    const response = await api.get('/servicios');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Service>> => {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
  },

  create: async (data: ServiceForm): Promise<ApiResponse<Service>> => {
    const response = await api.post('/servicios', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ServiceForm>): Promise<ApiResponse<Service>> => {
    const response = await api.put(`/servicios/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/servicios/${id}`);
    return response.data;
  },
};

// Servicios de productos
export const productService = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/productos');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  create: async (data: ProductForm): Promise<ApiResponse<Product>> => {
    const response = await api.post('/productos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ProductForm>): Promise<ApiResponse<Product>> => {
    const response = await api.put(`/productos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
};

// Servicios de citas
export const appointmentService = {
  getAll: async (filters?: AppointmentForm): Promise<ApiResponse<Appointment[]>> => {
    const response = await api.get('/citas', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Appointment>> => {
    const response = await api.get(`/citas/${id}`);
    return response.data;
  },

  getByDate: async (date: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await api.get(`/citas/fecha/${date}`);
    return response.data;
  },

  getToday: async (): Promise<ApiResponse<Appointment[]>> => {
    const response = await api.get('/citas/hoy');
    return response.data;
  },

  getByPet: async (petId: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await api.get(`/citas/mascota/${petId}`);
    return response.data;
  },

  create: async (data: AppointmentForm): Promise<ApiResponse<Appointment>> => {
    const response = await api.post('/citas', data);
    return response.data;
  },

  update: async (id: string, data: Partial<AppointmentForm>): Promise<ApiResponse<Appointment>> => {
    const response = await api.put(`/citas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/citas/${id}`);
    return response.data;
  },

  validateAvailability: async (data: ValidationParams): Promise<ApiResponse<boolean>> => {
    const response = await api.post('/citas/validar', data);
    return response.data;
  },
};

// Servicios de facturación
export const invoiceService = {
  getAll: async (): Promise<ApiResponse<Invoice[]>> => {
    const response = await api.get('/facturas');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Invoice>> => {
    const response = await api.get(`/facturas/${id}`);
    return response.data;
  },

  create: async (data: InvoiceForm): Promise<ApiResponse<Invoice>> => {
    const response = await api.post('/facturas', data);
    return response.data;
  },

  calculateTotal: async (data: { detalles: InvoiceDetail[] }): Promise<ApiResponse<number>> => {
    const response = await api.post('/facturas/calcular', data);
    return response.data;
  },

  billAppointment: async (appointmentId: string, data: BillAppointmentData): Promise<ApiResponse<Invoice>> => {
    const response = await api.post(`/facturas/cita/${appointmentId}`, data);
    return response.data;
  },

  addProducts: async (invoiceId: string, data: AddProductsData): Promise<ApiResponse<Invoice>> => {
    const response = await api.post(`/facturas/${invoiceId}/productos`, data);
    return response.data;
  },

  pay: async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    const response = await api.post(`/facturas/${invoiceId}/pagar`);
    return response.data;
  },

  getByClient: async (clientId: string): Promise<ApiResponse<Invoice[]>> => {
    const response = await api.get(`/facturas/cliente/${clientId}`);
    return response.data;
  },
};

// Servicio de health check
export const healthService = {
  check: async (): Promise<ApiResponse<{ status: string }>> => {
    const response = await api.get('/health');
    return response.data;
  },
};