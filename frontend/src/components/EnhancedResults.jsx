import React from 'react';
import { 
  Box, Typography, Card, CardContent, Button, Tooltip, IconButton, Grid
} from '@mui/material';
import { 
  LocationOn, Error as ErrorIcon, GetApp, HelpOutline
} from '@mui/icons-material';
import RiskResultsTable from './RiskResultsTable';
import CrimeIncidencePanel from './CrimeIncidencePanel';


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const EnhancedResults = ({ riskResults }) => {
  // DEBUG: Ver estructura completa de datos recibidos
  console.log("🔍 ENHANCED RESULTS - Datos recibidos:", riskResults);
  console.log("🔍 ENHANCED RESULTS - Tipo de riskResults:", typeof riskResults);
  console.log("🔍 ENHANCED RESULTS - Keys de riskResults:", riskResults ? Object.keys(riskResults) : 'No data');
  
  // Adaptado para consumir la nueva estructura: { summary, datosCriminalidad, ... }
  const summaryData = riskResults?.summary || [];
  const motorUsado = riskResults?.motor || null;
  
  // Función para exportar a PDF
  const handleExportToPDF = async () => {
    const element = document.getElementById('results-container');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`analisis_riesgo_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Intenta nuevamente.');
    }
  };

  // Validar y procesar datos
  console.log("🔍 VALIDACIÓN - riskResults existe:", !!riskResults);
  console.log("🔍 VALIDACIÓN - riskResults.results existe:", !!(riskResults?.results));
  console.log("🔍 VALIDACIÓN - riskResults.summary existe:", !!(riskResults?.summary));
  console.log("🔍 VALIDACIÓN - summaryData length:", summaryData?.length);
  
  if (!riskResults || (!riskResults.results && !riskResults.summary && !riskResults.datosCriminalidad)) {
    console.log("🔍 MOSTRANDO 'SIN DATOS' - Razón: No hay riskResults o campos importantes");
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ErrorIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Sin datos para mostrar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Realiza un cálculo de riesgo para ver los resultados aquí
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box id="results-container" sx={{ width: '100%', mb: 4 }}>
      {/* Mostrar motor usado si está presente */}
      {motorUsado && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="secondary">
            Motor usado: <strong>{motorUsado}</strong>
          </Typography>
        </Box>
      )}
      {/* Botón de exportar en la parte superior */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<GetApp />}
          onClick={handleExportToPDF}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
            }
          }}
        >
          Exportar a PDF
        </Button>
      </Box>

      {/* Panel de Incidencia Delictiva con gráficos (solo datos reales) */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CrimeIncidencePanel riskResults={riskResults} />
        </Grid>
        {/* Tabla de resultados tradicional */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Resumen de Análisis
                  </Typography>
                </Box>
                <Tooltip 
                  title="Detalle completo de cada escenario de riesgo evaluado, incluyendo probabilidades calculadas, niveles de riesgo, medidas de seguridad consideradas y recomendaciones específicas para cada situación."
                  arrow
                  placement="top"
                >
                  <IconButton size="small">
                    <HelpOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <RiskResultsTable results={riskResults} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedResults;
