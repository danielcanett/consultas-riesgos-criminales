import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import warehousesData from '../data/warehouses.json';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Asigna el nivel de riesgo según el ámbito
const getRiskFromAmbito = (ambito) => {
  switch (ambito) {
    case 'industrial_metro': return 'MEDIUM';
    case 'industrial_semiurb': return 'LOW';
    case 'industrial_suburb': return 'LOW';
    case 'industrial_mixta': return 'MEDIUM';
    case 'alta_seguridad': return 'HIGH';
    default: return 'MEDIUM';
  }
};

const getRiskColor = (risk) => {
  switch (risk) {
    case 'HIGH': return '#f44336';
    case 'MEDIUM': case 'MEDIO': return '#ff9800';
    case 'LOW': return '#4caf50';
    default: return '#9e9e9e';
  }
};

const createCustomIcon = (risk, isML = false) => {
  const color = getRiskColor(risk);
  const icon = isML ? '🏭' : '📦';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style='background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${isML ? '#ff6b6b' : 'white'}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;'>${icon}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const MapViewReal = ({ selectedWarehouse }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [allWarehouses, setAllWarehouses] = useState([]);

  // Cargar almacenes originales al montar
  useEffect(() => {
    const originalWarehouses = warehousesData.map(w => ({
      ...w,
      source: 'original',
      coordinates: { lat: w.lat, lng: w.lng },
      ubicacion: w.address || w.region || ''
    }));
    setAllWarehouses(originalWarehouses);
  }, []);

  // Inicializar el mapa y los marcadores
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([19.4326, -99.1332], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.eachLayer(layer => {
        if (layer instanceof L.Marker) mapInstanceRef.current.removeLayer(layer);
      });
      allWarehouses.forEach(warehouse => {
        const risk = getRiskFromAmbito(warehouse.ambito);
        const coords = warehouse.coordinates || { lat: warehouse.lat, lng: warehouse.lng };
        if (coords && coords.lat && coords.lng) {
          const marker = L.marker([coords.lat, coords.lng], {
            icon: createCustomIcon(risk, warehouse.source === 'ml')
          }).addTo(mapInstanceRef.current);
          marker.bindPopup(`
            <div style="text-align: center; padding: 8px;">
              <strong>${warehouse.id}</strong>
              ${warehouse.source === 'ml' ? '<span style="color: #ff6b6b; font-weight: bold;"> [ML]</span>' : ''}<br/>
              ${warehouse.name || warehouse.nombre}<br/>
              <span style="color: ${getRiskColor(risk)}; font-weight: bold;">
                Riesgo: ${risk}
              </span><br/>
              <small>Ubicación: ${warehouse.ubicacion || 'N/A'}</small><br/>
              ${warehouse.source === 'ml' ? '<small>🏭 Almacén ML Especializado</small>' : '<small>📦 Almacén Tradicional</small>'}
            </div>
          `);
        }
      });
    }
  }, [allWarehouses]);

  return (
    <Box>
      <Box sx={{ width: '100%', minHeight: '400px', mb: 2 }}>
        <Paper elevation={3} sx={{ height: '100%' }}>
          <div ref={mapRef} style={{ width: '100%', minHeight: '400px' }} />
        </Paper>
      </Box>

    </Box>
  );
};

export default MapViewReal;
