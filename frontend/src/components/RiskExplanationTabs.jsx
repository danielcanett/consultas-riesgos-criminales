import React from "react";
import { 
  Tabs, Tab, Box, Typography, Link, List, ListItem, ListItemText, 
  Card, CardContent, Divider, Chip
} from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`risk-tabpanel-${index}`}
      aria-labelledby={`risk-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Función para procesar texto y convertir URLs en enlaces clickeables
function processTextWithLinks(text) {
  if (!text) return null;
  
  // Dividir el texto en líneas
  const lines = text.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Buscar URLs (https://, http://, DOI:)
    const urlRegex = /(https?:\/\/[^\s\)]+|DOI:\s*https?:\/\/[^\s\)]+)/g;
    const emailRegex = /(mailto:[^\s\)]+)/g;
    
    // Si la línea contiene URLs
    if (urlRegex.test(line) || emailRegex.test(line)) {
      const parts = line.split(/(https?:\/\/[^\s\)]+|DOI:\s*https?:\/\/[^\s\)]+|mailto:[^\s\)]+)/);
      
      return (
        <Typography key={lineIndex} component="div" sx={{ mb: 1 }}>
          {parts.map((part, partIndex) => {
            if (part.match(/^https?:\/\//) || part.match(/^DOI:\s*https?:\/\//)) {
              const url = part.replace(/^DOI:\s*/, '');
              const displayText = part.match(/^DOI:/) ? part : part;
              return (
                <Link
                  key={partIndex}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: "primary.main", 
                    textDecoration: "underline",
                    fontWeight: part.match(/^DOI:/) ? "bold" : "normal"
                  }}
                >
                  {displayText}
                </Link>
              );
            } else if (part.match(/^mailto:/)) {
              return (
                <Link
                  key={partIndex}
                  href={part}
                  sx={{ color: "primary.main", textDecoration: "underline" }}
                >
                  {part.replace('mailto:', '')}
                </Link>
              );
            } else {
              return <span key={partIndex}>{part}</span>;
            }
          })}
        </Typography>
      );
    } else {
      // Línea sin URLs
      return (
        <Typography key={lineIndex} sx={{ mb: line.trim() === '' ? 1 : 0.5 }}>
          {line || '\u00A0'}
        </Typography>
      );
    }
  });
}

export default function RiskExplanationTabs({ results }) {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="FÓRMULAS MATEMÁTICAS" />
        <Tab label="FUENTES CRIMINALES" />
        <Tab label="TEORÍAS CRIMINOLÓGICAS" />
      </Tabs>
      
      <TabPanel value={tab} index={0}>
        <Card elevation={3} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
              📊 Metodología de Cálculo de Riesgo ASIS International
            </Typography>
            <Chip 
              label="Validado Académicamente" 
              color="success" 
              size="small" 
              sx={{ mb: 2 }}
            />
            <Box sx={{ backgroundColor: "#f8f9fa", p: 2, borderRadius: 1, mb: 2 }}>
              {(results?.results?.formulas || results?.formulas) ? 
                processTextWithLinks(results?.results?.formulas || results?.formulas) : 
                <Typography>Cargando fórmulas matemáticas...</Typography>
              }
            </Box>
          </CardContent>
        </Card>
      </TabPanel>
      
      <TabPanel value={tab} index={1}>
        <Card elevation={3} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
              🗂️ Fuentes de Datos y Bases de Información Oficiales
            </Typography>
            <Chip 
              label="Fuentes Verificadas" 
              color="info" 
              size="small" 
              sx={{ mb: 2 }}
            />
            {(results?.results?.sources || results?.sources) ? (
              <List>
                {(results?.results?.sources || results?.sources).map((source, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        <Link 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ 
                            color: "primary.main", 
                            textDecoration: "none",
                            '&:hover': { textDecoration: "underline" }
                          }}
                        >
                          🔗 {source.name}
                        </Link>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {source.description}
                      </Typography>
                      <Chip 
                        label="Fuente Oficial" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </List>
            ) : (
              <Typography>Cargando fuentes de datos...</Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>
      
      <TabPanel value={tab} index={2}>
        <Card elevation={3} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
              📚 Fundamentación Teórica y Criminológica
            </Typography>
            <Chip 
              label="Respaldo Académico" 
              color="secondary" 
              size="small" 
              sx={{ mb: 2 }}
            />
            <Box sx={{ backgroundColor: "#f8f9fa", p: 2, borderRadius: 1 }}>
              {(results?.results?.theories || results?.theories) ? 
                processTextWithLinks(results?.results?.theories || results?.theories) : 
                <Typography>Cargando teorías criminológicas...</Typography>
              }
            </Box>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
}