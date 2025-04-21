import axios from 'axios';

// URL base correcta de la API
const API_URL = 'https://peluqueriacanina-api.onrender.com';

// Crear instancia de Axios con la configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para añadir el token a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si existe un token, añadirlo al header de autorización
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log(`Enviando petición a: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Error en configuración de la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(`Respuesta exitosa de ${response.config.url}`);
    return response;
  },
  (error) => {
    // Si hay una respuesta del servidor
    if (error.response) {
      console.error(`Error ${error.response.status} en petición a ${error.config?.url}:`, error.response.data);
      
      // Si es error de autenticación, redireccionar a login
      if (error.response.status === 401) {
        console.log('Token inválido o expirado.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } 
    // Si no hay respuesta (error de red)
    else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } 
    // Otros errores
    else {
      console.error('Error en la petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Función para establecer el token de autenticación
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Token JWT establecido en el header de autorización');
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    console.log('Token JWT eliminado del header de autorización');
  }
};

export default api;