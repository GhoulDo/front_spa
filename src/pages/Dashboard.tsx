import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import api from '../api/apiConfig';

interface DashboardStats {
  totalMascotas: number;
  proximasCitas: number;
  citasHoy: number;
  totalFacturas: number;
}

interface Cita {
  id: string;
  fecha: string;
  hora: string;
  mascota: {
    nombre: string;
  };
  servicio: {
    nombre: string;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMascotas: 0,
    proximasCitas: 0,
    citasHoy: 0,
    totalFacturas: 0,
  });
  const [citasHoy, setCitasHoy] = useState<Cita[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, citasResponse] = await Promise.all([
          api.get<DashboardStats>('/dashboard/stats'),
          api.get<Cita[]>('/citas/hoy'),
        ]);
        setStats(statsResponse.data);
        setCitasHoy(citasResponse.data);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Mascotas Registradas
              </Typography>
              <Typography variant="h4">{stats.totalMascotas}</Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Próximas Citas
              </Typography>
              <Typography variant="h4">{stats.proximasCitas}</Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Citas Hoy
              </Typography>
              <Typography variant="h4">{stats.citasHoy}</Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Facturas
              </Typography>
              <Typography variant="h4">{stats.totalFacturas}</Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Citas para Hoy
            </Typography>
            <List>
              {citasHoy.map((cita) => (
                <React.Fragment key={cita.id}>
                  <ListItem>
                    <ListItemText
                      primary={`${cita.mascota.nombre} - ${cita.servicio.nombre}`}
                      secondary={`${cita.hora}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {citasHoy.length === 0 && (
                <ListItem>
                  <ListItemText primary="No hay citas programadas para hoy" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 