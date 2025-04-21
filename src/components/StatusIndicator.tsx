import React, { useEffect, useState } from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import api from '../api/apiConfig';

const StatusIndicator: React.FC = () => {
  const [status, setStatus] = useState<'online' | 'offline'>('offline');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const checkServerStatus = async () => {
    try {
      await api.get('/api/health', { timeout: 3000 });
      setStatus('online');
    } catch (error) {
      console.error('Error al verificar estado del servidor:', error);
      setStatus('offline');
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkServerStatus();
    
    // Verificar cada 30 segundos
    const intervalId = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Tooltip 
      title={`Servidor ${status === 'online' ? 'en línea' : 'fuera de línea'}. Última verificación: ${lastChecked.toLocaleTimeString()}`}
    >
      <Chip
        icon={status === 'online' ? <CheckCircle /> : <ErrorIcon />}
        label={status === 'online' ? 'API Conectada' : 'API Desconectada'}
        color={status === 'online' ? 'success' : 'error'}
        size="small"
        onClick={checkServerStatus}
        sx={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999 }}
      />
    </Tooltip>
  );
};

export default StatusIndicator;
