import React, { useState } from 'react';
import { consultarRiesgo } from '../api/riskApiFixed';
import { CircularProgress } from '@mui/material';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  Map,
  Dashboard,
  Warehouse,
  TrendingUp
} from '@mui/icons-material';


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ml-tabpanel-${index}`}
      aria-labelledby={`ml-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MLSpecializedPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [datosCriminalidad, setDatosCriminalidad] = useState(null);
  const [resultadoRiesgo, setResultadoRiesgo] = useState(null);
  const [loadingRiesgo, setLoadingRiesgo] = useState(false);
  const [errorRiesgo, setErrorRiesgo] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleWarehouseSelect = async (warehouse) => {
    console.log('🏭 Almacén seleccionado en página principal:', warehouse);
    setSelectedWarehouse(warehouse);
    setDatosCriminalidad(null);
    setResultadoRiesgo(null);
    setErrorRiesgo(null);
    // Mapeo robusto por código de almacén (alineado con backend)
    const mapeoAlmacenes = {
      'MXCD02': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXCD05': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXCD06': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXCD07': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXCD08': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXCD09': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXCD11': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXCD14': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXRC03': { municipio: 'Tepotzotlán', estado: 'México' },
      'MXCD10': { municipio: 'Zempoala', estado: 'Hidalgo' },
      'MXCD12': { municipio: 'Tepeapulco', estado: 'Hidalgo' },
      'MXCD13': { municipio: 'Actopan', estado: 'Hidalgo' },
      'MXNL01': { municipio: 'Monterrey', estado: 'Nuevo León' },
      'MXNL02': { municipio: 'Monterrey', estado: 'Nuevo León' },
      'MXJL01': { municipio: 'Guadalajara', estado: 'Jalisco' },
      'MXJL02': { municipio: 'Guadalajara', estado: 'Jalisco' },
      'MXGT01': { municipio: 'León', estado: 'Guanajuato' },
    };
    // Forzar uso del mapeo oficial
    if (warehouse && warehouse.codigo && mapeoAlmacenes[warehouse.codigo]) {
      const municipio = mapeoAlmacenes[warehouse.codigo].municipio;
      const estado = mapeoAlmacenes[warehouse.codigo].estado;
      setLoadingRiesgo(true);
      try {
        // Armar payload completo y oficial
        const payload = {
          address: warehouse.address || '',
          codigo: warehouse.codigo || '',
          nombre: warehouse.nombre || '',
          municipio: municipio,
          estado: estado,
          ambito: warehouse.ambito || '',
          region: warehouse.region || '',
          comentarios: warehouse.comentarios || '',
        };
        // Forzar municipio y estado oficiales para ML
        if (mapeoAlmacenes[warehouse.codigo]) {
          payload.municipio = mapeoAlmacenes[warehouse.codigo].municipio;
          payload.estado = mapeoAlmacenes[warehouse.codigo].estado;
        }
        const resultado = await consultarRiesgo(payload);
        console.log('🟢 Resultado completo de consultarRiesgo:', resultado);
        // Unificar estructura: si viene como { results: {...} }, extraer el objeto
        let unifiedResults = resultado;
        if (resultado && resultado.results) {
          unifiedResults = resultado.results;
        }
        setResultadoRiesgo(unifiedResults);
        setDatosCriminalidad(unifiedResults?.datosCriminalidad || unifiedResults?.datos_criminalidad || null);
      } catch (err) {
        setErrorRiesgo('No se pudo obtener el riesgo real para este almacén.');
      }
      setLoadingRiesgo(false);
    } else {
      setErrorRiesgo('Este almacén no está en el listado oficial de datos reales. Selecciona uno válido.');
    }
    // Cambiar automáticamente al tab de análisis cuando se selecciona un almacén
    if (tabValue === 0) {
      setTabValue(1);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          <Warehouse sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
          Auditoría Interna ML - Almacenes Existentes
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Análisis híbrido con experiencia histórica ML + datos gubernamentales oficiales
        </Typography>
        <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
          ⚠️ Solo para almacenes ML en operación (Tultepec y Tlalpan)
        </Typography>
        
        {selectedWarehouse && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Almacén seleccionado:</strong> {selectedWarehouse.nombre} 
            ({selectedWarehouse.codigo}) - {selectedWarehouse.municipio}, {selectedWarehouse.estado}
          </Alert>
        )}
      </Box>

      {/* Estadísticas Rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warehouse sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary">
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Almacenes ML Activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Dashboard sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                98%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Precisión del Modelo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                4
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Incidentes Históricos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Map sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main">
                5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estados Cubiertos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs de Navegación */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="ML specialized tabs"
            variant="fullWidth"
          >
            <Tab 
              icon={<Map />} 
              label="Mapa de Almacenes" 
              id="ml-tab-0"
              aria-controls="ml-tabpanel-0"
            />
            <Tab 
              icon={<Dashboard />} 
              label="Análisis de Riesgo" 
              id="ml-tab-1"
              aria-controls="ml-tabpanel-1"
            />
          </Tabs>
        </Box>

        {/* Panel del Mapa */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 0 }}>

          </Box>
        </TabPanel>

        {/* Panel del Dashboard */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            {selectedWarehouse && (
              <>
                <Typography variant="h5" gutterBottom>
                  Riesgo Real Oficial SESNSP
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedWarehouse.nombre} ({selectedWarehouse.codigo})<br/>
                  {selectedWarehouse.municipio}, {selectedWarehouse.estado}
                </Typography>
                {loadingRiesgo && <CircularProgress sx={{ my: 2 }} />}
                {errorRiesgo && <Alert severity="error">{errorRiesgo}</Alert>}
              </>
            )}
            {/* DEBUG VISUAL: Mostrar el JSON recibido SIEMPRE */}
            <Card sx={{ my: 2, bgcolor: '#fffbe6', border: '1px solid #ffe58f' }}>
              <CardContent>
                <Typography variant="subtitle2" color="warning.main" gutterBottom>
                  Depuración: JSON recibido del backend
                </Typography>
                <pre style={{background:'#fffbe6',color:'#333',padding:'8px',borderRadius:'6px',fontSize:'0.85em',marginBottom:'12px',maxHeight:'300px',overflow:'auto'}}>
                  {JSON.stringify(resultadoRiesgo, null, 2)}
                </pre>
                <RiskResultsTable results={resultadoRiesgo || {}} />
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Card>

      {/* Footer Informativo */}
      <Box mt={4}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body2" color="text.secondary" align="center">
              <strong>Motor ML Especializado v1.0</strong> - Combina experiencia histórica ML (40%) + 
              datos gubernamentales SESNSP/INEGI (30%) + análisis de movimientos sociales (20%) + 
              factores estacionales (10%) | Actualizado: {new Date().toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default MLSpecializedPage;
