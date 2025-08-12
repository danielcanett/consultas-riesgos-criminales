import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Link,
  Tabs,
  Tab,
  Divider,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Security as SecurityIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  DataObject as DataIcon,
  Psychology as PsychologyIcon,
  Info as InfoIcon,
  OpenInNew as OpenInNewIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from './ThemeContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`technical-tabpanel-${index}`}
      aria-labelledby={`technical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function TechnicalInfoTabs() {
  // Usar hook de forma incondicional
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState(false);
  
  // Hook usado de manera fija, no condicional
  let isDarkMode = false;
  try {
    const customTheme = useCustomTheme();
    isDarkMode = customTheme?.isDarkMode || false;
  } catch (error) {
    // Si useCustomTheme no está disponible, usar false por defecto
    isDarkMode = false;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  // Información del motor científico 4V
  const motor4VInfo = {
    title: 'Motor Científico 4V',
    description: 'El Motor Científico 4V es el núcleo de análisis de riesgos de esta plataforma. Utiliza datos oficiales, modelos matemáticos y metodologías científicas para calcular el nivel de riesgo de cada almacén. Integra información de fuentes como SESNSP, INEGI, ONGs y reportes locales, aplicando técnicas de análisis estadístico, inferencia bayesiana y ponderación de variables para ofrecer resultados objetivos y transparentes.',
    database: [
      'Base de datos criminales oficiales (SESNSP, INEGI, CNI)',
      'Estadísticas de seguridad pública y urbana',
      'Datos de observatorios ciudadanos y ONGs',
      'Reportes de policía local y estatal',
      'Estudios científicos y literatura académica',
      'Normas internacionales de seguridad física y prevención',
    ],
    methodology: 'El motor 4V pondera variables como tipo de delito, frecuencia histórica, ubicación, medidas de seguridad implementadas y contexto social. Utiliza modelos de regresión, análisis de series temporales y validación cruzada con fuentes independientes para asegurar la robustez de los resultados.'
  };
  const sourcesData = {
    criminal: [
      {
        name: "INEGI - Encuesta Nacional de Victimización y Percepción sobre Seguridad Pública (ENVIPE)",
        description: "Estadísticas oficiales de criminalidad, victimización y demografía a nivel nacional",
        url: "https://www.inegi.org.mx/programas/envipe/2023/",
        category: "Datos Gubernamentales"
      },
      {
        name: "Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública (SESNSP)",
        description: "Reportes mensuales de incidencia delictiva del fuero común y federal",
        url: "https://www.gob.mx/sesnsp/acciones-y-programas/datos-abiertos-de-incidencia-delictiva",
        category: "Seguridad Nacional"
      },
      {
        name: "Centro Nacional de Información (CNI) - Plataforma México",
        description: "Base de datos nacional de información criminal y antecedentes",
        url: "https://www.gob.mx/cnpss/acciones-y-programas/centro-nacional-de-informacion",
        category: "Inteligencia Criminal"
      },
      {
        name: "Observatorio Nacional Ciudadano de Seguridad, Justicia y Legalidad",
        description: "Análisis independiente de seguridad ciudadana y tendencias delictivas",
        url: "https://onc.org.mx/",
        category: "Observatorio Civil"
      },
      {
        name: "Instituto Nacional de Estadística y Geografía - Estadísticas Judiciales",
        description: "Datos sobre procesos penales, sentencias y sistema penitenciario",
        url: "https://www.inegi.org.mx/temas/justicia/",
        category: "Sistema Judicial"
      },
      {
        name: "Banco Nacional de Datos e Información sobre Casos de Violencia",
        description: "Registro especializado en violencia de género y delitos conexos",
        url: "https://www.gob.mx/inmujeres/acciones-y-programas/banco-nacional-de-datos-e-informacion-sobre-casos-de-violencia-contra-las-mujeres-banavim",
        category: "Violencia Especializada"
      },
      {
        name: "Policía Municipal y Estatal - Sistemas C4/C5",
        description: "Reportes de incidentes locales, videocámaras y llamadas de emergencia",
        url: "#",
        category: "Datos Locales"
      },
      {
        name: "UNODC - Oficina de las Naciones Unidas contra la Droga y el Delito",
        description: "Estadísticas internacionales de criminalidad organizada y tendencias globales",
        url: "https://www.unodc.org/unodc/en/data-and-analysis/",
        category: "Datos Internacionales"
      },
      {
        name: "Global Peace Index - Institute for Economics and Peace",
        description: "Índices de paz y seguridad por países y regiones",
        url: "https://www.economicsandpeace.org/global-peace-index/",
        category: "Índices Globales"
      },
      {
        name: "Encuesta Nacional de Seguridad Pública Urbana (ENSU) - INEGI",
        description: "Percepción ciudadana sobre seguridad en zonas urbanas",
        url: "https://www.inegi.org.mx/programas/ensu/",
        category: "Percepción Ciudadana"
      }
    ],
    scientific: [
      {
        name: "ASIS International - Physical Security Standards",
        description: "Estándares globales de seguridad física (ASIS PSC.1-2012, ASIS GDL FMSD-2009)",
        url: "https://www.asisonline.org/certification/board-certifications/",
        category: "Seguridad Física"
      },
      {
        name: "Crime Prevention Through Environmental Design (CPTED) Institute",
        description: "Metodologías científicas de prevención del delito a través del diseño ambiental",
        url: "https://www.cpted.net/",
        category: "Prevención Ambiental"
      },
      {
        name: "Environmental Criminology and Crime Analysis (ECCA)",
        description: "Investigación académica en criminología ambiental y análisis espacial del delito",
        url: "https://www.ecca-research.org/",
        category: "Criminología Ambiental"
      },
      {
        name: "International Association of Crime Analysts (IACA)",
        description: "Estándares profesionales para análisis criminal y metodologías predictivas",
        url: "https://www.iaca.net/",
        category: "Análisis Criminal"
      },
      {
        name: "National Institute of Justice (NIJ) - Crime Mapping Research",
        description: "Investigación federal en mapeo criminal y tecnologías predictivas",
        url: "https://nij.ojp.gov/topics/technology/maps",
        category: "Investigación Federal"
      },
      {
        name: "European Society of Criminology - Environmental Crime Section",
        description: "Investigación europea en criminología ambiental y prevención situacional",
        url: "https://www.esc-eurocrim.org/",
        category: "Investigación Europea"
      },
      {
        name: "Journal of Quantitative Criminology - Springer",
        description: "Publicaciones científicas en métodos cuantitativos aplicados a criminología",
        url: "https://link.springer.com/journal/10940",
        category: "Literatura Científica"
      },
      {
        name: "Crime Science - Springer Open",
        description: "Revista científica sobre ciencia del crimen y prevención basada en evidencia",
        url: "https://crimesciencejournal.biomedcentral.com/",
        category: "Ciencia del Crimen"
      },
      {
        name: "Rutgers School of Criminal Justice - Crime Forecasting",
        description: "Investigación académica en pronósticos criminales y modelos predictivos",
        url: "https://www.rutgers.edu/academics/undergraduate/school-criminal-justice",
        category: "Investigación Académica"
      },
      {
        name: "British Journal of Criminology - Oxford Academic",
        description: "Investigación internacional en criminología teórica y aplicada",
        url: "https://academic.oup.com/bjc",
        category: "Criminología Teórica"
      }
    ],
    mathematical: [
      {
        name: "Distribuciones de Poisson para Modelado de Eventos Raros",
        description: "Modelado estadístico de frecuencia delictiva basado en distribuciones de probabilidad discretas",
        url: "https://www.jstor.org/stable/2346911",
        category: "Estadística Aplicada"
      },
      {
        name: "Algoritmos de Ensemble Learning - Random Forest & Gradient Boosting",
        description: "Predicción multivariable usando bosques aleatorios y boosting para variables criminológicas",
        url: "https://scikit-learn.org/stable/modules/ensemble.html",
        category: "Machine Learning"
      },
      {
        name: "Kernel Density Estimation para Análisis Espacial",
        description: "Estimación de densidad para mapeo de hotspots criminales y superficies de riesgo",
        url: "https://pro.arcgis.com/en/pro-app/latest/tool-reference/spatial-analyst/kernel-density.htm",
        category: "Análisis Espacial"
      },
      {
        name: "Regresión Logística Multinomial con Regularización",
        description: "Cálculo de probabilidades para múltiples escenarios delictivos usando Ridge/Lasso",
        url: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression",
        category: "Regresión Avanzada"
      },
      {
        name: "Modelos de Series Temporales ARIMA/SARIMA",
        description: "Análisis de tendencias temporales en criminalidad con componentes estacionales",
        url: "https://www.statsmodels.org/stable/tsa.html",
        category: "Series Temporales"
      },
      {
        name: "Análisis de Componentes Principales (PCA) para Reducción Dimensional",
        description: "Identificación de patrones criminales complejos mediante reducción de dimensionalidad",
        url: "https://scikit-learn.org/stable/modules/decomposition.html#pca",
        category: "Análisis Multivariado"
      },
      {
        name: "Redes Neuronales LSTM para Predicción Secuencial",
        description: "Deep learning para capturar patrones temporales complejos en datos criminales",
        url: "https://www.tensorflow.org/guide/keras/rnn",
        category: "Deep Learning"
      },
      {
        name: "Algoritmos de Clustering K-means y DBSCAN",
        description: "Agrupamiento no supervisado para identificación de patrones geográficos de crimen",
        url: "https://scikit-learn.org/stable/modules/clustering.html",
        category: "Clustering"
      },
      {
        name: "Modelos Bayesianos para Inferencia Criminal",
        description: "Actualización de probabilidades usando teorema de Bayes con evidencia nueva",
        url: "https://docs.pymc.io/en/v3/",
        category: "Estadística Bayesiana"
      },
      {
        name: "Algoritmos de Detección de Anomalías - Isolation Forest",
        description: "Identificación automática de patrones criminales inusuales y outliers",
        url: "https://scikit-learn.org/stable/modules/outlier_detection.html",
        category: "Detección de Anomalías"
      }
    ],
    technical: [
      {
        name: "React.js 18+ con Hooks y Context API",
        description: "Framework frontend moderno para interfaces reactivas y gestión de estado",
        url: "https://reactjs.org/",
        category: "Frontend Framework"
      },
      {
        name: "Material-UI (MUI) v5 con Theme Customization",
        description: "Sistema de diseño completo con componentes personalizables y responsive",
        url: "https://mui.com/",
        category: "UI/UX Library"
      },
      {
        name: "FastAPI con Pydantic para Validación",
        description: "Framework backend Python de alta performance con validación automática de datos",
        url: "https://fastapi.tiangolo.com/",
        category: "Backend Framework"
      },
      {
        name: "SQLAlchemy ORM con PostgreSQL/MySQL",
        description: "Object-Relational Mapping para gestión robusta de bases de datos relacionales",
        url: "https://www.sqlalchemy.org/",
        category: "Base de Datos"
      },
      {
        name: "Scikit-Learn 1.3+ para Machine Learning",
        description: "Biblioteca completa de algoritmos de aprendizaje automático en Python",
        url: "https://scikit-learn.org/",
        category: "ML/AI Core"
      },
      {
        name: "Pandas & NumPy para Procesamiento de Datos",
        description: "Manipulación eficiente de datasets criminales y operaciones numéricas vectorizadas",
        url: "https://pandas.pydata.org/",
        category: "Data Processing"
      },
      {
        name: "TensorFlow/Keras para Deep Learning",
        description: "Redes neuronales profundas para análisis de patrones criminales complejos",
        url: "https://www.tensorflow.org/",
        category: "Deep Learning"
      },
      {
        name: "Apache Kafka para Streaming de Datos",
        description: "Procesamiento en tiempo real de feeds de datos criminales y alertas",
        url: "https://kafka.apache.org/",
        category: "Data Streaming"
      },
      {
        name: "Docker & Kubernetes para Containerización",
        description: "Despliegue escalable y gestión de microservicios en producción",
        url: "https://docker.com/",
        category: "DevOps"
      },
      {
        name: "Redis para Cache y Sesiones",
        description: "Cache en memoria para consultas frecuentes y gestión de sesiones de usuario",
        url: "https://redis.io/",
        category: "Cache/Storage"
      },
      {
        name: "Elasticsearch para Búsqueda Avanzada",
        description: "Motor de búsqueda distribuido para consultas complejas en datos criminales",
        url: "https://www.elastic.co/",
        category: "Search Engine"
      },
      {
        name: "Celery para Procesamiento Asíncrono",
        description: "Cola de tareas distribuida para cálculos intensivos de modelos predictivos",
        url: "https://docs.celeryproject.org/",
        category: "Task Queue"
      }
    ],
    methodology: [
      {
        name: "Metodología ASIS Risk Assessment Standard",
        description: "Marco internacional para evaluación sistemática de riesgos de seguridad física (ASIS SPC.1-2009)",
        url: "https://www.asisonline.org/",
        category: "Marco de Referencia"
      },
      {
        name: "Análisis Predictivo Multivariable Ponderado",
        description: "Integración de 15+ variables: geográficas, temporales, criminológicas, socioeconómicas y de infraestructura",
        url: "#",
        category: "Algoritmo Propio"
      },
      {
        name: "Redes Neuronales Profundas con Arquitectura Ensemble",
        description: "Combinación de LSTM, CNN y Dense layers para capturar patrones espacio-temporales complejos",
        url: "https://www.tensorflow.org/",
        category: "Deep Learning"
      },
      {
        name: "Validación Cruzada Temporal con Rolling Windows",
        description: "Verificación de precisión usando ventanas deslizantes de 6-12 meses con datos históricos",
        url: "#",
        category: "Validación Estadística"
      },
      {
        name: "Teoría de la Elección Racional en Criminología",
        description: "Aplicación de modelos económicos de decisión criminal y costo-beneficio delictivo",
        url: "https://www.ojp.gov/ncjrs/virtual-library/abstracts/rational-choice-theory",
        category: "Teoría Criminológica"
      },
      {
        name: "Crime Pattern Theory & Geographic Profiling",
        description: "Análisis de patrones espaciales basado en teorías de Brantingham y Rossmo",
        url: "https://www.sciencedirect.com/topics/social-sciences/crime-pattern-theory",
        category: "Perfilado Geográfico"
      },
      {
        name: "Routine Activity Theory Implementation",
        description: "Modelado de convergencia espacio-temporal de delincuentes motivados, objetivos y ausencia de guardianes",
        url: "https://www.britannica.com/topic/routine-activity-theory",
        category: "Teoría de Actividades"
      },
      {
        name: "Monte Carlo Simulation para Escenarios",
        description: "Simulación estocástica de 10,000+ iteraciones para cálculo de intervalos de confianza",
        url: "https://numpy.org/doc/stable/reference/random/",
        category: "Simulación Estadística"
      },
      {
        name: "Broken Windows Theory & Social Disorganization",
        description: "Incorporación de indicadores de deterioro urbano y desorganización social como predictores",
        url: "https://www.britannica.com/topic/broken-windows-theory",
        category: "Teoría Social"
      },
      {
        name: "COMPSTAT Methodology Adaptation",
        description: "Adaptación de metodologías policiales de análisis estadístico comparativo",
        url: "https://www.ojp.gov/ncjrs/virtual-library/abstracts/compstat-paradigm",
        category: "Metodología Policial"
      },
      {
        name: "Fuzzy Logic para Incertidumbre",
        description: "Lógica difusa para manejar imprecisión en variables cualitativas y juicios expertos",
        url: "https://scikit-fuzzy.github.io/scikit-fuzzy/",
        category: "Lógica Difusa"
      },
      {
        name: "A/B Testing para Optimización Continua",
        description: "Experimentación controlada para mejora iterativa de precisión predictiva",
        url: "#",
        category: "Optimización"
      }
    ]
  };

  const renderSourceCard = (source, index) => (
    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ flexGrow: 1 }}>
            {source.name}
          </Typography>
          <Chip 
            label={source.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ ml: 1 }}
          />
          {source.url !== "#" && (
            <Link 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ ml: 2 }}
            >
              <OpenInNewIcon color="primary" />
            </Link>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {source.description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 3,
        bgcolor: isDarkMode ? '#1a1a2e' : 'white',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
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
          onClick={handleToggle}
        >
          <InfoIcon sx={{ mr: 2, color: 'info.main', fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Información Técnica y Fuentes
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mb: 2,
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
              '& .MuiTab-root': {
                minWidth: 'auto',
                px: 2,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <Tab 
              icon={<SecurityIcon />} 
              label="Estadística Criminal" 
              iconPosition="start"
            />
            <Tab 
              icon={<ScienceIcon />} 
              label="Fuentes Científicas" 
              iconPosition="start"
            />
            <Tab 
              icon={<CalculateIcon />} 
              label="Modelos Matemáticos" 
              iconPosition="start"
            />
            <Tab 
              icon={<DataIcon />} 
              label="Stack Tecnológico" 
              iconPosition="start"
            />
            <Tab 
              icon={<PsychologyIcon />} 
              label="Metodología" 
              iconPosition="start"
            />
            <Tab 
              icon={<InfoIcon />} 
              label="Motor Científico 4V" 
              iconPosition="start"
            />
          </Tabs>

          <Divider sx={{ mb: 2 }} />

          <TabPanel value={value} index={0}>
            {/* Estadística Criminal */}
            {sourcesData.criminal.map((source, index) => renderSourceCard(source, index))}
          </TabPanel>
          <TabPanel value={value} index={5}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {motor4VInfo.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {motor4VInfo.description}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Base de Datos Utilizada
              </Typography>
              <List>
                {motor4VInfo.database.map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon><DataIcon color="primary" /></ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Metodología de Evaluación
              </Typography>
              <Typography variant="body2">
                {motor4VInfo.methodology}
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            {/* Fuentes Científicas */}
            {sourcesData.scientific.map((source, index) => renderSourceCard(source, index))}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {/* Modelos Matemáticos */}
            {sourcesData.mathematical?.map ? sourcesData.mathematical.map((source, index) => renderSourceCard(source, index)) : null}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {/* Stack Tecnológico */}
            {sourcesData.technical?.map ? sourcesData.technical.map((source, index) => renderSourceCard(source, index)) : null}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {/* Metodología */}
            {sourcesData.methodology?.map ? sourcesData.methodology.map((source, index) => renderSourceCard(source, index)) : null}
          </TabPanel>
          <TabPanel value={value} index={5}>
          </TabPanel>
        </Collapse>
      </Box>
    </Paper>
  );
}

export default TechnicalInfoTabs;
