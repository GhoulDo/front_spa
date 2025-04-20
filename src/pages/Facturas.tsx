import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Download as DownloadIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { invoiceService } from '../api/invoiceService';
import { serviceProductService } from '../api/serviceProductService';
import { Invoice, InvoiceForm, InvoiceItem, Service, Product } from '../types';

// Extender el locale 'es' para incluir la propiedad enUS requerida por MUI X Date Pickers
const localeEs = {
  ...es,
  enUS: es
};

const Facturas: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState<InvoiceForm>({
    clienteId: '',
    fecha: new Date().toISOString().split('T')[0],
    items: []
  });
  const [newItem, setNewItem] = useState<InvoiceItem>({
    id: '',
    tipo: 'SERVICIO',
    itemId: '',
    cantidad: 1,
    precioUnitario: 0,
    subtotal: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    fetchInvoices();
    fetchServices();
    fetchProducts();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cargar las facturas',
        severity: 'error'
      });
    }
  };

  const fetchServices = async () => {
    try {
      const data = await serviceProductService.getServices();
      setServices(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cargar los servicios',
        severity: 'error'
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await serviceProductService.getProducts();
      setProducts(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cargar los productos',
        severity: 'error'
      });
    }
  };

  const handleOpenDialog = (invoice?: Invoice) => {
    if (invoice) {
      setSelectedInvoice(invoice);
      setFormData({
        clienteId: invoice.clienteId.toString(),
        fecha: new Date(invoice.fecha).toISOString().split('T')[0],
        items: invoice.detalles
      });
    } else {
      setSelectedInvoice(null);
      setFormData({
        clienteId: '',
        fecha: new Date().toISOString().split('T')[0],
        items: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInvoice(null);
    setFormData({
      clienteId: '',
      fecha: new Date().toISOString().split('T')[0],
      items: []
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedInvoice) {
        await invoiceService.updateInvoice(selectedInvoice.id, formData);
        setSnackbar({
          open: true,
          message: 'Factura actualizada correctamente',
          severity: 'success'
        });
      } else {
        await invoiceService.createInvoice(formData);
        setSnackbar({
          open: true,
          message: 'Factura creada correctamente',
          severity: 'success'
        });
      }
      handleCloseDialog();
      fetchInvoices();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al guardar la factura',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await invoiceService.deleteInvoice(id);
      setSnackbar({
        open: true,
        message: 'Factura eliminada correctamente',
        severity: 'success'
      });
      fetchInvoices();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al eliminar la factura',
        severity: 'error'
      });
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const blob = await invoiceService.downloadInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al descargar la factura',
        severity: 'error'
      });
    }
  };

  const handleAddItem = () => {
    const item = { ...newItem };
    if (item.tipo === 'SERVICIO') {
      const service = services.find(s => s.id === item.itemId);
      if (service) {
        item.precioUnitario = service.precio;
        item.subtotal = service.precio * item.cantidad;
      }
    } else {
      const product = products.find(p => p.id === item.itemId);
      if (product) {
        item.precioUnitario = product.precio;
        item.subtotal = product.precio * item.cantidad;
      }
    }
    setFormData({
      ...formData,
      items: [...formData.items, item]
    });
    setNewItem({
      id: '',
      tipo: 'SERVICIO',
      itemId: '',
      cantidad: 1,
      precioUnitario: 0,
      subtotal: 0
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const calculateTotal = (items: InvoiceItem[]) => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">Gestión de Facturas</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Nueva Factura
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.clienteId}</TableCell>
                    <TableCell>{new Date(invoice.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>${calculateTotal(invoice.detalles).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(invoice)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(invoice.id.toString())}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDownload(invoice.id.toString())}>
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedInvoice ? 'Editar Factura' : 'Nueva Factura'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ID del Cliente"
                type="number"
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeEs}>
                <DatePicker
                  label="Fecha"
                  value={new Date(formData.fecha)}
                  onChange={(date) => {
                    if (date) {
                      setFormData({ 
                        ...formData, 
                        fecha: date.toISOString().split('T')[0] 
                      });
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Items</Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={newItem.tipo}
                      onChange={(e) => setNewItem({ ...newItem, tipo: e.target.value === 'SERVICIO' ? 'SERVICIO' : 'PRODUCTO' })}
                    >
                      <MenuItem value="SERVICIO">Servicio</MenuItem>
                      <MenuItem value="PRODUCTO">Producto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Item</InputLabel>
                    <Select
                      value={newItem.itemId}
                      onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
                    >
                      {newItem.tipo === 'SERVICIO'
                        ? services.map((service) => (
                            <MenuItem key={service.id} value={service.id}>
                              {service.nombre}
                            </MenuItem>
                          ))
                        : products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.nombre}
                            </MenuItem>
                          ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="Cantidad"
                    type="number"
                    value={newItem.cantidad}
                    onChange={(e) => setNewItem({ ...newItem, cantidad: parseInt(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="Precio"
                    type="number"
                    value={newItem.precioUnitario}
                    onChange={(e) => setNewItem({ ...newItem, precioUnitario: parseFloat(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddItem}
                    sx={{ mt: 1 }}
                  >
                    Agregar
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Subtotal</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.tipo === 'SERVICIO' ? 'Servicio' : 'Producto'}</TableCell>
                        <TableCell>
                          {item.tipo === 'SERVICIO'
                            ? services.find(s => s.id === item.itemId)?.nombre
                            : products.find(p => p.id === item.itemId)?.nombre}
                        </TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell>${item.precioUnitario.toFixed(2)}</TableCell>
                        <TableCell>${(item.precioUnitario * item.cantidad).toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveItem(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" align="right">
                Total: ${calculateTotal(formData.items).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
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

export default Facturas;