import React, { useState } from "react";
import { 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Typography, 
  TextField, 
  Paper,
  Box,
  Grid,
  Badge,
  useTheme,
  CardContent,
  Collapse,
  IconButton,
  Radio,
  RadioGroup
} from "@mui/material";
import { 
  Security as SecurityIcon,
  Warning as WarningIcon,
  LocationOn as LocationIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  SelectAll as SelectAllIcon,
  DeselectOutlined as DeselectIcon
} from "@mui/icons-material";
import { useTheme as useCustomTheme } from './ThemeContext';
import { consultarRiesgoNuevo } from '../api/riskApi';

const escenariosDefault = [
  // Escenarios Tradicionales
  "Intrusión armada con objetivo de robo",
  "Bloqueo de movimientos sociales",
  "Vandalismo",
  "Robo interno",
  
  // Escenarios Avanzados basados en Criminología
  "Robo de mercancía en tránsito (modalidad express)",
  "Secuestro de vehículos de reparto",
  "Asalto durante horarios de carga/descarga", 
  "Sabotaje a instalaciones críticas",
  "Robo con violencia a empleados",
  "Intrusión nocturna sin confrontación",
  "Robo hormiga (pérdidas menores sistemáticas)",
  "Extorsión a transportistas",
  "Daños por manifestaciones o disturbios",
  "Robo de información confidencial/datos",
  "Asalto en estacionamientos",
  "Robo de combustible de vehículos",
  "Intrusión para ocupación ilegal del terreno",
  "Robo de equipos tecnológicos/computadoras",
  "Asalto a personal administrativo"
];

const medidasDefault = [
  // Medidas Básicas Actuales
  "Cámaras de seguridad",
  "Guardias de seguridad", 
  "Sistemas de intrusión",
  "Control de acceso",
  "Iluminación perimetral",
  
  // Medidas Específicas de Mercado Libre
  "Portones con pistones automáticos",
  "Plumas de acceso vehicular",
  "Bolardos retráctiles/fijos",
  "Poncha llantas en accesos",
  "Casetas de seguridad",
  "Cámaras en puntos de acceso",
  "Torniquetes de cuerpo completo",
  "Sistema RFID para acceso (badges)",
  "Radios de comunicación para guardias",
  "Centro de monitoreo 24/7",
  "Botones de pánico distribuidos",
  "Bardas perimetrales reforzadas",
  
  // Medidas Avanzadas basadas en ASIS
  "Sensores de movimiento perimetrales",
  "Detectores de metales en accesos",
  "Sistema de videoanalítica con IA",
  "Patrullajes aleatorios programados",
  "Iluminación LED con sensores",
  "Sistemas de comunicación redundantes",
  "Protocolos de verificación biométrica",
  "Cercas electrificadas",
  "Sistemas anti-drones",
  "Monitoreo sísmico perimetral",
  "Control de acceso por zonas",
  "Sistema de evacuación automatizado",
  "Protocolos de lockdown",
  "Coordinación con autoridades locales",
  "Sistema de alerta temprana comunitario"
];

// Mapeos para el backend
const escenarioMap = {
  // Escenarios Tradicionales
  "Intrusión armada con objetivo de robo": "intrusion_armada",
  "Bloqueo de movimientos sociales": "bloqueo_social", 
  "Vandalismo": "vandalismo",
  "Robo interno": "robo_interno",
  
  // Escenarios Avanzados
  "Robo de mercancía en tránsito (modalidad express)": "robo_transito",
  "Secuestro de vehículos de reparto": "secuestro_vehiculos",
  "Asalto durante horarios de carga/descarga": "asalto_operativo",
  "Sabotaje a instalaciones críticas": "sabotaje_instalaciones",
  "Robo con violencia a empleados": "robo_violencia",
  "Intrusión nocturna sin confrontación": "intrusion_nocturna",
  "Robo hormiga (pérdidas menores sistemáticas)": "robo_hormiga",
  "Extorsión a transportistas": "extorsion_transporte",
  "Daños por manifestaciones o disturbios": "danos_manifestaciones",
  "Robo de información confidencial/datos": "robo_datos",
  "Asalto en estacionamientos": "asalto_estacionamiento",
  "Robo de combustible de vehículos": "robo_combustible",
  "Intrusión para ocupación ilegal del terreno": "ocupacion_ilegal",
  "Robo de equipos tecnológicos/computadoras": "robo_tecnologia",
  "Asalto a personal administrativo": "asalto_administrativo"
};

