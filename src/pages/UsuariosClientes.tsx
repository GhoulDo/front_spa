import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/apiConfig';

interface Usuario {
  id: string;
  username: string;
  email: string;
  rol: string;
}

interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  usuario: {
    id: string;
  };
}

const UsuariosClientes: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Usuario | Cliente | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rol: 'CLIENTE',
    nombre: '',
    telefono: '',
    direccion: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchUsuarios();
    fetchClientes();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los usuarios',
        severity: 'error',
      });
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los clientes',
        severity: 'error',
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (item?: Usuario | Cliente) => {
    if (item) {
      setEditingItem(item);
      if ('username' in item) {
        setFormData({
          username: item.username,
          email: item.email,
          password: '',
          rol: item.rol,
          nombre: '',
          telefono: '',
          direccion: '',
        });
      } else {
        setFormData({
          username: '',
          email: item.email,
          password: '',
          rol: 'CLIENTE',
          nombre: item.nombre,
          telefono: item.telefono,
          direccion: item.direccion,
        });
      }
    } else {
      setEditingItem(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        rol: 'CLIENTE',
        nombre: '',
        telefono: '',
        direccion: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      rol: 'CLIENTE',
      nombre: '',
      telefono: '',
      direccion: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tabValue === 0) { // Usuarios
        if (editingItem) {
          await api.put(`/usuarios/${editingItem.id}`, {
            username: formData.username,
            email: formData.email,
            rol: formData.rol,
          });
          setSnackbar({
            open: true,
            message: 'Usuario actualizado correctamente',
            severity: 'success',
          });
        } else {
          await api.post('/auth/register', {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            rol: formData.rol,
          });
          setSnackbar({
            open: true,
            message: 'Usuario creado correctamente',
            severity: 'success',
          });
        }
        fetchUsuarios();
      } else { // Clientes
        if (editingItem) {
          await api.put(`/clientes/${editingItem.id}`, {
            nombre: formData.nombre,
            telefono: formData.telefono,
            email: formData.email,
            direccion: formData.direccion,
          });
          setSnackbar({
            open: true,
            message: 'Cliente actualizado correctamente',
            severity: 'success',
          });
        } else {
          await api.post('/clientes', {
            nombre: formData.nombre,
            telefono: formData.telefono,
            email: formData.email,
            direccion: formData.direccion,
          });
          setSnackbar({
            open: true,
            message: 'Cliente creado correctamente',
            severity: 'success',
          });
        }
        fetchClientes();
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: string, isUsuario: boolean) => {
    try {
      if (isUsuario) {
        await api.delete(`/usuarios/${id}`);
        setSnackbar({
          open: true,
          message: 'Usuario eliminado correctamente',
          severity: 'success',
        });
        fetchUsuarios();
      } else {
        await api.delete(`/clientes/${id}`);
        setSnackbar({
          open: true,
          message: 'Cliente eliminado correctamente',
          severity: 'success',
        });
        fetchClientes();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestión de Usuarios y Clientes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {tabValue === 0 ? 'Nuevo Usuario' : 'Nuevo Cliente'}
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Usuarios" />
        <Tab label="Clientes" />
      </Tabs>

      {tabValue === 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.username}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.rol}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenDialog(usuario)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDelete(usuario.id, true)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.direccion}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenDialog(cliente)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDelete(cliente.id, false)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Editar' : 'Nuevo'} {tabValue === 0 ? 'Usuario' : 'Cliente'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {tabValue === 0 ? (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                {!editingItem && (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                )}
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Rol"
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  required
                >
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                  <MenuItem value="CLIENTE">Cliente</MenuItem>
                </TextField>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingItem ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsuariosClientes; 