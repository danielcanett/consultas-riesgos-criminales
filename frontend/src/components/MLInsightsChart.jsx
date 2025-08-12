import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MLInsightsChart = ({ analysisData }) => {
  // Extraer los datos ML desde la estructura correcta
  const extractMLData = () => {
    if (!analysisData) return null;
    
    // Si viene envuelto desde RiskAssessmentForm
    if (analysisData.results) {
      return analysisData.results;
    }
    
    // Si viene directo
    return analysisData;
  };

  const mlData = extractMLData();

  if (!mlData || !mlData.analisis_hibrido) {
    return null;
  }

  const { analisis_hibrido } = mlData;
  
  // Datos para el gráfico circular de ponderación ML
  const ponderacionData = [
    {
      name: 'Histórico ML',
      value: 40,
      realValue: analisis_hibrido.riesgo_historico_ml || 0,
      color: '#4CAF50'
    },
    {
      name: 'Gubernamental',
      value: 30,
      realValue: analisis_hibrido.riesgo_gubernamental || 0,
      color: '#2196F3'
    },
    {
      name: 'Movimientos Sociales',
      value: 20,
      realValue: analisis_hibrido.riesgo_movimientos_sociales || 0,
      color: '#FF9800'
    },
    {
      name: 'Escenarios',
      value: 10,
      realValue: 0, // Los escenarios no están implementados
      color: '#9C27B0'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {data.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Ponderación: {data.value}%
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Valor Real: {data.realValue.toFixed(1)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ 
          color: '#1976d2', 
          fontWeight: 'bold',
          borderBottom: '2px solid #e3f2fd',
          paddingBottom: 1,
          marginBottom: 2
        }}>
          🧠 Análisis Híbrido ML
        </Typography>
        
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ponderacionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {ponderacionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary" align="center">
            {analisis_hibrido.ponderacion || "Histórico ML 40% + Gubernamental 30% + Movimientos 20% + Escenarios 10%"}
          </Typography>
        </Box>

        {/* Factores adicionales */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box sx={{ textAlign: 'center', minWidth: '45%' }}>
            <Typography variant="caption" color="textSecondary">
              Factor Estacional
            </Typography>
            <Typography variant="h6" color="primary">
              {(analisis_hibrido.factor_estacional || 1.0).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', minWidth: '45%' }}>
            <Typography variant="caption" color="textSecondary">
              Factor Protección ML
            </Typography>
            <Typography variant="h6" color="success.main">
              {(analisis_hibrido.factor_proteccion_ml || 1.0).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MLInsightsChart;
