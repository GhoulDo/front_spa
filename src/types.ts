export interface User {
  id: string;
  username: string;
  email: string;
  rol: string;
  nombre: string;
}

export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  usuarioId: string;
}

export interface Pet {
  id: string;
  nombre: string;
  tipo: string;
  raza: string;
  edad: number;
  clienteId: string;
}

export interface Service {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
}

export interface Product {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
}

export interface Appointment {
  id: string;
  mascotaId: string;
  servicioId: string;
  fecha: string;
  hora: string;
  estado: string;
  notas?: string;
}

export interface Invoice {
  id: string;
  clienteId: string;
  fecha: string;
  total: number;
  estado: string;
  detalles: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  tipo: 'SERVICIO' | 'PRODUCTO';
  itemId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface InvoiceForm {
  clienteId: string;
  fecha: string;
  items: InvoiceItem[];
  metodoPago?: string;
  notas?: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  email: string;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface PetForm {
  nombre: string;
  tipo: string;
  raza: string;
  edad: number;
  clienteId: string;
}

export interface ServiceForm {
  nombre: string;
  duracion: number;
  precio: number;
}

export interface ProductForm {
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
}

export interface AppointmentForm {
  mascotaId: string;
  servicioId: string;
  fecha: string;
  hora: string;
  estado: string;
  notas?: string;
}

export interface ClientForm {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface AppointmentFilter {
  estado?: string;
  mascotaId?: string;
  servicioId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  ordenarPor?: string;
  direccion?: 'asc' | 'desc';
}

export interface ValidationParams {
  servicioId: string;
  fecha: string;
  hora: string;
}

export interface InvoiceDetail {
  productoId?: string;
  servicioId?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface BillAppointmentData {
  productosIds: string[];
  cantidades: number[];
}

export interface AddProductsData {
  productosIds: string[];
  cantidades: number[];
}