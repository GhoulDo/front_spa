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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../api/apiConfig';

interface Cita {
  id: string;
  mascota: {
    id: string;
    nombre: string;
  };
  servicio: {
    id: string;
    nombre: string;
  };
  fecha: string;
  hora: string;
  estado: string;
  notas: string;
}

interface Mascota {
  id: string;
  nombre: string;
}

interface Servicio {
  id: string;
  nombre: string;
  duracion: number;
  precio: number;
}

const Citas: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCita, setEditingCita] = useState<Cita | null>(null);
  const [formData, setFormData] = useState({
    mascotaId: '',
    servicioId: '',
    fecha: null as Date | null,
    hora: null as Date | null,
    notas: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchCitas();
    fetchMascotas();
    fetchServicios();
  }, []);

  const fetchCitas = async () => {
    try {
      const response = await api.get('/api/citas');
      setCitas(response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar las citas',
        severity: 'error',
      });
    }
  };

  const fetchMascotas = async () => {
    try {
      const response = await api.get('/api/mascotas');
      setMascotas(response.data);
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await api.get('/api/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleOpenDialog = (cita?: Cita) => {
    if (cita) {
      setEditingCita(cita);
      setFormData({
        mascotaId: cita.mascota.id,
        servicioId: cita.servicio.id,
        fecha: new Date(cita.fecha),
        hora: new Date(`2000-01-01T${cita.hora}`),
        notas: cita.notas || '',
      });
    } else {
      setEditingCita(null);
      setFormData({
        mascotaId: '',
        servicioId: '',
        fecha: null,
        hora: null,
        notas: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCita(null);
    setFormData({
      mascotaId: '',
      servicioId: '',
      fecha: null,
      hora: null,
      notas: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const citaData = {
        mascota: {
          id: formData.mascotaId
        },
        servicio: {
          id: formData.servicioId
        },
        fecha: formData.fecha?.toISOString().split('T')[0],
        hora: formData.hora?.toTimeString().split(' ')[0],
        notas: formData.notas,
        estado: 'PENDIENTE'
      };

      if (editingCita) {
        await api.put(`/api/citas/${editingCita.id}`, citaData);
        setSnackbar({
          open: true,
          message: 'Cita actualizada correctamente',
          severity: 'success',
        });
      } else {
        await api.post('/api/citas', citaData);
        setSnackbar({
          open: true,
          message: 'Cita creada correctamente',
          severity: 'success',
        });
      }
      fetchCitas();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar cita:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar la cita',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/citas/${id}`);
      setSnackbar({
        open: true,
        message: 'Cita eliminada correctamente',
        severity: 'success',
      });
      fetchCitas();
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la cita',
        severity: 'error',
      });
    }
  };

  const handleCancelarCita = async (id: string) => {
    try {
      await api.put(`/api/citas/${id}`, { estado: 'CANCELADA' });
      setSnackbar({
        open: true,
        message: 'Cita cancelada correctamente',
        severity: 'success',
      });
      fetchCitas();
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      setSnackbar({
        open: true,
        message: 'Error al cancelar la cita',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Citas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Cita
        </Button>
      </Box>

      <Grid container spacing={3}>
        {citas.map((cita) => (
          <Grid item xs={12} sm={6} md={4} key={cita.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{cita.mascota.nombre}</Typography>
                <Typography color="textSecondary">
                  Servicio: {cita.servicio.nombre}
                </Typography>
                <Typography>
                  Fecha: {new Date(cita.fecha).toLocaleDateString()}
                </Typography>
                <Typography>
                  Hora: {cita.hora}
                </Typography>
                <Typography>
                  Estado: {cita.estado}
                </Typography>
                {cita.notas && (
                  <Typography>
                    Notas: {cita.notas}
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <IconButton 
                    color="primary"
                    onClick={() => handleOpenDialog(cita)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(cita.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {cita.estado === 'PENDIENTE' && (
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => handleCancelarCita(cita.id)}
                    >
                      Cancelar
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCita ? 'Editar Cita' : 'Nueva Cita'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Mascota</InputLabel>
              <Select
                value={formData.mascotaId}
                onChange={(e) => setFormData({ ...formData, mascotaId: e.target.value })}
                label="Mascota"
              >
                {mascotas.map((mascota) => (
                  <MenuItem key={mascota.id} value={mascota.id}>
                    {mascota.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Servicio</InputLabel>
              <Select
                value={formData.servicioId}
                onChange={(e) => setFormData({ ...formData, servicioId: e.target.value })}
                label="Servicio"
              >
                {servicios.map((servicio) => (
                  <MenuItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre} - {servicio.precio}€
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha"
                value={formData.fecha}
                onChange={(newValue) => setFormData({ ...formData, fecha: newValue })}
                sx={{ width: '100%', mt: 2 }}
              />
              <TimePicker
                label="Hora"
                value={formData.hora}
                onChange={(newValue) => setFormData({ ...formData, hora: newValue })}
                sx={{ width: '100%', mt: 2 }}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              margin="normal"
              label="Notas"
              multiline
              rows={4}
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingCita ? 'Actualizar' : 'Crear'}
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

export default Citas;