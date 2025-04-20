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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../api/apiConfig';
import { useAuth } from '../context/AuthContext';

interface Mascota {
  id: string;
  nombre: string;
  tipo: string;
  raza: string;
  edad: number;
  cliente: {
    id: string;
    nombre: string;
  };
}

const Mascotas: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMascota, setEditingMascota] = useState<Mascota | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    raza: '',
    edad: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const { state: { user } } = useAuth();

  useEffect(() => {
    fetchMascotas();
  }, []);

  const fetchMascotas = async () => {
    try {
      const response = await api.get('/mascotas');
      setMascotas(response.data);
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar las mascotas',
        severity: 'error',
      });
    }
  };

  const handleOpenDialog = (mascota?: Mascota) => {
    if (mascota) {
      setEditingMascota(mascota);
      setFormData({
        nombre: mascota.nombre,
        tipo: mascota.tipo,
        raza: mascota.raza,
        edad: mascota.edad.toString(),
      });
    } else {
      setEditingMascota(null);
      setFormData({
        nombre: '',
        tipo: '',
        raza: '',
        edad: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMascota(null);
    setFormData({
      nombre: '',
      tipo: '',
      raza: '',
      edad: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mascotaData = {
        ...formData,
        edad: parseInt(formData.edad),
        cliente: {
          id: user?.id || '' // Obtener el ID del usuario actual desde el contexto de autenticación
        }
      };

      if (editingMascota) {
        await api.put(`/mascotas/${editingMascota.id}`, mascotaData);
        setSnackbar({
          open: true,
          message: 'Mascota actualizada correctamente',
          severity: 'success',
        });
      } else {
        await api.post('/mascotas', mascotaData);
        setSnackbar({
          open: true,
          message: 'Mascota creada correctamente',
          severity: 'success',
        });
      }
      fetchMascotas();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar mascota:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar la mascota',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/mascotas/${id}`);
      setSnackbar({
        open: true,
        message: 'Mascota eliminada correctamente',
        severity: 'success',
      });
      fetchMascotas();
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la mascota',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Mascotas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Agregar Mascota
        </Button>
      </Box>

      <Grid container spacing={3}>
        {mascotas.map((mascota) => (
          <Grid item xs={12} sm={6} md={4} key={mascota.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{mascota.nombre}</Typography>
                <Typography color="textSecondary">
                  {mascota.tipo} - {mascota.raza}
                </Typography>
                <Typography>Edad: {mascota.edad} años</Typography>
                <Typography>Dueño: {mascota.cliente.nombre}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <IconButton 
                    color="primary"
                    onClick={() => handleOpenDialog(mascota)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(mascota.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingMascota ? 'Editar Mascota' : 'Agregar Nueva Mascota'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              margin="normal"
              required
            >
              <MenuItem value="Perro">Perro</MenuItem>
              <MenuItem value="Gato">Gato</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Raza"
              name="raza"
              value={formData.raza}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleInputChange}
              margin="normal"
              required
              inputProps={{ min: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingMascota ? 'Actualizar' : 'Guardar'}
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

export default Mascotas;