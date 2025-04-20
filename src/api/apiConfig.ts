import axios from 'axios';

// Usar la URL de la API desplegada en Render
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://peluqueriacanina-api.onrender.com/api',
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

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Manejar errores específicos de la API
      switch (error.response.status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Acceso denegado
          console.error('Acceso denegado');
          break;
        case 404:
          // Recurso no encontrado
          console.error('Recurso no encontrado');
          break;
        case 500:
          // Error del servidor
          console.error('Error del servidor');
          break;
        default:
          console.error('Error desconocido');
      }
    }
    return Promise.reject(error);
  }
);

export default api;