import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Button,
  Grid,
  Alert
} from '@mui/material';
import {
  Warehouse,
  LocationOn,
  TrendingUp,
  Assessment
} from '@mui/icons-material';
import { getMLWarehouses, getWarehouseDetails } from '../api/riskApiFixed';

// Configurar icono personalizado para almacenes ML
const warehouseIcon = new L.Icon({
  iconUrl: '/warehouse-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

// Icono alternativo si no existe la imagen
const defaultWarehouseIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MLMapView = ({ onWarehouseSelect, selectedWarehouse }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warehouseDetails, setWarehouseDetails] = useState({});

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      const warehousesData = await getMLWarehouses();
      setWarehouses(warehousesData);
      
      // Cargar detalles de cada almacén
      const details = {};
      for (const warehouse of warehousesData) {
        try {
          const detail = await getWarehouseDetails(warehouse.codigo);
          details[warehouse.codigo] = detail;
        } catch (err) {
          console.warn(`Error loading details for ${warehouse.codigo}:`, err);
        }
      }
      setWarehouseDetails(details);
      
    } catch (err) {
      console.error('Error loading warehouses:', err);
      setError('Error cargando almacenes ML');
    } finally {
      setLoading(false);
    }
  };

  const handleWarehouseClick = (warehouse) => {
    console.log('🏭 Almacén seleccionado:', warehouse);
    if (onWarehouseSelect) {
      onWarehouseSelect({
        codigo: warehouse.codigo,
        nombre: warehouse.nombre,
        municipio: warehouse.municipio,
        estado: warehouse.estado,
        coordenadas: warehouse.coordenadas,
        detalles: warehouseDetails[warehouse.codigo]
      });
    }
  };

  const getRiskColorByIncidents = (totalIncidentes) => {
    if (totalIncidentes === 0) return '#4CAF50'; // Verde - Sin incidentes
    if (totalIncidentes <= 2) return '#FF9800'; // Naranja - Pocos incidentes
    return '#F44336'; // Rojo - Varios incidentes
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" p={3}>
            <Typography>Cargando mapa de almacenes ML...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ height: '600px', position: 'relative' }}>
      <CardContent sx={{ p: 0, height: '100%' }}>
        <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, maxWidth: '300px' }}>
          <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <Warehouse sx={{ mr: 1, verticalAlign: 'middle' }} />
                Almacenes Mercado Libre
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {warehouses.length} almacenes disponibles
              </Typography>
              {selectedWarehouse && (
                <Box mt={1}>
                  <Chip 
                    label={`Seleccionado: ${selectedWarehouse.codigo}`}
                    color="primary" 
                    size="small"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        <MapContainer
          center={[19.4326, -99.1332]} // Centro de México
          zoom={8}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {warehouses.map((warehouse) => {
            const details = warehouseDetails[warehouse.codigo];
            const totalIncidentes = details?.estadisticas_historicas?.total_incidentes || 0;
            
            return (
              <Marker
                key={warehouse.codigo}
                position={[warehouse.coordenadas.lat, warehouse.coordenadas.lng]}
                icon={warehouseIcon}
                eventHandlers={{
                  click: () => handleWarehouseClick(warehouse)
                }}
              >
                <Popup>
                  <Box sx={{ minWidth: 250 }}>
                    <Typography variant="h6" gutterBottom>
                      <Warehouse sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {warehouse.nombre}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {warehouse.municipio}, {warehouse.estado}
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Código:</strong> {warehouse.codigo}
                    </Typography>

                    {details && (
                      <Box mt={1}>
                        <Typography variant="body2" gutterBottom>
                          <Assessment sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          <strong>Historial:</strong>
                        </Typography>
                        
                        <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                          <Chip 
                            label={`${totalIncidentes} incidentes`}
                            size="small"
                            color={totalIncidentes === 0 ? 'success' : totalIncidentes <= 2 ? 'warning' : 'error'}
                          />
                          
                          {details.estadisticas_historicas?.ultimo_incidente && (
                            <Chip 
                              label={`Último: ${new Date(details.estadisticas_historicas.ultimo_incidente).toLocaleDateString()}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        {details.estadisticas_historicas?.tipos_incidentes?.length > 0 && (
                          <Typography variant="caption" display="block">
                            Tipos: {details.estadisticas_historicas.tipos_incidentes.slice(0, 2).join(', ')}
                            {details.estadisticas_historicas.tipos_incidentes.length > 2 && '...'}
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Box mt={2}>
                      <Button 
                        variant="contained" 
                        size="small" 
                        fullWidth
                        onClick={() => handleWarehouseClick(warehouse)}
                      >
                        Analizar Riesgo
                      </Button>
                    </Box>
                  </Box>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </CardContent>
    </Card>
  );
};

export default MLMapView;