const medidasMap = {
  // Medidas Básicas
  "Cámaras de seguridad": "camaras",
  "Guardias de seguridad": "guardias",
  "Sistemas de intrusión": "sistemas_intrusion",
  "Control de acceso": "control_acceso",
  "Iluminación perimetral": "iluminacion",
  
  // Medidas Específicas ML
  "Portones con pistones automáticos": "portones_automaticos",
  "Plumas de acceso vehicular": "plumas_acceso",
  "Bolardos retráctiles/fijos": "bolardos",
  "Poncha llantas en accesos": "poncha_llantas",
  "Casetas de seguridad": "casetas_seguridad",
  "Cámaras en puntos de acceso": "camaras_acceso",
  "Torniquetes de cuerpo completo": "torniquetes",
  "Sistema RFID para acceso (badges)": "rfid_acceso",
  "Radios de comunicación para guardias": "radios_comunicacion",
  "Centro de monitoreo 24/7": "centro_monitoreo",
  "Botones de pánico distribuidos": "botones_panico",
  "Bardas perimetrales reforzadas": "bardas_perimetrales",
  
  // Medidas Avanzadas
  "Sensores de movimiento perimetrales": "sensores_movimiento",
  "Detectores de metales en accesos": "detectores_metales",
  "Sistema de videoanalítica con IA": "videoanalytica_ia",
  "Patrullajes aleatorios programados": "patrullajes_aleatorios",
  "Iluminación LED con sensores": "iluminacion_inteligente",
  "Sistemas de comunicación redundantes": "comunicacion_redundante",
  "Protocolos de verificación biométrica": "verificacion_biometrica",
  "Cercas electrificadas": "cercas_electrificadas",
  "Sistemas anti-drones": "anti_drones",
  "Monitoreo sísmico perimetral": "monitoreo_sismico",
  "Control de acceso por zonas": "acceso_por_zonas",
  "Sistema de evacuación automatizado": "evacuacion_automatizada",
  "Protocolos de lockdown": "protocolos_lockdown",
  "Coordinación con autoridades locales": "coordinacion_autoridades",
  "Sistema de alerta temprana comunitario": "alerta_temprana"
};

// Función para calcular nivel de vulnerabilidad basado en medidas de seguridad
const calculateVulnerabilityLevel = (medidasCount) => {
  if (medidasCount >= 20) return "BAJA";
  if (medidasCount >= 10) return "MEDIA";
  if (medidasCount >= 5) return "ALTA";
  return "CRÍTICA";
};

