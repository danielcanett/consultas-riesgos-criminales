import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore,
  Warehouse,
  Assessment,
  Security,
  TrendingUp,
  Warning,
  CheckCircle,
  History,
  Timeline
} from '@mui/icons-material';
import {
  getMLScenarios,
  getMLSecurityMeasures,
  getWarehouseHistory,
  getRiskTrends
} from '../api/riskApi';

const MLDashboard = ({ selectedWarehouse }) => {
  const [scenarios, setScenarios] = useState([]);
  const [securityMeasures, setSecurityMeasures] = useState([]);
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  const [riskResult, setRiskResult] = useState(null);
  const [warehouseHistory, setWarehouseHistory] = useState(null);
  const [riskTrends, setRiskTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      loadWarehouseData();
    }
  }, [selectedWarehouse]);

  const loadInitialData = async () => {
    try {
      const [scenariosData, measuresData] = await Promise.all([
        getMLScenarios(),
        getMLSecurityMeasures()
      ]);
      
      setScenarios(scenariosData.escenarios_ml || []);
      setSecurityMeasures(measuresData.medidas_ml || []);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Error cargando datos iniciales');
    }
  };

  const loadWarehouseData = async () => {
    if (!selectedWarehouse?.codigo) return;

    try {
      const [historyData, trendsData] = await Promise.all([
        getWarehouseHistory(selectedWarehouse.codigo).catch(() => null),
        getRiskTrends(selectedWarehouse.codigo, 30).catch(() => null)
      ]);

      setWarehouseHistory(historyData);
      setRiskTrends(trendsData);
    } catch (err) {
      console.error('Error loading warehouse data:', err);
    }
  };

  // La función de cálculo de riesgo ML ha sido eliminada para evitar conflictos con el motor 4v.
  // Si necesitas cálculo de riesgo, usa el formulario principal que ahora apunta al motor 4v.

  const getRiskColor = (riesgo) => {
    if (riesgo <= 25) return '#4CAF50';
    if (riesgo <= 45) return '#FF9800';
    if (riesgo <= 70) return '#F44336';
    return '#D32F2F';
  };

  const getRiskIcon = (nivel) => {
    switch (nivel) {
      case 'BAJO': return <CheckCircle sx={{ color: '#4CAF50' }} />;
      case 'MEDIO': return <Warning sx={{ color: '#FF9800' }} />;
      case 'ALTO': return <Warning sx={{ color: '#F44336' }} />;
      case 'CRÍTICO': return <Warning sx={{ color: '#D32F2F' }} />;
      default: return <Assessment />;
    }
  };

  if (!selectedWarehouse) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" p={4}>
            <Box textAlign="center">
              <Warehouse sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Selecciona un almacén en el mapa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Haz clic en cualquier marcador del mapa para comenzar el análisis
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header del Almacén */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
            <Box flex={1}>
              <Typography variant="h5" gutterBottom>
                <Warehouse sx={{ mr: 1, verticalAlign: 'middle' }} />
                {selectedWarehouse.nombre}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {selectedWarehouse.municipio}, {selectedWarehouse.estado}
              </Typography>
              <Chip label={selectedWarehouse.codigo} color="primary" size="small" sx={{ mt: 1 }} />
            </Box>
            
            {selectedWarehouse.detalles && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total incidentes históricos
                </Typography>
                <Typography variant="h4" color="primary">
                  {selectedWarehouse.detalles.estadisticas_historicas?.total_incidentes || 0}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {/* Panel de Configuración */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                Configuración de Análisis
              </Typography>

              {/* Selección de Escenarios */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Escenarios a Analizar</InputLabel>
                <Select
                  multiple
                  value={selectedScenarios}
                  onChange={(e) => setSelectedScenarios(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const scenario = scenarios.find(s => s.codigo === value);
                        return (
                          <Chip
                            key={value}
                            label={scenario?.nombre || value}
                            size="small"
                            color={scenario?.criticidad === 'crítica' ? 'error' : 
                                  scenario?.criticidad === 'alta' ? 'warning' : 'default'}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {scenarios.map((scenario) => (
                    <MenuItem key={scenario.codigo} value={scenario.codigo}>
                      <Box>
                        <Typography variant="body2">{scenario.nombre}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {scenario.descripcion}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selección de Medidas de Seguridad */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Medidas de Seguridad</InputLabel>
                <Select
                  multiple
                  value={selectedMeasures}
                  onChange={(e) => setSelectedMeasures(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const measure = securityMeasures.find(m => m.codigo === value);
                        return (
                          <Chip
                            key={value}
                            label={measure?.nombre || value}
                            size="small"
                            color={measure?.efectividad === 'muy_alta' ? 'success' : 
                                  measure?.efectividad === 'alta' ? 'primary' : 'default'}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {securityMeasures.map((measure) => (
                    <MenuItem key={measure.codigo} value={measure.codigo}>
                      <Box>
                        <Typography variant="body2">{measure.nombre}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {measure.descripcion} | Tipo: {measure.tipo}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                onClick={handleCalculateRisk}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}
              >
                {loading ? 'Calculando...' : 'Calcular Riesgo ML'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Panel de Resultados */}
        <Grid item xs={12} md={8}>
          {riskResult ? (
            <Box>
              {/* Resultado Principal */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Resultado del Análisis ML
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {riskResult.motor_usado} | {new Date(riskResult.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      {getRiskIcon(riskResult.nivel_riesgo)}
                      <Typography variant="h3" sx={{ color: getRiskColor(riskResult.riesgo_general) }}>
                        {riskResult.riesgo_general}%
                      </Typography>
                      <Chip 
                        label={riskResult.nivel_riesgo}
                        color={riskResult.nivel_riesgo === 'BAJO' ? 'success' : 
                              riskResult.nivel_riesgo === 'MEDIO' ? 'warning' : 'error'}
                      />
                    </Box>
                  </Box>

                  {/* Análisis Híbrido */}
                  {riskResult.analisis_hibrido && (
                    <Box mt={2}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Análisis Híbrido ML:</strong>
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption">Histórico ML</Typography>
                          <Typography variant="h6" color="primary">
                            {riskResult.analisis_hibrido.riesgo_historico_ml}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption">Gubernamental</Typography>
                          <Typography variant="h6" color="secondary">
                            {riskResult.analisis_hibrido.riesgo_gubernamental}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption">Factor Estacional</Typography>
                          <Typography variant="h6">
                            {riskResult.analisis_hibrido.factor_estacional}x
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption">Protección ML</Typography>
                          <Typography variant="h6" color="success.main">
                            {riskResult.analisis_hibrido.factor_proteccion_ml}x
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {/* Escenarios Analizados */}
                  {riskResult.riesgos_por_escenario && Object.keys(riskResult.riesgos_por_escenario).length > 0 && (
                    <Box mt={2}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Riesgos por Escenario:</strong>
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {Object.entries(riskResult.riesgos_por_escenario).map(([scenario, risk]) => (
                          <Chip
                            key={scenario}
                            label={`${scenario}: ${risk}%`}
                            size="small"
                            color={risk > 20 ? 'error' : risk > 15 ? 'warning' : 'default'}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Recomendaciones */}
              {riskResult.recomendaciones && riskResult.recomendaciones.length > 0 && (
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recomendaciones ML Específicas
                    </Typography>
                    <Box>
                      {riskResult.recomendaciones.map((rec, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                          • {rec}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          ) : (
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="center" p={4}>
                  <Box textAlign="center">
                    <Assessment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Configura y ejecuta el análisis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Selecciona escenarios y medidas de seguridad para obtener el resultado
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Historial del Almacén */}
          {warehouseHistory && (
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <History sx={{ mr: 1 }} />
                <Typography>Historial del Almacén ({warehouseHistory.estadisticas?.total_incidentes || 0} incidentes)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  {warehouseHistory.incidentes_historicos?.slice(0, 5).map((incidente, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="caption">Fecha</Typography>
                            <Typography variant="body2">{incidente.fecha}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption">Tipo</Typography>
                            <Typography variant="body2">{incidente.tipo}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="caption">Impacto</Typography>
                            <Typography variant="body2">{incidente.impacto_operacional}%</Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Typography variant="caption">Costo</Typography>
                            <Typography variant="body2">${incidente.costo_estimado?.toLocaleString()}</Typography>
                          </Grid>
                        </Grid>
                        {incidente.descripcion && (
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            {incidente.descripcion}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MLDashboard;
