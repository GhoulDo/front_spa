// Tipos de autenticación
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  address: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  nombre: string;
  role: 'ADMIN' | 'CLIENTE';
  createdAt: string;
  updatedAt: string;
}

// Tipos de cliente
export interface Client {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

// Tipos de mascota
export interface Pet {
  id: string;
  clientId: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetForm {
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  notes: string;
  clientId: string;
}

// Tipos de servicio y producto
export interface Service {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceForm {
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface Product {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
}

// Tipos de cita
export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  serviceId: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentForm {
  clientId: string;
  petId: string;
  serviceId: string;
  date: string;
  notes: string;
}

// Tipos de factura
export interface Invoice {
  id: string;
  clienteId: string;
  fecha: string;
  total: number;
  estado: string;
  detalles: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  tipo: 'SERVICIO' | 'PRODUCTO';
  itemId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  type?: 'service' | 'product';
}

export interface InvoiceForm {
  clienteId: string;
  fecha: Date;
  items: InvoiceItem[];
}

// Tipos para filtros
export interface AppointmentFilter {
  status?: string;
  petId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  orderBy?: string;
  direction?: 'asc' | 'desc';
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Tipos para facturación unificada
export interface BillAppointmentData {
  productosIds: string[];
  cantidades: number[];
}

export interface AddProductsData {
  productosIds: string[];
  cantidades: number[];
} 