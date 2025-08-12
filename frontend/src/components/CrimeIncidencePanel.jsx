import React from 'react';
import {
  Card, CardContent, Typography, Box, Chip, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Divider, Alert, Grid
} from '@mui/material';
import {
  TrendingUp, TrendingDown, Warning, LocalPolice, 
  Assessment, Security
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CrimeIncidencePanel = ({ riskResults }) => {
  // Adaptado para consumir la nueva estructura: { datosCriminalidad }
  const crimeStats = riskResults?.datosCriminalidad || null;
  
  console.log("🚨 DEBUG CrimeIncidencePanel:");
  console.log("📊 riskResults completo:", riskResults);
  console.log("📊 riskResults.datosCriminalidad:", riskResults?.datosCriminalidad);
  console.log("📊 riskResults.datos_criminalidad:", riskResults?.datos_criminalidad);
  console.log("📊 riskResults.crime_data:", riskResults?.crime_data);
  console.log("🎯 crimeStats final:", crimeStats);
  
  if (!crimeStats) {
    return (
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalPolice sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              📊 Incidencia Delictiva Local
            </Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            No hay datos de incidencia delictiva disponibles para esta ubicación.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Función para determinar el nivel de riesgo basado en porcentaje
  const getRiskLevel = (percentage) => {
    if (percentage >= 20) return { level: 'ALTO', color: 'error', icon: <TrendingUp /> };
    if (percentage >= 10) return { level: 'MEDIO', color: 'warning', icon: <Warning /> };
    if (percentage >= 5) return { level: 'BAJO-MEDIO', color: 'info', icon: <TrendingDown /> };
    return { level: 'BAJO', color: 'success', icon: <TrendingDown /> };
  };

  // Preparar datos para el gráfico
  const chartData = [
    { name: 'Robo', value: crimeStats.robo || 0, color: '#ff7300' },
    { name: 'Homicidio', value: crimeStats.homicidio || 0, color: '#d32f2f' },
    { name: 'Extorsión', value: crimeStats.extorsion || 0, color: '#f57c00' }
  ];

  const riskLevel = getRiskLevel(Math.max(crimeStats.robo || 0, crimeStats.homicidio || 0, crimeStats.extorsion || 0));

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocalPolice sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            📊 Incidencia Delictiva Local
          </Typography>
          <Chip 
            label={riskLevel.level}
            color={riskLevel.color}
            size="small"
            icon={riskLevel.icon}
            sx={{ ml: 2 }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Información de fuente y confiabilidad */}
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Fuente:</strong> {crimeStats.fuente || 'Datos oficiales SESNSP'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Confiabilidad:</strong> 
              <Chip 
                label={crimeStats.confiabilidad || 'MEDIUM'} 
                color={crimeStats.confiabilidad === 'HIGH' ? 'success' : 'default'}
                size="small" 
                sx={{ ml: 1 }}
              />
            </Typography>
            {crimeStats.total_delitos && (
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Total delitos registrados:</strong> {crimeStats.total_delitos.toLocaleString()}
              </Typography>
            )}
          </Grid>

          {/* Estadísticas principales */}
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell><Security color="error" sx={{ mr: 1 }} />Robo</TableCell>
                    <TableCell align="right">
                      <strong>{crimeStats.robo}%</strong>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(crimeStats.robo, 100)} 
                        color="error"
                        sx={{ mt: 1, height: 6 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Warning color="error" sx={{ mr: 1 }} />Homicidio</TableCell>
                    <TableCell align="right">
                      <strong>{crimeStats.homicidio}%</strong>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(crimeStats.homicidio, 100)} 
                        color="error"
                        sx={{ mt: 1, height: 6 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Assessment color="warning" sx={{ mr: 1 }} />Extorsión</TableCell>
                    <TableCell align="right">
                      <strong>{crimeStats.extorsion}%</strong>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(crimeStats.extorsion, 100)} 
                        color="warning"
                        sx={{ mt: 1, height: 6 }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Gráfico de barras */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              📊 Distribución de Incidencias
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Incidencia']} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            💡 <strong>Análisis:</strong> Los datos mostrados representan porcentajes de incidencia delictiva 
            basados en registros oficiales del SESNSP y análisis estadístico de la zona geográfica consultada.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CrimeIncidencePanel;