function RiskAssessmentForm({ warehouse, onRiskCalculated }) {
  const muiTheme = useTheme();
  const { isDarkMode } = useCustomTheme();
  const [escenarioSeleccionado, setEscenarioSeleccionado] = useState(0); // Solo un escenario seleccionado
  const [medidas, setMedidas] = useState(medidasDefault.map(() => true));
  
  // Estados para las pestañas desplegables
  const [escenariosExpanded, setEscenariosExpanded] = useState(false);
  const [medidasExpanded, setMedidasExpanded] = useState(false);

  const handleEscenariosToggle = () => {
    setEscenariosExpanded(!escenariosExpanded);
  };

  const handleMedidasToggle = () => {
    setMedidasExpanded(!medidasExpanded);
  };

  const handleEscenarioChange = (event) => {
    setEscenarioSeleccionado(parseInt(event.target.value));
  };

  const handleMedidasChange = idx => {
    const newMedidas = [...medidas];
    newMedidas[idx] = !newMedidas[idx];
    setMedidas(newMedidas);
  };

  const handleSeleccionarTodasMedidas = () => {
    setMedidas(medidasDefault.map(() => true));
  };

  const handleDeseleccionarTodasMedidas = () => {
    setMedidas(medidasDefault.map(() => false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== INICIANDO CALCULO DE RIESGO ===");
    console.log("Warehouse seleccionado:", warehouse);
    
    // Validación del warehouse
    if (!warehouse) {
      alert("Por favor seleccione un almacén antes de calcular el riesgo.");
      return;
    }
    
    const escenariosSeleccionados = [escenarioMap[escenariosDefault[escenarioSeleccionado]]];
    const medidasSeleccionadas = medidasDefault
      .filter((_, i) => medidas[i])
      .map(med => medidasMap[med]);
      
    console.log("=== DEBUG ESCENARIO ===");
    console.log("Índice seleccionado:", escenarioSeleccionado);
    console.log("Escenario texto:", escenariosDefault[escenarioSeleccionado]);
    console.log("Escenario mapeado:", escenarioMap[escenariosDefault[escenarioSeleccionado]]);
    console.log("Escenarios seleccionados:", escenariosSeleccionados);
    console.log("Medidas seleccionadas:", medidasSeleccionadas);
    
    try {
      console.log("Detectando tipo de almacén...");
      let data;
      
      // USAR SIEMPRE EL ENDPOINT PRINCIPAL - El backend decide qué motor usar
      console.log("🔀 Usando endpoint principal - backend decidirá el motor apropiado");
      
      // Para almacenes ML, incluir el código en la dirección para que el backend lo detecte
      let address = warehouse.address || "Dirección no disponible";
      let warehouse_code = null;
      
      if (warehouse.id && warehouse.type === 'fulfillment') {
        warehouse_code = warehouse.id;  // Guardamos el código para usarlo después
        address = `${warehouse.id} - ${address}`;
        console.log("🏭 Almacén ML detectado, código:", warehouse_code, "dirección:", address);
      }
      

      // Mapeo robusto por código de almacén ML (igual que en MLSpecializedPage.jsx)
      const mapeoAlmacenes = {
        'MXCD02': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXCD05': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXCD06': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXCD07': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXCD08': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXCD09': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXCD11': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXCD14': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXRC03': { municipio: 'Tepotzotlán', estado: 'México' },
        'MXCD10': { municipio: 'Zempoala', estado: 'Hidalgo' },
        'MXCD12': { municipio: 'Tepeapulco', estado: 'Hidalgo' },
        'MXCD13': { municipio: 'Actopan', estado: 'Hidalgo' },
        'MXNL01': { municipio: 'Monterrey', estado: 'Nuevo León' },
        'MXNL02': { municipio: 'Monterrey', estado: 'Nuevo León' },
        'MXJL01': { municipio: 'Guadalajara', estado: 'Jalisco' },
        'MXJL02': { municipio: 'Guadalajara', estado: 'Jalisco' },
        'MXGT01': { municipio: 'León', estado: 'Guanajuato' },
      };
      let municipio = '';
      let estado = '';
      // Si el almacén es ML y tiene código oficial, usar mapeo robusto
      if (warehouse.id && warehouse.type === 'fulfillment' && mapeoAlmacenes[warehouse.id]) {
        municipio = mapeoAlmacenes[warehouse.id].municipio;
        estado = mapeoAlmacenes[warehouse.id].estado;
      } else {
        // Fallback: usar el mapeo anterior si no es ML
        const mapeoMunicipios = {
          'TEPOTZOTLAN': 'Tepotzotlán',
          'CUAUTITLAN IZCALLI': 'Tepotzotlán',
          'SAN BUENAVENTURA': 'Tepotzotlán',
          'TOLUCA': 'Tepotzotlán',
          'TECÁMAC': 'Tecámac',
          'LOS REYES LA PAZ': 'Los Reyes La Paz',
          'FRACCIONAMIENTO INDUSTRIAL SAN ANTONIO': 'Tepotzotlán',
          'FRACCIONAMIENTO SAN BUENAVENTURA': 'Tepotzotlán',
          'TULTITLAN': 'Tultitlán',
          'CUAUTITLAN': 'Cuautitlán',
          'ZEMPOALA': 'Zempoala',
          'TEPEAPULCO': 'Tepeapulco',
          'ACTOPAN': 'Actopan',
          'APODACA': 'Monterrey',
          'GARCÍA': 'Monterrey',
          'GUADALAJARA': 'Guadalajara',
          'TLAQUEPAQUE': 'Guadalajara',
          'LEÓN': 'León',
        };
        const mapeoEstados = {
          'ESTADO DE MEXICO': 'Estado de México',
          'MEXICO': 'Estado de México',
          'HIDALGO': 'Hidalgo',
          'NUEVO LEON': 'Nuevo León',
          'JALISCO': 'Jalisco',
          'GUANAJUATO': 'Guanajuato',
        };
        // Buscar municipio en address
        if (warehouse.address) {
          const addressUpper = warehouse.address.toUpperCase();
          Object.keys(mapeoMunicipios).forEach((key) => {
            if (addressUpper.includes(key)) {
              municipio = mapeoMunicipios[key];
            }
          });
        }
        // Si no se detecta, usar region como fallback
        if (!municipio && warehouse.region) {
          municipio = warehouse.region;
        }
        // Estado oficial
        const regionUpper = (warehouse.region || '').toUpperCase();
        estado = mapeoEstados[regionUpper] || warehouse.region || '';
      }

      const payload = {
        address: address,
        ambito: warehouse.ambito || "urbano",
        scenarios: escenariosSeleccionados,
        security_measures: medidasSeleccionadas,
        comments: ""
      };
      
      console.log("=== PAYLOAD ENVIADO AL BACKEND (LIMPIO) ===");
      console.log("🧹 Payload sin campos extra:");
      console.log(JSON.stringify(payload, null, 2));
      data = await consultarRiesgoNuevo(payload);
      
      console.log("=== RESPUESTA RECIBIDA DEL BACKEND ===");
      console.log(JSON.stringify(data, null, 2));
      console.log("Estructura de data:", data);
      
      // Enviar la respuesta del backend tal cual (estructura nueva)
      if (data && (data.summary || data.datosCriminalidad || data.results)) {
        console.log("✅ Enviando datos válidos al componente padre");
        if (onRiskCalculated) onRiskCalculated(data);
        return;
      } else {
        console.log("❌ No se encontraron resultados, enviando estructura vacía");
        if (onRiskCalculated) onRiskCalculated({ 
          results: { summary: [], datos_criminalidad: null }, 
          summary: [], 
          datosCriminalidad: null 
        });
      }
    } catch (error) {
      console.error("=== ERROR EN CALCULO ===");
      console.error("Error al consultar riesgo:", error);
      console.error("Stack trace:", error.stack);
      onRiskCalculated({ 
        results: { summary: [], datos_criminalidad: null }, 
        summary: [], 
        datosCriminalidad: null 
      });
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{ 
        mb: 3, 
        bgcolor: isDarkMode ? '#1a1a2e' : 'white',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Encabezado del warehouse */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationIcon sx={{ mr: 2, fontSize: 28, color: 'text.primary' }} />
          <Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              {warehouse?.name || "Almacén no seleccionado"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {warehouse?.address || "Dirección no disponible"}
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Sección de Escenarios de Riesgo */}
          <Paper 
            elevation={1}
            sx={{ 
              mb: 3,
              bgcolor: isDarkMode ? '#2d2d44' : '#f8fafc',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
            }}
          >
            <Box sx={{ p: 3, pb: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  mb: 2
                }}
                onClick={handleEscenariosToggle}
              >
                <WarningIcon sx={{ mr: 2, color: 'error.main' }} />
                <Typography variant="h6" color="text.primary" fontWeight="600">
                  Escenarios de Riesgo
                </Typography>
                <Badge 
                  badgeContent={1} 
                  color="error" 
                  sx={{ ml: 2 }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <IconButton size="small">
                  {escenariosExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={escenariosExpanded}>
                <RadioGroup 
                  value={escenarioSeleccionado} 
                  onChange={handleEscenarioChange}
                >
                  <Grid container spacing={1}>
                    {escenariosDefault.map((esc, idx) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={esc}>
                        <Box
                          sx={{ 
                            p: 1.5,
                            borderRadius: 1,
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                            },
                            bgcolor: escenarioSeleccionado === idx 
                              ? (isDarkMode ? 'rgba(244,67,54,0.1)' : '#ffebee') 
                              : 'transparent',
                            border: '1px solid',
                            borderColor: escenarioSeleccionado === idx 
                              ? '#f44336' 
                              : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')
                          }}
                          onClick={() => setEscenarioSeleccionado(idx)}
                        >
                          <FormControlLabel
                            value={idx}
                            control={
                              <Radio
                                sx={{ 
                                  '&.Mui-checked': { 
                                    color: '#f44336' 
                                  } 
                                }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                {esc}
                              </Typography>
                            }
                            sx={{ margin: 0, width: '100%', pointerEvents: 'none' }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </Collapse>
            </Box>
          </Paper>

          {/* Sección de Medidas de Seguridad */}
          <Paper 
            elevation={1}
            sx={{ 
              mb: 3,
              bgcolor: isDarkMode ? '#2d2d44' : '#f8fafc',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'
            }}
          >
            <Box sx={{ p: 3, pb: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  mb: 2
                }}
                onClick={handleMedidasToggle}
              >
                <SecurityIcon sx={{ mr: 2, color: 'success.main' }} />
                <Typography variant="h6" color="text.primary" fontWeight="600">
                  Medidas de Seguridad
                </Typography>
                <Badge 
                  badgeContent={medidas.filter(Boolean).length} 
                  color="success" 
                  sx={{ ml: 2 }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <IconButton size="small">
                  {medidasExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={medidasExpanded}>
                {/* Botones para seleccionar/deseleccionar todas las medidas */}
                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<SelectAllIcon />}
                    onClick={handleSeleccionarTodasMedidas}
                    sx={{
                      color: 'success.main',
                      borderColor: 'success.main',
                      '&:hover': {
                        bgcolor: 'success.main',
                        color: 'white'
                      }
                    }}
                  >
                    Seleccionar Todas
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeselectIcon />}
                    onClick={handleDeseleccionarTodasMedidas}
                    sx={{
                      color: 'text.secondary',
                      borderColor: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'text.secondary',
                        color: 'white'
                      }
                    }}
                  >
                    Deseleccionar Todas
                  </Button>
                </Box>
                
                <Grid container spacing={1}>
                  {medidasDefault.map((med, idx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={med}>
                      <Box
                        sx={{ 
                          p: 1.5,
                          borderRadius: 1,
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                          },
                          bgcolor: medidas[idx] 
                            ? (isDarkMode ? 'rgba(76,175,80,0.1)' : '#e8f5e8') 
                            : 'transparent',
                          border: '1px solid',
                          borderColor: medidas[idx] 
                            ? '#4caf50' 
                            : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')
                        }}
                        onClick={() => handleMedidasChange(idx)}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={medidas[idx]}
                              onChange={() => handleMedidasChange(idx)}
                              sx={{ 
                                '&.Mui-checked': { 
                                  color: '#4caf50' 
                                } 
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              {med}
                            </Typography>
                          }
                          sx={{ margin: 0, width: '100%', pointerEvents: 'none' }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Collapse>
            </Box>
          </Paper>

          {/* Botón de Cálculo */}
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              type="submit"
              size="large"
              startIcon={<AssessmentIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                transition: 'all 0.3s ease'
              }}
            >
              Calcular Riesgo
            </Button>
          </Box>
        </form>
      </CardContent>
    </Paper>
  );
}

export default RiskAssessmentForm;