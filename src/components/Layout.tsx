import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  AppBar,
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Collapse,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Pets as PetsIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  ExpandLess,
  ExpandMore,
  Spa as SpaIcon,
  Home as HomeIcon,
  ShowChart as ChartIcon,
  AdminPanelSettings as AdminIcon,
  Inventory2 as InventoryIcon
} from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

// Define tipos para RootState
interface RootState {
  auth: {
    user: {
      username: string;
      rol: string;
    } | null;
  };
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isSmallScreen);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  
  // Definir colores personalizados
  const colors = {
    primary: '#8d6e63',         // Marrón cálido
    secondary: '#66bb6a',       // Verde fresco
    accent: '#ffb74d',         // Naranja suave
    light: '#f8f9fa',          // Fondo claro
    dark: '#37474f',           // Texto oscuro
    drawer: '#ffffff',         // Fondo del drawer
    drawerText: '#333333',      // Texto del drawer
  };
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleAdminMenuToggle = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  // Estilo del drawer cuando está abierto
  const drawerWidth = 280;
  
  const closeDrawerIfMobile = () => {
    if (isSmallScreen) {
      setDrawerOpen(false);
    }
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon sx={{ color: colors.primary }} />, path: '/dashboard' },
    { text: 'Mis Mascotas', icon: <PetsIcon sx={{ color: colors.primary }} />, path: '/mascotas' },
    { text: 'Agendar Citas', icon: <CalendarIcon sx={{ color: colors.primary }} />, path: '/citas' },
    { text: 'Mis Facturas', icon: <ReceiptIcon sx={{ color: colors.primary }} />, path: '/facturas' }
  ];
  
  const adminMenuItems = [
    { text: 'Usuarios y Clientes', icon: <GroupIcon sx={{ color: '#e57373' }} />, path: '/usuarios-clientes' },
    { text: 'Panel de Control', icon: <ChartIcon sx={{ color: '#64b5f6' }} />, path: '/panel-admin' },
    { text: 'Servicios y Productos', icon: <InventoryIcon sx={{ color: '#81c784' }} />, path: '/servicios-productos' }
  ];
  
  const isAdmin = user?.rol === 'ADMIN';

  return (
    <Box sx={{ display: 'flex', bgcolor: colors.light, minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: colors.primary,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${theme.palette.primary.dark} 100%)`
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpaIcon sx={{ fontSize: 28, color: 'white' }} />
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                PetSPA
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAdmin && (
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 5,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Administrador
              </Typography>
            )}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar 
                sx={{ 
                  bgcolor: colors.accent, 
                  width: 36, 
                  height: 36, 
                  boxShadow: '0 3px 5px rgba(0,0,0,0.2)' 
                }}
              >
                {user?.username.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  borderRadius: 2
                }
              }}
            >
              <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    bgcolor: colors.primary, 
                    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                    mx: 'auto',
                    mb: 1
                  }}
                >
                  {user?.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user?.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                <ListItemIcon>
                  <ProfileIcon fontSize="small" />
                </ListItemIcon>
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isSmallScreen ? "temporary" : "persistent"}
        open={drawerOpen}
        onClose={isSmallScreen ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            bgcolor: colors.drawer,
            color: colors.drawerText,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isSmallScreen ? '5px 0 15px rgba(0, 0, 0, 0.1)' : 'none',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', px: 2, py: 2 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600, 
              color: 'text.secondary',
              ml: 2,
              mb: 1,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: 0.5
            }}
          >
            MENÚ PRINCIPAL
          </Typography>
          <List sx={{ pt: 0 }}>
            {menuItems.map((item) => (
              <ListItemButton 
                key={item.text} 
                component={RouterLink} 
                to={item.path}
                onClick={closeDrawerIfMobile}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.active, &:hover': {
                    bgcolor: 'rgba(141, 110, 99, 0.08)', // Version clara del color primario
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem', 
                    fontWeight: 500 
                  }} 
                />
              </ListItemButton>
            ))}
          </List>
          
          {isAdmin && (
            <>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.secondary',
                  ml: 2,
                  mb: 1,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: 0.5
                }}
              >
                ADMINISTRACIÓN
              </Typography>
              <List sx={{ pt: 0 }}>
                <ListItemButton 
                  onClick={handleAdminMenuToggle}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&.active, &:hover': {
                      bgcolor: 'rgba(141, 110, 99, 0.08)',
                    }
                  }}
                >
                  <ListItemIcon>
                    <AdminIcon sx={{ color: '#9575cd' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Panel Administrativo" 
                    primaryTypographyProps={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 500 
                    }} 
                  />
                  {adminMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={adminMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {adminMenuItems.map((item) => (
                      <ListItemButton 
                        key={item.text} 
                        component={RouterLink} 
                        to={item.path}
                        onClick={closeDrawerIfMobile}
                        sx={{ 
                          pl: 4, 
                          py: 0.8,
                          borderRadius: 2,
                          ml: 2,
                          mb: 0.5,
                          '&.active, &:hover': {
                            bgcolor: 'rgba(141, 110, 99, 0.08)',
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                        <ListItemText 
                          primary={item.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.9rem', 
                            fontWeight: 500 
                          }} 
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </List>
            </>
          )}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;