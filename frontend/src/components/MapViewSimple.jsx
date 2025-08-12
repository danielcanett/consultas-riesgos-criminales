import React from 'react';
import { Box, Typography, Paper, Chip, Grid } from '@mui/material';

const MapViewSimple = ({ selectedWarehouse }) => {
  // Datos de ejemplo para los warehouses
  const warehouses = [
    { id: 'MXCD02', name: 'Centro de Fulfillment MXCD02', lat: 19.4326, lng: -99.1332, risk: 'MEDIO', status: 'Operativo' },
    { id: 'MXCD05', name: 'Centro de Fulfillment MXCD05', lat: 19.3910, lng: -99.2840, risk: 'HIGH', status: 'Operativo' },
    { id: 'MXCD08', name: 'Centro de Fulfillment MXCD08', lat: 19.5033, lng: -99.2039, risk: 'LOW', status: 'Operativo' },
    { id: 'MXCD07', name: 'Centro de Fulfillment MXCD07', lat: 19.2965, lng: -99.1573, risk: 'MEDIUM', status: 'Mantenimiento' }
  ];

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'HIGH': return '#f44336';
      case 'MEDIUM': case 'MEDIO': return '#ff9800';
      case 'LOW': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 1 }}>
      <Paper elevation={1} sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📍 Mapa Inteligente
        </Typography>
        
        <Box sx={{ 
          flexGrow: 1, 
          backgroundColor: '#e3f2fd', 
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #bbdefb'
        }}>
          {/* Fondo de mapa simulado */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 60% 20%, rgba(255, 152, 0, 0.1) 0%, transparent 50%)
            `
          }} />
          
          {/* Marcadores de warehouses */}
          {warehouses.map((warehouse, index) => (
            <Box
              key={warehouse.id}
              sx={{
                position: 'absolute',
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: getRiskColor(warehouse.risk),
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  animation: selectedWarehouse?.id === warehouse.id ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: -10, 
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 1,
                  px: 0.5,
                  whiteSpace: 'nowrap'
                }}
              >
                {warehouse.id}
              </Typography>
            </Box>
          ))}
          
          {/* Centro del mapa */}
          <Box sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 1,
            p: 1
          }}>
            <Typography variant="caption" color="text.secondary">
              📍 Centro de Fulfillment MXCD02
            </Typography>
          </Box>
        </Box>
        
        {/* Información del warehouse seleccionado */}
        {selectedWarehouse && (
          <Box sx={{ mt: 2, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  📍 {selectedWarehouse.name}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Chip 
                  label={selectedWarehouse.risk || 'MEDIO'} 
                  size="small" 
                  color={selectedWarehouse.risk === 'HIGH' ? 'error' : selectedWarehouse.risk === 'LOW' ? 'success' : 'warning'}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MapViewSimple;
