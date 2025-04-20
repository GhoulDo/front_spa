import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Mascotas from '../pages/Mascotas';
import Citas from '../pages/Citas';
import ServiciosProductos from '../pages/ServiciosProductos';
import Facturas from '../pages/Facturas';
import UsuariosClientes from '../pages/UsuariosClientes';
import PanelAdmin from '../pages/PanelAdmin';

const AppRoutes: React.FC = () => {
  const { state: { isAuthenticated, user } } = useAuth();

  const PrivateRoute: ({ children, roles }: {
    children: React.ReactNode;
    roles?: string[];
  }) => JSX.Element = ({ children, roles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user?.rol || '')) {
      return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

      {/* Rutas protegidas */}
      <Route path="/" element={
        <PrivateRoute>
          <Layout>
            <Routes>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="mascotas" element={<Mascotas />} />
              <Route path="citas" element={<Citas />} />
              <Route path="servicios-productos" element={<ServiciosProductos />} />
              <Route path="facturas" element={<Facturas />} />
              
              {/* Rutas de administración */}
              {user?.rol === 'ADMIN' && (
                <>
                  <Route path="usuarios-clientes" element={<UsuariosClientes />} />
                  <Route path="panel-admin" element={<PanelAdmin />} />
                </>
              )}
            </Routes>
          </Layout>
        </PrivateRoute>
      } />

      {/* Redirección para rutas no encontradas */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;