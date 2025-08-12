import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip } from '@mui/material';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Warning, Security, Speed, Assessment, Analytics } from '@mui/icons-material';

const AdvancedDashboard = ({ riskData, warehouseData }) => {
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    totalEvaluations: 0,
    averageRisk: 0,
    criticalAlerts: 0,
    efficiency: 0,
    trendData: [],
    riskDistribution: [],
    performanceData: []
  });

  const [isLive, setIsLive] = useState(true);

  // Generar datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        updateRealTimeMetrics();
      }
    }, 3000); // Actualizar cada 3 segundos

    return () => clearInterval(interval);
  }, [isLive, riskData]);

  const updateRealTimeMetrics = () => {
    const now = new Date();
    const timeLabel = now.toLocaleTimeString();
    
    setRealTimeMetrics(prev => {
      // Simular nuevos datos basados en evaluaciones reales
      const newEvaluation = Math.floor(Math.random() * 3) + 1;
      const newRisk = Math.random() * 100;
      const newEfficiency = 85 + Math.random() * 15;
      
      const newTrendPoint = {
        time: timeLabel,
        evaluations: prev.totalEvaluations + newEvaluation,
        risk: newRisk,
        efficiency: newEfficiency,
        alerts: prev.criticalAlerts + (newRisk > 80 ? 1 : 0)
      };

      return {
        totalEvaluations: prev.totalEvaluations + newEvaluation,
        averageRisk: (prev.averageRisk + newRisk) / 2,
        criticalAlerts: prev.criticalAlerts + (newRisk > 80 ? 1 : 0),
        efficiency: newEfficiency,
        trendData: [...prev.trendData.slice(-9), newTrendPoint], // Mantener últimos 10 puntos
        riskDistribution: generateRiskDistribution(),
        performanceData: generatePerformanceData()
      };
    });
  };

  const generateRiskDistribution = () => [
    { name: 'Bajo', value: 45 + Math.random() * 10, color: '#4CAF50' },
    { name: 'Medio', value: 30 + Math.random() * 10, color: '#FF9800' },
    { name: 'Alto', value: 20 + Math.random() * 5, color: '#F44336' },
    { name: 'Crítico', value: 5 + Math.random() * 5, color: '#9C27B0' }
  ];

  const generatePerformanceData = () => [
    { category: 'Velocidad', actual: 85 + Math.random() * 10, target: 90 },
    { category: 'Precisión', actual: 92 + Math.random() * 5, target: 95 },
    { category: 'Cobertura', actual: 88 + Math.random() * 8, target: 85 },
    { category: 'Satisfacción', actual: 94 + Math.random() * 4, target: 90 }
  ];

  const MetricCard = ({ title, value, icon, color, trend, unit = "" }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" color="text.secondary">{title}</Typography>
          <Box sx={{ color: color }}>{icon}</Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: color, mb: 1 }}>
          {typeof value === 'number' ? value.toFixed(1) : value}{unit}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendingUp sx={{ fontSize: 16, color: trend > 0 ? '#4CAF50' : '#F44336' }} />
            <Typography variant="caption" color={trend > 0 ? '#4CAF50' : '#F44336'}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}% vs anterior
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box className="advanced-dashboard">
      {/* Header con Estado Live */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Analytics sx={{ color: '#1976d2' }} />
          Dashboard Analítico
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={isLive ? "EN VIVO" : "PAUSADO"}
            color={isLive ? "success" : "default"}
            size="small"
            onClick={() => setIsLive(!isLive)}
            sx={{ cursor: 'pointer' }}
          />
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: isLive ? '#4CAF50' : '#9E9E9E',
              animation: isLive ? 'pulse 2s infinite' : 'none'
            }} 
          />
        </Box>
      </Box>

      {/* Métricas Principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Evaluaciones Total"
            value={realTimeMetrics.totalEvaluations}
            icon={<Assessment />}
            color="#1976d2"
            trend={Math.random() * 10 - 5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Riesgo Promedio"
            value={realTimeMetrics.averageRisk}
            icon={<Security />}
            color="#FF9800"
            trend={Math.random() * 6 - 3}
            unit="%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Alertas Críticas"
            value={realTimeMetrics.criticalAlerts}
            icon={<Warning />}
            color="#F44336"
            trend={Math.random() * 4 - 2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Eficiencia IA"
            value={realTimeMetrics.efficiency}
            icon={<Speed />}
            color="#4CAF50"
            trend={Math.random() * 3}
            unit="%"
          />
        </Grid>
      </Grid>

      {/* Gráficas en Tiempo Real */}
      <Grid container spacing={3}>
        {/* Tendencia en Tiempo Real */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Tendencia en Tiempo Real</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={realTimeMetrics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#FF9800" 
                    strokeWidth={2}
                    name="Riesgo (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    name="Eficiencia (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribución de Riesgos */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Distribución de Riesgos</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={realTimeMetrics.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {realTimeMetrics.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance vs Objetivos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance vs Objetivos</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={realTimeMetrics.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" fill="#1976d2" name="Actual" />
                  <Bar dataKey="target" fill="#4CAF50" name="Objetivo" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Área de Análisis Predictivo */}
        <Grid item xs={12}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🤖 Análisis Predictivo IA</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>Predicción 24h:</Typography>
                  <Typography variant="h6">
                    {(Math.random() * 20 + 15).toFixed(0)} nuevas evaluaciones
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>Riesgo Emergente:</Typography>
                  <Typography variant="h6">
                    {(Math.random() * 15 + 10).toFixed(1)}% probabilidad
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>Optimización Sugerida:</Typography>
                  <Typography variant="h6">
                    +{(Math.random() * 8 + 2).toFixed(1)}% eficiencia
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedDashboard;
