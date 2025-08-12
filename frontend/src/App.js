import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid, Card, CardContent, 
  Fab, Drawer, IconButton, useTheme, CssBaseline,
  AppBar, Toolbar, Button, Chip, Paper
} from '@mui/material';
import { Settings, Close, Assessment, Security, TrendingUp } from '@mui/icons-material';

// APIs
import { consultarRiesgoNuevo } from './api/riskApi';

// Componentes
import { ThemeProvider, useTheme as useCustomTheme } from './components/ThemeContext';
import RiskAssessmentForm from './components/RiskAssessmentForm';
import EnhancedResults from './components/EnhancedResults';
import WarehouseList from './components/WarehouseList';
import MapViewReal from './components/MapViewReal';
import AiChatbot from './components/AiChatbot';
import GamificationPanel from './components/GamificationPanel';
import NotificationSystem from './components/NotificationSystem_new';
import ThemeSelector from './components/ThemeSelector';
import TechnicalInfoTabs from './components/TechnicalInfoTabs';

// Header moderno y limpio
const ModernHeader = ({ onTestRisk }) => {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ minHeight: '80px !important', px: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Assessment sx={{ fontSize: 36, mr: 2, color: 'white' }} />
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: 'white',
              fontFamily: '"Segoe UI", Roboto, sans-serif',
              fontSize: '1.8rem'
            }}>
              Consultas de Riesgos - Almacenes Mercado Libre
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={onTestRisk}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
              fontWeight: 600
            }}
          >
            🧪 Prueba Automática
          </Button>
        </Box>
        {/* Botones eliminados para limpiar la interfaz */}
      </Toolbar>
    </AppBar>
  );
};

function AppContent() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [riskResults, setRiskResults] = useState(null);
  const [evaluationsCompleted, setEvaluationsCompleted] = useState(0);
  const [warehouses, setWarehouses] = useState([]);

  // Cargar almacenes una sola vez
  useEffect(() => {
    import('./data/warehouses.json').then(data => {
      setWarehouses(data.default);
      // Seleccionar el primero si no hay ninguno
      if (!selectedWarehouse && data.default.length > 0) {
        setSelectedWarehouse(data.default[0]);
      }
    });
  }, []);

  // Actualizar almacén seleccionado si cambia desde WarehouseList
  const handleWarehouseSelect = (warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  const handleRiskCalculated = (results) => {
    console.log("🎯 APP.JS - Resultados recibidos:", results);
    setRiskResults(results);
  };

  // Función de prueba automática
  const handleTestRisk = async () => {
    console.log("🧪 INICIANDO PRUEBA AUTOMÁTICA");
    try {
      const testPayload = {
        address: "CIUDAD DE MEXICO",
        ambito: "urbano",
        scenarios: ["robo_transporte"],
        security_measures: ["camara_seguridad"],
        comments: "Prueba automática desde App.js"
      };
      
      console.log("🧪 Payload de prueba:", testPayload);
      const results = await consultarRiesgoNuevo(testPayload);
      console.log("🧪 Resultados de prueba recibidos:", results);
      
      if (results) {
        setRiskResults(results);
        console.log("✅ Prueba completada - Datos establecidos en estado");
      } else {
        console.log("❌ No se recibieron resultados");
      }
    } catch (error) {
      console.error("❌ Error en prueba automática:", error);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#0f0f23' : '#f0f4f8',
      position: 'relative'
    }}>
      <CssBaseline />
      {/* Header Moderno */}
      <ModernHeader onTestRisk={handleTestRisk} />
      {/* Contenido Principal */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Layout Principal de 3 Columnas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Columna Izquierda - Lista de Almacenes */}
          <Grid item xs={12} lg={3}>
            <Paper elevation={3} sx={{ 
              height: '550px',
              borderRadius: 4,
              overflow: 'hidden',
              background: isDarkMode 
                ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
            }}>
              {/* Header de sección */}
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                borderBottom: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '1.1rem'
                }}>
                  📋 Lista de Almacenes
                </Typography>
              </Box>
              <Box sx={{ height: 'calc(100% - 85px)', overflow: 'auto' }}>
                <WarehouseList 
                  warehouses={warehouses}
                  selectedWarehouse={selectedWarehouse}
                  onWarehouseSelect={handleWarehouseSelect}
                />
              </Box>
            </Paper>
          </Grid>
          {/* Columna Central - Mapa Inteligente */}
          <Grid item xs={12} lg={6}>
            <Paper elevation={3} sx={{ 
              height: '550px',
              borderRadius: 4,
              overflow: 'hidden',
              background: isDarkMode 
                ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
            }}>
              {/* Header de sección */}
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                borderBottom: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '1.1rem'
                }}>
                  🗺️ Mapa Inteligente
                </Typography>
              </Box>
              <Box sx={{ height: 'calc(100% - 85px)', overflow: 'hidden' }}>
                <MapViewReal 
                  selectedWarehouse={selectedWarehouse}
                  warehouses={warehouses}
                />
              </Box>
            </Paper>
          </Grid>
          {/* Columna Derecha - Asistente IA */}
          <Grid item xs={12} lg={3}>
            <Paper elevation={3} sx={{ 
              height: '550px',
              borderRadius: 4,
              overflow: 'hidden',
              background: isDarkMode 
                ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'
                : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
            }}>
              {/* Header de sección */}
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                borderBottom: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '1.1rem'
                }}>
                  🤖 Asistente IA de Riesgos
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'success.main',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.5
                }}>
                  ● En línea • Responde en tiempo real
                </Typography>
              </Box>
              <Box sx={{ height: 'calc(100% - 105px)', overflow: 'hidden' }}>
                <AiChatbot analysisData={riskResults} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Formulario de Evaluación */}
        <Paper elevation={3} sx={{ 
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          background: isDarkMode 
            ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
        }}>
          <RiskAssessmentForm onRiskCalculated={handleRiskCalculated} warehouse={selectedWarehouse} />
        </Paper>
        {/* Resultados Detallados */}
        {riskResults && (
          <EnhancedResults riskResults={riskResults} />
        )}
        {/* Panel de Gamificación */}
        <GamificationPanel 
          evaluationsCompleted={evaluationsCompleted}
          onScoreUpdate={(stats) => console.log('Score updated:', stats)}
        />
        {/* Información Técnica y Fuentes */}
        <Paper elevation={3} sx={{
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          background: isDarkMode 
            ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
        }}>
          <TechnicalInfoTabs />
        </Paper>
      </Container>
      {/* Botón de Configuración Flotante */}
      <Fab
        color="primary"
        sx={{ 
          position: 'fixed', 
          bottom: 140, 
          right: 20,
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          boxShadow: '0 8px 25px rgba(79, 172, 254, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            transform: 'scale(1.1)'
          }
        }}
        onClick={() => setDrawerOpen(true)}
      >
        <Settings />
      </Fab>
      {/* Drawer de Configuración */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { 
            width: 380,
            borderRadius: '25px 0 0 25px',
            background: isDarkMode 
              ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Personalización
            </Typography>
            <IconButton 
              onClick={() => setDrawerOpen(false)}
              sx={{ 
                backgroundColor: 'rgba(0,0,0,0.04)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' }
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <ThemeSelector />
        </Box>
      </Drawer>
      {/* Sistema de Notificaciones */}
      <NotificationSystem 
        riskData={riskResults}
        onNotificationAction={(action) => console.log('Notification action:', action)}
      />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
