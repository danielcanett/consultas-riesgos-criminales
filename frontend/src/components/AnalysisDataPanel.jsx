import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Chip, 
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const AnalysisDataPanel = ({ riskResults }) => {
  // Extraer los datos ML desde la estructura correcta
  const extractMLData = () => {
    if (!riskResults) return null;
    
    // Si viene envuelto desde RiskAssessmentForm
    if (riskResults.results) {
      return riskResults.results;
    }
    
    // Si viene directo
    return riskResults;
  };

  const mlData = extractMLData();

  if (!mlData) {
    return (
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              📊 Datos de Análisis
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Selecciona un almacén y ejecuta el análisis para ver los datos detallados
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const { 
    riesgo_general, 
    nivel_riesgo, 
    color_riesgo, 
    motor_usado,
    almacen,
    analisis_hibrido,
    contexto_almacen,
    recomendaciones 
  } = mlData;

  const getRiskColor = (nivel) => {
    switch (nivel?.toUpperCase()) {
      case 'ALTO': return '#f44336';
      case 'MEDIO': return '#ff9800';
      case 'BAJO': return '#4caf50';
      default: return '#757575';
    }
  };

  const getRiskProgress = (riesgo) => {
    return Math.min(Math.max(riesgo, 0), 100);
  };

  return (
    <Card sx={{ boxShadow: 3, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          color: '#1976d2', 
          fontWeight: 'bold',
          borderBottom: '2px solid #e3f2fd',
          paddingBottom: 1,
          marginBottom: 2
        }}>
          📊 Datos de Análisis Detallado
        </Typography>

        {/* Resumen Principal */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="h3" sx={{ 
                  color: getRiskColor(nivel_riesgo),
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {riesgo_general?.toFixed(1) || 'N/A'}%
                </Typography>
                <Chip 
                  label={nivel_riesgo || 'N/A'} 
                  sx={{ 
                    bgcolor: getRiskColor(nivel_riesgo),
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
                <LinearProgress 
                  variant="determinate" 
                  value={getRiskProgress(riesgo_general)} 
                  sx={{ 
                    mt: 2, 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getRiskColor(nivel_riesgo)
                    }
                  }} 
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <SecurityIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  Motor de Análisis
                </Typography>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                  {motor_usado || 'Sistema de Riesgo'}
                </Typography>
                
                {almacen && (
                  <>
                    <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Almacén Analizado
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {almacen.nombre || almacen.codigo}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {almacen.ubicacion}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Acordeones para datos detallados */}
        {analisis_hibrido && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <TrendingUpIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Análisis Híbrido ML
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#e8f5e8', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      Histórico ML
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {analisis_hibrido.riesgo_historico_ml?.toFixed(1) || '0.0'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      Gubernamental
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {analisis_hibrido.riesgo_gubernamental?.toFixed(1) || '0.0'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      Mov. Sociales
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {analisis_hibrido.riesgo_movimientos_sociales?.toFixed(1) || '0.0'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: '#f3e5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      Factores
                    </Typography>
                    <Typography variant="h6" color="secondary">
                      {((analisis_hibrido.factor_estacional || 1) * (analisis_hibrido.factor_proteccion_ml || 1)).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                {analisis_hibrido.ponderacion || "Ponderación: Histórico ML 40% + Gubernamental 30% + Movimientos 20% + Escenarios 10%"}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}

        {contexto_almacen && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <SecurityIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Contexto del Almacén
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">
                    Volumen Diario
                  </Typography>
                  <Typography variant="h6">
                    {contexto_almacen.volumen_diario?.toLocaleString() || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">
                    Valor Inventario
                  </Typography>
                  <Typography variant="h6">
                    ${contexto_almacen.valor_inventario?.toLocaleString() || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">
                    Operación 24/7
                  </Typography>
                  <Chip 
                    label={contexto_almacen.operacion_24_7 ? 'SÍ' : 'NO'}
                    color={contexto_almacen.operacion_24_7 ? 'success' : 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="textSecondary">
                    Incidentes Históricos
                  </Typography>
                  <Typography variant="h6" color={contexto_almacen.incidentes_historicos > 0 ? 'error' : 'success'}>
                    {contexto_almacen.incidentes_historicos || 0}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Recomendaciones mejoradas */}
        {recomendaciones && recomendaciones.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#1976d2' }}>
              💡 Recomendaciones ML
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recomendaciones.map((rec, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    borderLeft: '4px solid #4caf50'
                  }}
                >
                  <Typography variant="body2">
                    {rec}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisDataPanel;
