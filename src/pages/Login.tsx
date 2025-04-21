import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  Link,
  Avatar,
  ThemeProvider,
  createTheme,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import api, { setAuthToken } from '../api/apiConfig';
import { Person as PersonIcon, Lock as LockIcon, Pets as PetsIcon } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    rol: 'ADMIN' | 'CLIENTE';
  };
}

const validationSchema = Yup.object({
  username: Yup.string().required('El usuario es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
});

// Tema personalizado para el Login
const petTheme = createTheme({
  palette: {
    primary: {
      main: '#8d6e63', // Marrón pardo como color principal
      light: '#be9c91',
      dark: '#5f4339',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#66bb6a', // Verde para acentos
      light: '#98ee99',
      dark: '#338a3e',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#5f4339',
    },
    subtitle1: {
      fontSize: '1.2rem',
      color: '#6d4c41',
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0px 4px 7px rgba(0, 0, 0, 0.1)',
          padding: '10px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(45deg, #8d6e63 30%, #a1887f 90%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '10px 0',
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        const loginData = {
          email: values.username,
          password: values.password,
        };
        
        console.log('Enviando solicitud de login a la API');
        
        // Hacer la solicitud de login a la API
        const response = await api.post('/api/auth/login', loginData);
        
        console.log('Respuesta de login recibida:', response.data);
        
        // Verificar si el token está presente en la respuesta
        if (response.data && response.data.token) {
          // Guardar el token y configurarlo para futuras peticiones
          setAuthToken(response.data.token);
          
          // Extraer información del usuario desde el token o respuesta
          const user = {
            id: response.data.userId || '1',
            username: values.username,
            email: values.username,
            rol: response.data.rol || 'CLIENTE',
          };
          
          // Guardar en Redux
          dispatch(setCredentials({ 
            token: response.data.token, 
            user 
          }));
          
          console.log('Login exitoso, redirigiendo al dashboard');
          navigate('/dashboard');
        } else {
          setError('Formato de respuesta inesperado. No se recibió token de autenticación.');
        }
      } catch (error: any) {
        console.error('Error durante el login:', error);
        
        // Mostrar mensaje de error adecuado
        const errorMessage = error.response?.data?.message || 
                            'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <ThemeProvider theme={petTheme}>
      <Box 
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
          py: 5,
          backgroundImage: 'url("https://img.freepik.com/free-vector/dog-paw-seamless-pattern-background_42349-638.jpg")',
          backgroundSize: '300px',
          backgroundBlendMode: 'overlay',
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={3} alignItems="stretch">
            {/* Columna izquierda - Imagen y mensaje */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 4, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#8d6e63',
                  borderRadius: '15px 0 0 15px',
                }}
              >
                <Box 
                  component="img"
                  sx={{
                    width: '80%',
                    maxWidth: '300px',
                    mb: 3,
                  }}
                  src="https://img.freepik.com/free-vector/cute-dog-getting-bath-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4181.jpg"
                  alt="Mascota en SPA"
                />
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
                  ¡Bienvenido a PetSPA!
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#f5f5f5', textAlign: 'center' }}>
                  El mejor lugar para consentir a tu mascota
                </Typography>
              </Paper>
            </Grid>
            
            {/* Columna derecha - Formulario de login */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 4, 
                  borderRadius: { md: '0 15px 15px 0', xs: '15px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Avatar 
                  sx={{ 
                    m: 1, 
                    bgcolor: 'secondary.main',
                    width: 60,
                    height: 60,
                  }}
                >
                  <PetsIcon sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Iniciar Sesión
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                    {error}
                  </Alert>
                )}
                
                <Box
                  component="form"
                  onSubmit={formik.handleSubmit}
                  sx={{ width: '100%' }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Usuario"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={formik.isSubmitting || loading}
                    sx={{ 
                      mt: 4, 
                      mb: 2,
                      minHeight: '50px',
                      fontSize: '1.1rem',
                    }}
                  >
                    {loading ? 'Iniciando...' : 'Ingresar'}
                  </Button>
                  
                  <Grid container justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item>
                      <Link 
                        component={RouterLink} 
                        to="/register" 
                        variant="body2" 
                        sx={{ color: 'primary.dark', fontWeight: '500' }}
                      >
                        ¿No tienes cuenta? Regístrate aquí
                      </Link>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                      PetSPA © {new Date().getFullYear()} - Todos los derechos reservados
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                      <PetsIcon fontSize="small" sx={{ color: 'primary.main' }} />
                      <PetsIcon fontSize="small" sx={{ color: 'primary.main' }} />
                      <PetsIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;