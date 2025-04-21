import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  CardActionArea,
  CardMedia,
  Divider,
  Paper,
  Avatar,
  CircularProgress,
  useTheme,
  Fade,
  Grow,
} from '@mui/material';
import {
  Pets as PetsIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  AccountCircle as ProfileIcon,
  AdminPanelSettings as AdminIcon,
  AttachMoney as MoneyIcon,
  Spa as SpaIcon,
  Inventory2 as InventoryIcon
} from '@mui/icons-material';
import api from '../api/apiConfig';

interface DashboardStats {
  totalMascotas: number;
  citasPendientes: number;
  ultimasFacturas: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { state: { user } } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMascotas: 0,
    citasPendientes: 0,
    ultimasFacturas: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const colors = {
    primary: '#8d6e63',
    secondary: '#66bb6a',
    accent1: '#ffb74d',
    accent2: '#64b5f6',
    accent3: '#ba68c8',
    accent4: '#4db6ac',
    light: '#f8f9fa',
    dark: '#37474f',
  };
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Verificar que haya un token disponible
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
          setLoading(false);
          return;
        }
        
        let totalMascotas = 0;
        let citasPendientes = 0;
        let ultimasFacturas = 0;
        
        try {
          // Obtener mascotas
          console.log('Solicitando mascotas para el dashboard');
          const mascotasResponse = await api.get('/api/mascotas');
          totalMascotas = mascotasResponse.data.length || 0;
          
          // Obtener citas pendientes
          console.log('Solicitando citas pendientes');
          const citasResponse = await api.get('/api/citas', {
            params: { estado: 'PENDIENTE' }
          });
          citasPendientes = citasResponse.data.length || 0;
          
          // Obtener facturas
          console.log('Solicitando facturas');
          const facturasResponse = await api.get('/api/facturas');
          ultimasFacturas = facturasResponse.data.length || 0;
        } catch (error) {
          console.error('Error al obtener datos para el dashboard:', error);
        }
        
        // Establecer los datos en el estado
        setTimeout(() => {
          setStats({
            totalMascotas,
            citasPendientes,
            ultimasFacturas
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error global en dashboard:', error);
        setError('Error al cargar los datos. Intenta nuevamente.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getUserDisplayName = () => {
    if (!user) return 'Cliente';
    return user.username || 'Cliente';
  };

  const getUserInitial = () => {
    if (!user) return 'U';
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  const isAdmin = user?.rol === 'ADMIN';

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{ 
          background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.light} 100%)`,
        }}
      >
        <CircularProgress size={60} sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{ background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.light} 100%)` }}
      >
        <Typography color="error" variant="h5">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.light} 100%)`,
        minHeight: '100vh',
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        <Fade in={!loading} timeout={1000}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              mb: 4, 
              borderRadius: 3, 
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              overflow: 'hidden',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '40%',
                height: '100%',
                backgroundImage: `url("https://img.freepik.com/free-vector/cute-dog-cat-friend-cartoon_138676-2432.jpg?w=826&t=st=1709097192~exp=1709097792~hmac=c6b4a4db04c8d5be3a034de0361cb21dccfeb65fd106b5a7ede95e4ea4233642")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center right',
                opacity: 0.2,
                borderRadius: '0 15px 15px 0',
                display: { xs: 'none', md: 'block' }
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              zIndex: 2,
              position: 'relative'
            }}>
              <Avatar 
                sx={{ 
                  width: { xs: 60, md: 80 }, 
                  height: { xs: 60, md: 80 }, 
                  bgcolor: 'white',
                  color: colors.primary,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                {getUserInitial()}
              </Avatar>
              <Box>
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  ¡Hola, {getUserDisplayName()}!
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SpaIcon fontSize="small" />
                  Bienvenido/a a tu portal de gestión de {isAdmin ? 'administración' : 'mascotas'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
        
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              color: colors.dark,
              position: 'relative',
              display: 'inline-block',
              pb: 1,
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '60%',
                height: '3px',
                backgroundColor: colors.accent1,
                borderRadius: '3px'
              }
            }}
          >
            Accesos Rápidos
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              color: 'text.secondary',
              maxWidth: '700px'
            }}
          >
            Gestiona tus mascotas, citas y facturas con facilidad. Nuestro sistema te permite tener todo bajo control en un solo lugar.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grow in={!loading} timeout={600}>
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  overflow: 'hidden'
                }}
              >
                <CardActionArea 
                  component={RouterLink} 
                  to="/mascotas"
                  sx={{ height: '100%' }}
                >
                  <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <CardMedia 
                      component="img"
                      height="180"
                      image="https://img.freepik.com/free-photo/front-view-cute-dog-with-copy-space_23-2148326219.jpg?w=826&t=st=1709097354~exp=1709097954~hmac=628b97b8f56bc10d23c988cdf208e8f15785d5a0d20f43d2a58163f7be36ca77"
                      alt="Mascotas"
                      sx={{ 
                        transition: 'all 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
                      }} 
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        width: '100%', 
                        p: 2,
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        component="div" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 600,
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        Mis Mascotas
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ position: 'relative', pt: 2, pb: 3 }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: -20, 
                        right: 20, 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        bgcolor: stats.totalMascotas > 0 ? colors.accent1 : colors.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      {stats.totalMascotas}
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <PetsIcon fontSize="small" color="primary" />
                      {stats.totalMascotas > 0 
                        ? `Tienes ${stats.totalMascotas} mascota${stats.totalMascotas !== 1 ? 's' : ''} registrada${stats.totalMascotas !== 1 ? 's' : ''}`
                        : 'Registra tu primera mascota'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grow>
          
          <Grow in={!loading} timeout={800}>
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  overflow: 'hidden'
                }}
              >
                <CardActionArea 
                  component={RouterLink} 
                  to="/citas"
                  sx={{ height: '100%' }}
                >
                  <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <CardMedia 
                      component="img"
                      height="180"
                      image="https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?w=826&t=st=1709097435~exp=1709098035~hmac=67e10fc04dbda2abe8ffee71bc427e6d4c0261b6619c10d32a066ed89737f7db"
                      alt="Citas"
                      sx={{ 
                        transition: 'all 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
                      }} 
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        width: '100%', 
                        p: 2,
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        component="div" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 600,
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        Agendar Cita
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ position: 'relative', pt: 2, pb: 3 }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: -20, 
                        right: 20, 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        bgcolor: stats.citasPendientes > 0 ? colors.accent2 : colors.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      {stats.citasPendientes}
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <CalendarIcon fontSize="small" color="primary" />
                      {stats.citasPendientes > 0 
                        ? `Tienes ${stats.citasPendientes} cita${stats.citasPendientes !== 1 ? 's' : ''} pendiente${stats.citasPendientes !== 1 ? 's' : ''}`
                        : 'Agenda una nueva cita'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grow>
          
          <Grow in={!loading} timeout={1000}>
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  overflow: 'hidden'
                }}
              >
                <CardActionArea 
                  component={RouterLink} 
                  to="/facturas"
                  sx={{ height: '100%' }}
                >
                  <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <CardMedia 
                      component="img"
                      height="180"
                      image="https://img.freepik.com/free-photo/dog-cat-vet_87557-10649.jpg?w=826&t=st=1709097488~exp=1709098088~hmac=997262e1ac06e9359c4505c2470fc886a42a3e5ebd744531429d5e9afcd5eeaa"
                      alt="Facturas"
                      sx={{ 
                        transition: 'all 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%',
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
                      }} 
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        width: '100%', 
                        p: 2,
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        component="div" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 600,
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        Mis Facturas
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ position: 'relative', pt: 2, pb: 3 }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: -20, 
                        right: 20, 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%',
                        bgcolor: stats.ultimasFacturas > 0 ? colors.accent3 : colors.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      {stats.ultimasFacturas}
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <ReceiptIcon fontSize="small" color="primary" />
                      {stats.ultimasFacturas > 0 
                        ? `Tienes ${stats.ultimasFacturas} factura${stats.ultimasFacturas !== 1 ? 's' : ''} reciente${stats.ultimasFacturas !== 1 ? 's' : ''}`
                        : 'Ver historial de facturas'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grow>
        </Grid>
        
        {isAdmin && (
          <>
            <Divider sx={{ my: 5, borderColor: 'rgba(0, 0, 0, 0.1)' }} />
            
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600, 
                  color: colors.dark,
                  position: 'relative',
                  display: 'inline-block',
                  pb: 1,
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '60%',
                    height: '3px',
                    backgroundColor: colors.accent4,
                    borderRadius: '3px'
                  }
                }}
              >
                Herramientas de Administración
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3, 
                  color: 'text.secondary',
                  maxWidth: '700px'
                }}
              >
                Gestiona todos los aspectos del negocio, desde usuarios y servicios hasta reportes financieros.
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grow in={!loading} timeout={1200}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                      overflow: 'hidden'
                    }}
                  >
                    <CardActionArea 
                      component={RouterLink} 
                      to="/usuarios-clientes"
                      sx={{ height: '100%' }}
                    >
                      <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                        <CardMedia 
                          component="img"
                          height="180"
                          image="https://img.freepik.com/free-photo/young-woman-with-her-dog-park_23-2148923013.jpg?w=826&t=st=1709097555~exp=1709098155~hmac=44b3ec5b92987af3febf36b3923782b176d9af9c8143e5f0bcf6abe9a572fa60"
                          alt="Usuarios y Clientes"
                          sx={{ 
                            transition: 'all 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%',
                            background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)',
                          }} 
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            width: '100%', 
                            p: 2,
                          }}
                        >
                          <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                              color: 'white', 
                              fontWeight: 600,
                              textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                            }}
                          >
                            Usuarios y Clientes
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <ProfileIcon fontSize="small" sx={{ color: colors.accent1 }} />
                          Gestiona los usuarios y clientes de la plataforma
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grow>
              
              <Grow in={!loading} timeout={1400}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                      overflow: 'hidden'
                    }}
                  >
                    <CardActionArea 
                      component={RouterLink} 
                      to="/panel-admin"
                      sx={{ height: '100%' }}
                    >
                      <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                        <CardMedia 
                          component="img"
                          height="180"
                          image="https://img.freepik.com/free-vector/business-team-putting-together-jigsaw-puzzle-isolated-flat-vector-illustration-cartoon-partners-working-connection-teamwork-partnership-cooperation-concept_74855-9814.jpg?w=740&t=st=1709097606~exp=1709098206~hmac=48a3a1e9c9eebbba3b2683dacbf7d9a0743d56f0b3004fd28301c8c5bd01790f"
                          alt="Panel de Control"
                          sx={{ 
                            transition: 'all 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%',
                            background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)',
                          }} 
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            width: '100%', 
                            p: 2,
                          }}
                        >
                          <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                              color: 'white', 
                              fontWeight: 600,
                              textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                            }}
                          >
                            Panel de Control
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <AdminIcon fontSize="small" sx={{ color: colors.accent2 }} />
                          Visualiza estadísticas y reportes del negocio
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grow>
              
              <Grow in={!loading} timeout={1600}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                      overflow: 'hidden'
                    }}
                  >
                    <CardActionArea 
                      component={RouterLink} 
                      to="/servicios-productos"
                      sx={{ height: '100%' }}
                    >
                      <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                        <CardMedia 
                          component="img"
                          height="180"
                          image="https://img.freepik.com/free-photo/assortment-care-items-pets_23-2148873221.jpg?w=826&t=st=1709097656~exp=1709098256~hmac=50d4fc4960714842ce782c3209499f7ca546a2872789e5093aeb9eb3e3e32616"
                          alt="Servicios y Productos"
                          sx={{ 
                            transition: 'all 0.5s ease',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%',
                            background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)',
                          }} 
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            width: '100%', 
                            p: 2,
                          }}
                        >
                          <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                              color: 'white', 
                              fontWeight: 600,
                              textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                            }}
                          >
                            Servicios y Productos
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <InventoryIcon fontSize="small" sx={{ color: colors.accent3 }} />
                          Gestiona el catálogo de servicios y productos
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grow>
            </Grid>
          </>
        )}
        
        <Box 
          sx={{ 
            mt: 6,
            p: 3,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Typography 
            variant="h6" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              color: colors.primary
            }}
          >
            PetSPA - El mejor cuidado para tus mascotas
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Ofrecemos servicios de alta calidad para el cuidado y bienestar de tus mascotas.
            Nuestros profesionales están especializados en diferentes tratamientos que harán que tu mascota
            luzca y se sienta mejor.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;