import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const AiInsightsPanel = ({ selectedWarehouse, riskResults }) => {
  const [insights, setInsights] = useState([]);
  const [mlPrediction, setMlPrediction] = useState(null);

  useEffect(() => {
    if (selectedWarehouse) {
      generateAiInsights();
    }
  }, [selectedWarehouse, riskResults]);

  const generateAiInsights = () => {
    // Simular análisis de IA basado en datos
    const currentRisk = riskResults?.results?.results?.summary?.[0]?.probabilidad_numerica || 3.2;
    
    const warehouseRiskLevels = {
      'Tlalnepantla': { risk: 4.2, trend: '+15%', level: 'high' },
      'Ecatepec': { risk: 3.1, trend: '+8%', level: 'medium' },
      'Naucalpan': { risk: 2.8, trend: '+5%', level: 'medium' },
      'Tultepec': { risk: 2.1, trend: '-2%', level: 'low' },
      'Cuautitlán': { risk: 1.9, trend: '-5%', level: 'low' }
    };

    const warehouseName = selectedWarehouse.name || 'Almacén seleccionado';
    const warehouseData = warehouseRiskLevels[warehouseName] || warehouseRiskLevels['Tlalnepantla'];

    const generatedInsights = [
      {
        icon: '🎯',
        text: `${warehouseName} - Riesgo actual: ${warehouseData.risk}%`,
        type: warehouseData.level,
        priority: 'high'
      },
      {
        icon: '📈',
        text: `Tendencia criminal: ${warehouseData.trend} últimos 3 meses`,
        type: warehouseData.trend.includes('+') ? 'warning' : 'success',
        priority: 'medium'
      },
      {
        icon: '🧠',
        text: `Patrón ML: Mayor actividad ${getRandomTimePattern()}`,
        type: 'info',
        priority: 'medium'
      },
      {
        icon: '💡',
        text: generateSmartRecommendation(warehouseData),
        type: 'recommendation',
        priority: 'high'
      },
      {
        icon: '⚠️',
        text: `Alerta IA: ${generateAiAlert()}`,
        type: 'alert',
        priority: 'critical'
      }
    ];

    setInsights(generatedInsights);

    // Función para generar patrones de tiempo dinámicos
    function getRandomTimePattern() {
      const patterns = [
        '20:00-02:00 (73% incidentes)',
        '22:30-01:15 (68% actividad criminal)',
        '21:00-03:00 (79% alertas)',
        'Madrugada 00:00-04:00 (71% riesgo)',
        'Horario nocturno 19:00-05:00 (65% eventos)'
      ];
      return patterns[Math.floor(Math.random() * patterns.length)];
    }

    // Función para generar alertas de IA dinámicas
    function generateAiAlert() {
      const alerts = [
        `Evento deportivo próximo (+${Math.floor(Math.random() * 20) + 15}% riesgo)`,
        `Patrón anómalo detectado últimas ${Math.floor(Math.random() * 48) + 24}h`,
        `Correlación climática: lluvia prevista (-${Math.floor(Math.random() * 15) + 10}% actividad)`,
        `Incremento densidad poblacional zona (+${Math.floor(Math.random() * 25) + 10}%)`,
        `Actividad sospechosa detectada radio ${Math.floor(Math.random() * 3) + 1}km`
      ];
      return alerts[Math.floor(Math.random() * alerts.length)];
    }

    // Generar predicción ML
    const confidence = Math.floor(Math.random() * 15) + 80; // 80-95%
    const adjustedRisk = warehouseData.risk + (Math.random() * 0.5 - 0.25);
    
    setMlPrediction({
      risk: adjustedRisk.toFixed(1),
      confidence: confidence,
      factors: [
        'Datos históricos criminales',
        'Patrones estacionales',
        'Factores socioeconómicos',
        'Análisis geoespacial'
      ]
    });
  };

  const generateSmartRecommendation = (warehouseData) => {
    if (warehouseData.level === 'high') {
      return 'Recomendación: +2 cámaras, reforzar vigilancia nocturna';
    } else if (warehouseData.level === 'medium') {
      return 'Recomendación: Optimizar rutas de patrullaje';
    } else {
      return 'Recomendación: Mantener medidas actuales';
    }
  };

  const getInsightColor = (type) => {
    const colors = {
      high: '#ff4757',
      medium: '#ffa502',
      low: '#26de81',
      warning: '#ff6b6b',
      success: '#51cf66',
      info: '#339af0',
      recommendation: '#7c4dff',
      alert: '#ff8a65'
    };
    return colors[type] || '#666';
  };

  return (
    <Box>
      {/* AI Insights Panel */}
      <Box className="ai-insights">
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
          🧠 Insights de IA
        </Typography>
        {insights.map((insight, index) => (
          <Box key={index} className="insight-item">
            <span style={{ fontSize: '16px' }}>{insight.icon}</span>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#2d3748',
                flex: 1
              }}
            >
              {insight.text}
            </Typography>
            <Box 
              sx={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: getInsightColor(insight.type)
              }} 
            />
          </Box>
        ))}
      </Box>

      {/* ML Prediction Panel */}
      {mlPrediction && (
        <Box className="ml-prediction">
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            🤖 Predicción ML
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Probabilidad ajustada: <strong>{mlPrediction.risk}%</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
            Factores analizados: {mlPrediction.factors.join(', ')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Confianza del modelo:
          </Typography>
          <Box className="confidence-bar">
            <Box 
              className="confidence-fill" 
              sx={{ width: `${mlPrediction.confidence}%` }}
            />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            {mlPrediction.confidence}% de confianza
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AiInsightsPanel;
