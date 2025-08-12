import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const DebugResults = ({ riskResults }) => {
  console.log("🔍 DEBUG - riskResults completo:", riskResults);
  
  // Función para extraer summaryData
  const extractSummaryData = () => {
    if (riskResults?.results?.results?.summary) {
      return riskResults.results.results.summary;
    } else if (riskResults?.results?.summary) {
      return riskResults.results.summary;
    } else if (riskResults?.summary) {
      return riskResults.summary;
    } else if (Array.isArray(riskResults)) {
      return riskResults;
    } else {
      return [];
    }
  };

  const summaryData = extractSummaryData();
  console.log("🔍 DEBUG - summaryData extraído:", summaryData);

  if (!summaryData || summaryData.length === 0) {
    return (
      <Card sx={{ mt: 2, p: 2, bgcolor: 'error.main', color: 'white' }}>
        <CardContent>
          <Typography variant="h6">❌ Sin Resultados de Riesgo</Typography>
          <Typography variant="body2">
            No se pudieron extraer datos de riesgo. Revisa la consola para más detalles.
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              Estructura recibida: {JSON.stringify(riskResults, null, 2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 2, p: 2, bgcolor: 'success.main', color: 'white' }}>
      <CardContent>
        <Typography variant="h6">✅ Resultados de Riesgo Detectados</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Se encontraron {summaryData.length} resultado(s) de análisis de riesgo.
        </Typography>
        
        {summaryData.map((item, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
            <Typography variant="h6">📍 {item.escenario || 'Escenario no definido'}</Typography>
            <Typography variant="body2">
              <strong>Ubicación:</strong> {item.address || 'No especificada'}
            </Typography>
            <Typography variant="body2">
              <strong>Probabilidad:</strong> {item.probabilidad || 'No calculada'}
            </Typography>
            <Typography variant="body2">
              <strong>Nivel de Riesgo:</strong> {item.nivel_riesgo || 'No definido'}
            </Typography>
            <Typography variant="body2">
              <strong>Reducción por Medidas:</strong> {item.reduccion_medidas || 0}%
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default DebugResults;
