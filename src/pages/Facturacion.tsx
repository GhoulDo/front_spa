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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import api from '../api/apiConfig';

interface Factura {
  id: string;
  cliente: {
    id: string;
    nombre: string;
  };
  fecha: string;
  total: number;
  estado: string;
  detalles: DetalleFactura[];
}

interface DetalleFactura {
  id: string;
  productoId?: string;
  productoNombre?: string;
  servicioId?: string;
  servicioNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Cliente {
  id: string;
  nombre: string;
}

interface Producto {
  id: string;
  nombre: string;
  precio: number;
}

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
}

const Facturacion: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    fecha: new Date().toISOString().split('T')[0],
    detalles: [] as Array<{
      tipo: 'PRODUCTO' | 'SERVICIO';
      itemId: string;
      cantidad: number;
    }>,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchFacturas();
    fetchClientes();
    fetchProductos();
    fetchServicios();
  }, []);

  const fetchFacturas = async () => {
    try {
      const response = await api.get('/facturas');
      setFacturas(response.data);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar las facturas',
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
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await api.get('/servicios');
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleOpenDialog = (factura?: Factura) => {
    if (factura) {
      setEditingFactura(factura);
      setFormData({
        clienteId: factura.cliente.id,
        fecha: factura.fecha,
        detalles: factura.detalles.map(detalle => ({
          tipo: detalle.productoId ? 'PRODUCTO' : 'SERVICIO',
          itemId: detalle.productoId || detalle.servicioId || '',
          cantidad: detalle.cantidad,
        })),
      });
    } else {
      setEditingFactura(null);
      setFormData({
        clienteId: '',
        fecha: new Date().toISOString().split('T')[0],
        detalles: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFactura(null);
    setFormData({
      clienteId: '',
      fecha: new Date().toISOString().split('T')[0],
      detalles: [],
    });
  };

  const handleAddDetalle = () => {
    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, { tipo: 'PRODUCTO', itemId: '', cantidad: 1 }],
    }));
  };

  const handleRemoveDetalle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
  };

  const handleDetalleChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.map((detalle, i) => 
        i === index ? { ...detalle, [field]: value } : detalle
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const facturaData = {
        cliente: {
          id: formData.clienteId
        },
        fecha: formData.fecha,
        detalles: formData.detalles.map(detalle => ({
          tipo: detalle.tipo,
          itemId: detalle.itemId,
          cantidad: detalle.cantidad,
        })),
      };

      if (editingFactura) {
        await api.put(`/facturas/${editingFactura.id}`, facturaData);
        setSnackbar({
          open: true,
          message: 'Factura actualizada correctamente',
          severity: 'success',
        });
      } else {
        await api.post('/facturas', facturaData);
        setSnackbar({
          open: true,
          message: 'Factura creada correctamente',
          severity: 'success',
        });
      }
      fetchFacturas();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar factura:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar la factura',
        severity: 'error',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/facturas/${id}`);
      setSnackbar({
        open: true,
        message: 'Factura eliminada correctamente',
        severity: 'success',
      });
      fetchFacturas();
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la factura',
        severity: 'error',
      });
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      const response = await api.get(`/facturas/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      setSnackbar({
        open: true,
        message: 'Error al descargar el PDF',
        severity: 'error',
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Facturación</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Factura
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell>{factura.id}</TableCell>
                <TableCell>{factura.cliente.nombre}</TableCell>
                <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                <TableCell>{factura.total}€</TableCell>
                <TableCell>{factura.estado}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary"
                    onClick={() => handleOpenDialog(factura)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(factura.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton 
                    color="success"
                    onClick={() => handleDownloadPDF(factura.id)}
                  >
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFactura ? 'Editar Factura' : 'Nueva Factura'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              select
              label="Cliente"
              value={formData.clienteId}
              onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
              required
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Detalles</Typography>
              {formData.detalles.map((detalle, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    select
                    label="Tipo"
                    value={detalle.tipo}
                    onChange={(e) => handleDetalleChange(index, 'tipo', e.target.value)}
                    sx={{ width: 150 }}
                  >
                    <MenuItem value="PRODUCTO">Producto</MenuItem>
                    <MenuItem value="SERVICIO">Servicio</MenuItem>
                  </TextField>

                  <TextField
                    select
                    label={detalle.tipo === 'PRODUCTO' ? 'Producto' : 'Servicio'}
                    value={detalle.itemId}
                    onChange={(e) => handleDetalleChange(index, 'itemId', e.target.value)}
                    sx={{ flexGrow: 1 }}
                  >
                    {(detalle.tipo === 'PRODUCTO' ? productos : servicios).map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nombre} - {item.precio}€
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Cantidad"
                    type="number"
                    value={detalle.cantidad}
                    onChange={(e) => handleDetalleChange(index, 'cantidad', parseInt(e.target.value))}
                    sx={{ width: 100 }}
                    inputProps={{ min: 1 }}
                  />

                  <IconButton
                    color="error"
                    onClick={() => handleRemoveDetalle(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="outlined"
                onClick={handleAddDetalle}
                sx={{ mt: 1 }}
              >
                Agregar Detalle
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingFactura ? 'Actualizar' : 'Crear'}
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

export default Facturacion;