// Definición de tipos centralizados para la aplicación

// Tipos de usuario y autenticación
export interface User {
  id: string;
  username: string;
  email: string;
  rol: 'ADMIN' | 'CLIENTE';
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  nombre?: string;
  telefono?: string;
  direccion?: string;
  rol?: string;
}

// Tipos para clientes
export interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  usuario?: {
    id: string;
  };
}

// Tipos para mascotas
export interface Pet {
  id: string;
  nombre: string;
  tipo: string;
  raza: string;
  edad: number;
  cliente: {
    id: string;
    nombre: string;
  };
  foto?: string;
}

export interface PetForm {
  nombre: string;
  tipo: string;
  raza: string;
  edad: number;
  cliente?: {
    id: string;
  };
}

// Tipos para servicios
export interface Service {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
}

export interface ServiceForm {
  nombre: string;
  duracion: number;
  precio: number;
}

// Tipos para productos
export interface Product {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
}

export interface ProductForm {
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
}

// Tipos para citas
export interface Appointment {
  id: string;
  mascota: {
    id: string;
    nombre: string;
  };
  servicio: {
    id: string;
    nombre: string;
  };
  fecha: string;
  hora: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  notas: string;
}

export interface AppointmentForm {
  mascotaId?: string;
  servicioId?: string;
  fecha?: string;
  hora?: string;
  estado?: string;
  notas?: string;
}

// Tipos para facturas
export interface Invoice {
  id: string;
  clienteId: string;
  fecha: string;
  detalles: InvoiceItem[];
  estado?: string;
}

export interface InvoiceForm {
  clienteId: string;
  fecha: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  tipo: string;
  itemId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface InvoiceDetail {
  id?: string;
  productoId?: string;
  servicioId?: string;
  cantidad: number;
  precioUnitario?: number;
}

export interface ValidationParams {
  fecha: string;
  horaInicio: string;
  duracion: number;
}

export interface AddProductsData {
  productos: {
    id: string;
    cantidad: number;
  }[];
}

export interface BillAppointmentData {
  productos?: {
    id: string;
    cantidad: number;
  }[];
}

// Tipo para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}