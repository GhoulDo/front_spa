import api from './apiConfig';

export const dashboardService = {
  // Obtener estadísticas para el dashboard
  getStats: async () => {
    try {
      // Obtener mascotas del usuario
      const mascotasResponse = await api.get('/api/mascotas');
      const totalMascotas = mascotasResponse.data.length || 0;
      
      // Obtener citas pendientes
      const citasResponse = await api.get('/api/citas?estado=PENDIENTE');
      const citasPendientes = citasResponse.data.length || 0;
      
      // Obtener facturas
      const facturasResponse = await api.get('/api/facturas');
      const ultimasFacturas = facturasResponse.data.length || 0;
      
      return {
        totalMascotas,
        citasPendientes,
        ultimasFacturas
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  },
  
  // Estadísticas para administradores
  getAdminStats: async () => {
    try {
      // Obtener número total de clientes
      const clientesResponse = await api.get('/api/clientes');
      const totalClientes = clientesResponse.data.length || 0;
      
      // Obtener número total de mascotas
      const mascotasResponse = await api.get('/api/mascotas');
      const totalMascotas = mascotasResponse.data.length || 0;
      
      // Obtener número total de citas
      const citasResponse = await api.get('/api/citas');
      const totalCitas = citasResponse.data.length || 0;
      
      // Obtener facturas
      const facturasResponse = await api.get('/api/facturas');
      const facturas = facturasResponse.data || [];
      
      // Calcular ingresos totales
      const ingresosTotales = facturas.reduce((total: number, factura: any) => 
        total + (factura.total || 0), 0);
      
      return {
        totalClientes,
        totalMascotas,
        totalCitas,
        ingresosTotales,
        // Se podrían agregar más estadísticas aquí según sea necesario
      };
    } catch (error) {
      console.error('Error al obtener estadísticas administrativas:', error);
      throw error;
    }
  }
};
