import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { setCredentials } from './store/authSlice';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Mascotas from './pages/Mascotas';
import Citas from './pages/Citas';
import Facturas from './pages/Facturas';
import UsuariosClientes from './pages/UsuariosClientes';
import ServiciosProductos from './pages/ServiciosProductos';
import PanelAdmin from './pages/PanelAdmin';

// Layouts
import Layout from './components/Layout';
import StatusIndicator from './components/StatusIndicator';

// Define tipos para RootState
interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: {
      rol: string;
    } | null;
  };
}

// Componente de ruta privada
const PrivateRoute = ({ element, requiredRole }: { element: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    console.log(`Acceso denegado: Se requiere rol ${requiredRole}`);
    return <Navigate to="/dashboard" />;
  }

  return <>{element}</>;
};

// Componente de inicialización
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Intentar restaurar la sesión si hay un token en localStorage
    const token = localStorage.getItem('token');
    const userJSON = localStorage.getItem('user');
    
    if (token && userJSON) {
      try {
        const user = JSON.parse(userJSON);
        dispatch(setCredentials({ token, user }));
        console.log('Sesión restaurada desde localStorage');
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
      }
    }
  }, [dispatch]);

  return <>{children}</>;
};

const App: React.FC = () => {
  const theme = createTheme({
    // Tu tema personalizado aquí
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppInitializer>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute element={<Layout><Dashboard /></Layout>} />} />
              <Route path="/dashboard" element={<PrivateRoute element={<Layout><Dashboard /></Layout>} />} />
              <Route path="/mascotas" element={<PrivateRoute element={<Layout><Mascotas /></Layout>} />} />
              <Route path="/citas" element={<PrivateRoute element={<Layout><Citas /></Layout>} />} />
              <Route path="/facturas" element={<PrivateRoute element={<Layout><Facturas /></Layout>} />} />
              <Route 
                path="/usuarios-clientes" 
                element={<PrivateRoute element={<Layout><UsuariosClientes /></Layout>} requiredRole="ADMIN" />} 
              />
              <Route 
                path="/servicios-productos" 
                element={<PrivateRoute element={<Layout><ServiciosProductos /></Layout>} requiredRole="ADMIN" />} 
              />
              <Route 
                path="/panel-admin" 
                element={<PrivateRoute element={<Layout><PanelAdmin /></Layout>} requiredRole="ADMIN" />} 
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
            <StatusIndicator />
          </AppInitializer>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
