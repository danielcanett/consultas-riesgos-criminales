import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Tooltip,
  Grid,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  LocationOn,
  Circle,
  Warning,
  CheckCircle,
  ErrorOutline,
  Warehouse,
  Construction,
  Business
} from '@mui/icons-material';

const MapView = ({ results, selectedWarehouse, warehouses = [] }) => {
  const theme = useTheme();
  // Función para convertir coordenadas geográficas a posiciones del mapa (0-100%)
  const convertToMapPosition = (lat, lng) => {
    const minLat = 14.5, maxLat = 32.5;
    const minLng = -118, maxLng = -86;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  // Generar nivel de riesgo basado en ID
  const generateRiskLevel = (id) => {
    const risks = ['bajo', 'medio', 'alto'];
    const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return risks[hash % 3];
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'alto': return '#f44336';
      case 'medio': return '#ff9800';
      case 'bajo': return '#4caf50';
      default: return '#757575';
    }
  };

  // Procesar los datos recibidos por props
  const warehouseData = warehouses.map(warehouse => {
    const position = convertToMapPosition(warehouse.lat, warehouse.lng);
    const risk = generateRiskLevel(warehouse.id);
    return {
      ...warehouse,
      x: position.x,
      y: position.y,
      risk: risk,
      color: getRiskColor(risk)
    };
  });

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'alto': return <ErrorOutline sx={{ color: '#fff', fontSize: 16 }} />;
      case 'medio': return <Warning sx={{ color: '#fff', fontSize: 16 }} />;
      case 'bajo': return <CheckCircle sx={{ color: '#fff', fontSize: 16 }} />;
      default: return <Circle sx={{ color: '#fff', fontSize: 16 }} />;
    }
  };

  const getWarehouseIcon = (warehouse) => {
    if (warehouse.status === 'en_construccion') {
      return <Construction sx={{ color: '#fff', fontSize: 16 }} />;
    }
    return warehouse.type === 'fulfillment' ? 
      <Warehouse sx={{ color: '#fff', fontSize: 16 }} /> : 
      <Business sx={{ color: '#fff', fontSize: 16 }} />;
  };

  // Estadísticas para el panel
  const stats = {
    total: warehouseData.length,
    operativo: warehouseData.filter(w => w.status === 'operativo').length,
    construccion: warehouseData.filter(w => w.status === 'en_construccion').length,
    altoRiesgo: warehouseData.filter(w => w.risk === 'alto').length,
    medioRiesgo: warehouseData.filter(w => w.risk === 'medio').length,
    bajoRiesgo: warehouseData.filter(w => w.risk === 'bajo').length,
    fulfillment: warehouseData.filter(w => w.type === 'fulfillment').length,
    regional: warehouseData.filter(w => w.type === 'regional').length
  };

  return (
    <Box>
      {/* Área del Mapa */}
      <Box
        sx={{
          height: 420,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          mb: 2
        }}
      >
        {/* Fondo del mapa con regiones */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 25% 60%, rgba(76, 175, 80, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 75% 25%, rgba(255, 152, 0, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 85% 70%, rgba(33, 150, 243, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 50% 40%, rgba(156, 39, 176, 0.1) 0%, transparent 35%)
            `,
          }}
        />

        {/* Etiquetas de regiones */}
        <Typography
          variant="caption"
          component="span"
          sx={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            color: 'text.secondary',
            fontWeight: 600,
            backgroundColor: 'rgba(255,255,255,0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}
        >
          Estado de México
        </Typography>
        <Typography
          variant="caption"
          component="span"
          sx={{
            position: 'absolute',
            top: '25%',
            left: '40%',
            color: 'text.secondary',
            fontWeight: 600,
            backgroundColor: 'rgba(255,255,255,0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}
        >
          Hidalgo
        </Typography>
        <Typography
          variant="caption"
          component="span"
          sx={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            color: 'text.secondary',
            fontWeight: 600,
            backgroundColor: 'rgba(255,255,255,0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}
        >
          Nuevo León
        </Typography>
        <Typography
          variant="caption"
          component="span"
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            color: 'text.secondary',
            fontWeight: 600,
            backgroundColor: 'rgba(255,255,255,0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}
        >
          Guadalajara
        </Typography>

        {/* Marcadores de almacenes */}
        {warehouseData.map((warehouse) => (
          <Tooltip 
            key={warehouse.id}
            title={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {warehouse.id}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  {warehouse.name}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  {warehouse.region} • {warehouse.status === 'operativo' ? 'Operativo' : 'En Construcción'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Riesgo: {warehouse.risk}
                </Typography>
              </Box>
            }
            arrow
          >
            <Box
              sx={{
                position: 'absolute',
                left: `${warehouse.x}%`,
                top: `${warehouse.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 5,
                '&:hover': {
                  transform: 'translate(-50%, -50%) scale(1.1)',
                  transition: 'transform 0.2s ease'
                }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: warehouse.status === 'en_construccion' ? '#ff9800' : warehouse.color,
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow: theme.shadows[3],
                  opacity: warehouse.status === 'en_construccion' ? 0.8 : 1
                }}
              >
                {warehouse.status === 'en_construccion' ? 
                  <Construction sx={{ color: '#fff', fontSize: 16 }} /> :
                  getRiskIcon(warehouse.risk)
                }
              </Avatar>
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  mt: 0.5,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  px: 0.5,
                  borderRadius: 0.5,
                  fontSize: '0.65rem',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {warehouse.id}
              </Typography>
            </Box>
          </Tooltip>
        ))}

        {/* Leyenda */}
        <Paper
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            p: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            minWidth: 140
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
            Leyenda
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle sx={{ color: '#4caf50', fontSize: 12 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Bajo Riesgo</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning sx={{ color: '#ff9800', fontSize: 12 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Riesgo Medio</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ErrorOutline sx={{ color: '#f44336', fontSize: 12 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Alto Riesgo</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Construction sx={{ color: '#ff9800', fontSize: 12 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>En Construcción</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Panel de información */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}>
                📊 Red de Centros ML
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Total:</Typography>
                  <Chip label={stats.total} size="small" color="primary" sx={{ height: 18, fontSize: '0.7rem' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Operativos:</Typography>
                  <Chip label={stats.operativo} size="small" color="success" sx={{ height: 18, fontSize: '0.7rem' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>En construcción:</Typography>
                  <Chip label={stats.construccion} size="small" color="warning" sx={{ height: 18, fontSize: '0.7rem' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Fulfillment:</Typography>
                  <Chip label={stats.fulfillment} size="small" color="info" sx={{ height: 18, fontSize: '0.7rem' }} />
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0.5, mt: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'success.main' }}>
                    Bajo: {stats.bajoRiesgo}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'warning.main' }}>
                    Medio: {stats.medioRiesgo}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'error.main' }}>
                    Alto: {stats.altoRiesgo}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}>
                🎯 Centro Seleccionado
              </Typography>
              {selectedWarehouse ? (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selectedWarehouse.id}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>
                    {selectedWarehouse.name}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                    📍 {selectedWarehouse.region}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip 
                      label={selectedWarehouse.status === 'operativo' ? 'Operativo' : 'En Construcción'}
                      size="small" 
                      color={selectedWarehouse.status === 'operativo' ? 'success' : 'warning'}
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                    <Chip 
                      label={selectedWarehouse.type === 'fulfillment' ? 'Fulfillment' : 'Regional'}
                      size="small" 
                      color={selectedWarehouse.type === 'fulfillment' ? 'primary' : 'secondary'}
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <LocationOn sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Selecciona un centro para ver detalles
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MapView;