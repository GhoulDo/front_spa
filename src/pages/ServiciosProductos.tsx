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
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/apiConfig';

interface Servicio {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
}

interface Producto {
  id: string;
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
}

const ServiciosProductos: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Servicio | Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    precio: '',
    duracion: '',
    stock: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchServicios();
    fetchProductos();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await api.get('/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los servicios',
        severity: 'error',
      });
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar los productos',
        severity: 'error',
      });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (item?: Servicio | Producto) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nombre: item.nombre,
        tipo: 'tipo' in item ? item.tipo : '',
        precio: item.precio.toString(),
        duracion: 'duracion' in item ? item.duracion.toString() : '',
        stock: 'stock' in item ? item.stock.toString() : '',
      });
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '',
        tipo: '',
        precio: '',
        duracion: '',
        stock: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      nombre: '',
      tipo: '',
      precio: '',
      duracion: '',
      stock: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tabValue === 0) { // Servicios
        const servicioData = {
          nombre: formData.nombre,
          duracion: parseInt(formData.duracion),
          precio: parseFloat(formData.precio),
        };

        if (editingItem) {
          await api.put(`/servicios/${editingItem.id}`, servicioData);
          setSnackbar({
            open: true,
            message: 'Servicio actualizado correctamente',
            severity: 'success',
          });
        } else {
          await api.post('/servicios', servicioData);
          setSnackbar({
            open: true,
            message: 'Servicio creado correctamente',
            severity: 'success',
          });
        }
        fetchServicios();
      } else { // Productos
        const productoData = {
          nombre: formData.nombre,
          tipo: formData.tipo,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
        };

        if (editingItem) {
          await api.put(`/productos/${editingItem.id}`, productoData);
          setSnackbar({
            open: true,
            message: 'Producto actualizado correctamente',
            severity: 'success',
          });
        } else {
          await api.post('/productos', productoData);
          setSnackbar({
            open: true,
            message: 'Producto creado correctamente',
            severity: 'success',
          });
        }
        fetchProductos();
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

  const handleDelete = async (id: string, isServicio: boolean) => {
    try {
      if (isServicio) {
        await api.delete(`/servicios/${id}`);
        setSnackbar({
          open: true,
          message: 'Servicio eliminado correctamente',
          severity: 'success',
        });
        fetchServicios();
      } else {
        await api.delete(`/productos/${id}`);
        setSnackbar({
          open: true,
          message: 'Producto eliminado correctamente',
          severity: 'success',
        });
        fetchProductos();
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
        <Typography variant="h4">Servicios y Productos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          {tabValue === 0 ? 'Nuevo Servicio' : 'Nuevo Producto'}
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Servicios" />
        <Tab label="Productos" />
      </Tabs>

      {tabValue === 0 ? (
        <Grid container spacing={3}>
          {servicios.map((servicio) => (
            <Grid item xs={12} sm={6} md={4} key={servicio.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{servicio.nombre}</Typography>
                  <Typography color="textSecondary">
                    Duración: {servicio.duracion} minutos
                  </Typography>
                  <Typography>
                    Precio: {servicio.precio}€
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenDialog(servicio)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDelete(servicio.id, true)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {productos.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{producto.nombre}</Typography>
                  <Typography color="textSecondary">
                    Tipo: {producto.tipo}
                  </Typography>
                  <Typography>
                    Precio: {producto.precio}€
                  </Typography>
                  <Typography>
                    Stock: {producto.stock}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenDialog(producto)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDelete(producto.id, false)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Editar' : 'Nuevo'} {tabValue === 0 ? 'Servicio' : 'Producto'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            {tabValue === 1 && (
              <TextField
                fullWidth
                margin="normal"
                label="Tipo"
                name="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                required
              />
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            {tabValue === 0 ? (
              <TextField
                fullWidth
                margin="normal"
                label="Duración (minutos)"
                name="duracion"
                type="number"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                required
                inputProps={{ min: 0 }}
              />
            ) : (
              <TextField
                fullWidth
                margin="normal"
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                inputProps={{ min: 0 }}
              />
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

export default ServiciosProductos;