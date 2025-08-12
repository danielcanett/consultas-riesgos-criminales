import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  Badge,
  useTheme
} from '@mui/material';
import {
  Warehouse,
  LocationOn,
  TrendingUp,
  Warning,
  CheckCircle,
  ErrorOutline,
  Security,
  Construction,
  Business
} from '@mui/icons-material';

const getRiskColor = (level) => {
  switch (level) {
    case 'low': return '#4caf50';
    case 'medium': return '#ff9800';
    case 'high': return '#f44336';
    default: return '#757575';
  }
};

const getRiskIcon = (level) => {
  switch (level) {
    case 'low': return <CheckCircle sx={{ fontSize: 16 }} />;
    case 'medium': return <Warning sx={{ fontSize: 16 }} />;
    case 'high': return <ErrorOutline sx={{ fontSize: 16 }} />;
    default: return <Security sx={{ fontSize: 16 }} />;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'operativo': return <CheckCircle sx={{ fontSize: 16 }} />;
    case 'en_construccion': return <Construction sx={{ fontSize: 16 }} />;
    default: return <Business sx={{ fontSize: 16 }} />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'operativo': return 'success';
    case 'en_construccion': return 'warning';
    default: return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'operativo': return 'Operativo';
    case 'en_construccion': return 'En Construcción';
    default: return 'Desconocido';
  }
};

// Simulamos niveles de riesgo aleatorios para demostración
const generateRiskLevel = (id) => {
  const risks = ['low', 'medium', 'high'];
  const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return risks[hash % 3];
};

const generateAlerts = (id) => {
  const hash = id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return hash % 4; // 0-3 alertas
};

export default function WarehouseList({ selectedWarehouse, onWarehouseSelect }) {
  const theme = useTheme();
  // Recibe la lista de almacenes por props
  const [selectedId, setSelectedId] = useState(selectedWarehouse?.id || null);

  // Actualiza el almacén seleccionado si cambia desde el padre
  useEffect(() => {
    if (selectedWarehouse && selectedWarehouse.id !== selectedId) {
      setSelectedId(selectedWarehouse.id);
    }
  }, [selectedWarehouse]);

  const handleSelect = (warehouse) => {
    setSelectedId(warehouse.id);
    if (onWarehouseSelect) {
      onWarehouseSelect(warehouse);
    }
  };

  // Recibe la lista de almacenes por props
  const warehouses = (typeof arguments[0].warehouses !== 'undefined') ? arguments[0].warehouses : [];
  // Agrega datos de riesgo y alertas si no existen
  const warehousesWithRisk = warehouses.map(warehouse => ({
    ...warehouse,
    riskLevel: warehouse.riskLevel || generateRiskLevel(warehouse.id),
    alerts: warehouse.alerts || generateAlerts(warehouse.id),
    source: 'ml',
    ml_data: warehouse.ml_data || {
      codigo: warehouse.id,
      nombre: warehouse.name,
      municipio: warehouse.address?.split(',')[1]?.trim() || 'México',
      estado: warehouse.region || 'México',
      coordenadas: { lat: warehouse.lat, lng: warehouse.lng }
    }
  }));

  if (warehousesWithRisk.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Cargando centros de fulfillment...
        </Typography>
      </Box>
    );
  }

  // Estadísticas para el panel de insights
  const totalWarehouses = warehousesWithRisk.length;
  const operativeWarehouses = warehousesWithRisk.filter(w => w.status === 'operativo').length;
  const constructionWarehouses = warehousesWithRisk.filter(w => w.status === 'en_construccion').length;
  const highRiskWarehouses = warehousesWithRisk.filter(w => w.riskLevel === 'high').length;

  return (
    <Box>
      {/* Warehouse List */}
      <List sx={{ p: 0, maxHeight: '400px', overflow: 'auto' }}>
        {warehousesWithRisk.map((warehouse) => (
          <React.Fragment key={warehouse.id}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedId === warehouse.id}
                onClick={() => handleSelect(warehouse)}
                sx={{
                  minHeight: 85,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main + '20',
                    borderRight: `3px solid ${theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '30',
                    }
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }}
              >
                <ListItemIcon>
                  <Badge 
                    badgeContent={warehouse.alerts} 
                    color="error"
                    invisible={warehouse.alerts === 0}
                  >
                    <Avatar sx={{ 
                      bgcolor: warehouse.source === 'ml' 
                        ? '#ff6b6b' 
                        : selectedId === warehouse.id ? theme.palette.primary.main : 'action.selected',
                      width: 40,
                      height: 40
                    }}>
                      {warehouse.source === 'ml' ? <Warehouse /> : <Business />}
                    </Avatar>
                  </Badge>
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }} component="span">
                        {warehouse.id} {warehouse.source === 'ml' && '🏭'}
                      </Typography>
                      <Chip
                        icon={getRiskIcon(warehouse.riskLevel)}
                        label={warehouse.riskLevel.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getRiskColor(warehouse.riskLevel) + '20',
                          color: getRiskColor(warehouse.riskLevel),
                          fontWeight: 600,
                          fontSize: '0.65rem'
                        }}
                        component="span"
                      />
                    </Box>
                  }
                  secondary={
                    <Box component="span">
                      <Box sx={{ display: 'flex', alignItems: 'center' }} component="span">
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.8rem' }} component="span">
                          {warehouse.nombre || warehouse.name}
                        </Typography>
                        {warehouse.source === 'ml' && (
                          <Chip 
                            label="ML" 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              height: 16, 
                              fontSize: '0.6rem',
                              backgroundColor: '#ff6b6b20',
                              color: '#ff6b6b'
                            }} 
                            component="span"
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px', mb: '4px' }} component="span">
                        <LocationOn sx={{ fontSize: 12, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }} component="span">
                          {warehouse.region}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }} component="span">
                        <Chip
                          icon={getStatusIcon(warehouse.status)}
                          label={getStatusLabel(warehouse.status)}
                          size="small"
                          color={getStatusColor(warehouse.status)}
                          variant="outlined"
                          sx={{ fontSize: '0.6rem', height: 18 }}
                          component="span"
                        />
                        <Chip
                          label={warehouse.type === 'fulfillment' ? 'FF' : 'RC'}
                          size="small"
                          color={warehouse.type === 'fulfillment' ? 'primary' : 'secondary'}
                          sx={{ fontSize: '0.6rem', height: 18 }}
                          component="span"
                        />
                        {warehouse.alerts > 0 && (
                          <Typography variant="caption" color="error.main" sx={{ fontWeight: 600, fontSize: '0.65rem' }} component="span">
                            {warehouse.alerts} alerta{warehouse.alerts > 1 ? 's' : ''}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
            {warehouse.id !== warehouses[warehouses.length - 1].id && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Insights Panel */}
      <Box sx={{ p: 2, backgroundColor: 'rgba(79, 172, 254, 0.1)', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}>
          � Resumen de Red Logística
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
            🏢 Total: <strong style={{ marginLeft: '4px' }}>{totalWarehouses}</strong>
          </Typography>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
            ✅ Operativos: <strong style={{ marginLeft: '4px' }}>{operativeWarehouses}</strong>
          </Typography>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
            � En construcción: <strong style={{ marginLeft: '4px' }}>{constructionWarehouses}</strong>
          </Typography>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem' }}>
            ⚠️ Alto riesgo: <strong style={{ marginLeft: '4px' }}>{highRiskWarehouses}</strong>
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', color: 'text.secondary' }}>
          💡 Distribución: 9 Estado de México, 3 Hidalgo, 2 Nuevo León, 2 Guadalajara
        </Typography>
      </Box>
    </Box>
  );
}