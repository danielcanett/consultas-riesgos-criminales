import React from 'react';
import { 
  Box, Typography, Chip, Alert, Paper
} from '@mui/material';
import './RiskCards.css';

const RiskResultsTable = ({ results }) => {
  // Unificar estructura: aceptar tanto { summary, ... } como { results: { summary, ... } }
  let unifiedResults = results;
  if (results && results.results) {
    unifiedResults = results.results;
  }
  // Extraer información científica del backend
  // const scientificInfo = unifiedResults?.metadata?.scientific_metadata || {};
  // const modelValidation = unifiedResults?.metadata?.model_validation || {};
  // const calculationComponents = unifiedResults?.analysis?.calculation_components || {};

  // Detectar si solo hay mensaje informativo y no datos científicos
  const soloMensajeInformativo = unifiedResults?.analysis?.detalle && unifiedResults.analysis.detalle.includes('No se realizó análisis detallado');
  // Adaptado para consumir la nueva estructura: { summary }
  const summaryData = Array.isArray(unifiedResults?.summary) ? unifiedResults.summary : [];
  console.log('🔍 DEBUGGING RiskResultsTable:');
  console.log('📊 unifiedResults completo:', unifiedResults);
  console.log('📋 summaryData extraído:', summaryData);
  console.log('📈 Tiene summary?', !!unifiedResults?.summary);
  console.log('📊 Es array el summary?', Array.isArray(unifiedResults?.summary));
  console.log('📏 Longitud del array summary:', summaryData.length);
  // ...existing code...
  return (
    <Box>
      {soloMensajeInformativo ? (
        <Alert severity="info" sx={{ mt: 4, mb: 4 }}>
          {unifiedResults.analysis.detalle}
        </Alert>
      ) : (
        <>
          {/* Leyenda compacta */}
          <Box className="compact-legend">
            <Box className="legend-title" sx={{ fontWeight: 600, fontSize: '1rem', mb: 1 }}>
              🎯 Niveles de Riesgo
            </Box>
            <Box className="legend-chips" display="flex" gap={1} mt={1}>
              <Chip label="BAJO" color="success" size="small" />
              <Chip label="MEDIO-BAJO" color="info" size="small" />
              <Chip label="MEDIO" color="warning" size="small" />
              <Chip label="ALTO" color="error" size="small" />
              <Chip label="CRÍTICO" color="error" size="small" />
            </Box>
          </Box>
          {/* Resumen de Análisis */}
          <Box className="analysis-summary" mt={3}>
            <Typography variant="h6" color="primary" gutterBottom>
              Resumen de Análisis
            </Typography>
            {/* Mostrar análisis científico si existe summaryData */}
            {Array.isArray(summaryData) && summaryData.length > 0 ? (
              <>
                {summaryData.map((item, idx) => (
                  <Paper key={idx} elevation={2} sx={{ p: 2, mb: 2 }}>
                    {item.motor_usado && (
                      <Typography variant="subtitle2" color="secondary">
                        Motor usado: <strong>{item.motor_usado}</strong>
                      </Typography>
                    )}
                    <Typography variant="subtitle1" color="textSecondary">
                      Escenario: <strong>{item.escenario}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Dirección: {item.address}
                    </Typography>
                    <Typography variant="body2">
                      Probabilidad: <strong>{item.probabilidad}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Medidas de Seguridad: <strong>{item.medidas_seguridad_count}</strong>
                    </Typography>
                    {item.riesgo_general !== undefined && (
                      <Typography variant="body2">
                        Riesgo General: <strong>{item.riesgo_general}%</strong>
                      </Typography>
                    )}
                  </Paper>
                ))}
              </>
            ) : summaryData && summaryData.length === 0 ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  ⚠️ El análisis científico fue recibido pero el array summary está vacío.
                </Alert>
                {unifiedResults && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      🔍 Debug - Datos recibidos del backend:
                    </Typography>
                    <Box component="pre" sx={{ fontSize: '0.8rem', overflow: 'auto', maxHeight: '200px' }}>
                      {JSON.stringify(unifiedResults, null, 2)}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No hay datos de resumen disponibles.
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default RiskResultsTable;


