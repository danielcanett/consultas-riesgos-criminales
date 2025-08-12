import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, IconButton, Badge, 
  List, ListItem, ListItemText, ListItemIcon, Chip, Collapse,
  Alert, Snackbar, Button, Divider, useTheme
} from '@mui/material';
import { 
  Notifications, NotificationsActive, Warning, Security, 
  TrendingUp, Error, CheckCircle, ExpandMore, ExpandLess,
  Clear, NotificationsOff, Settings, Info
} from '@mui/icons-material';

const NotificationSystem = ({ riskData, onNotificationAction }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  // Tipos de notificaciones con explicaciones claras
  const notificationTypes = {
    CRITICAL: { 
      color: '#F44336', 
      icon: <Error />, 
      priority: 1,
      description: 'Alertas críticas que requieren acción inmediata'
    },
    WARNING: { 
      color: '#FF9800', 
      icon: <Warning />, 
      priority: 2,
      description: 'Advertencias importantes sobre posibles riesgos'
    },
    INFO: { 
      color: '#2196F3', 
      icon: <Info />, 
      priority: 3,
      description: 'Información sobre tendencias y análisis'
    },
    SUCCESS: { 
      color: '#4CAF50', 
      icon: <CheckCircle />, 
      priority: 4,
      description: 'Confirmaciones de medidas exitosas'
    }
  };

  // Mensajes realistas y útiles
  const generateRealisticNotifications = () => {
    const notificationTemplates = [
      {
        type: 'CRITICAL',
        title: 'Actividad sospechosa detectada',
        message: 'Cámaras han detectado movimiento no autorizado en perímetro norte del Almacén Tlalnepantla. Protocolo de seguridad activado.',
        actionRequired: 'Verificar con equipo de seguridad',
        timestamp: new Date()
      },
      {
        type: 'WARNING', 
        title: 'Incremento en riesgo de zona',
        message: 'Análisis IA detecta aumento del 15% en actividad criminal en zona de Ecatepec durante las últimas 48 horas.',
        actionRequired: 'Revisar medidas preventivas',
        timestamp: new Date()
      },
      {
        type: 'INFO',
        title: 'Análisis predictivo actualizado',
        message: 'Modelo ML ha recalculado probabilidades: Riesgo de intrusión reducido 8% gracias a nuevas medidas implementadas.',
        actionRequired: 'Revisar dashboard actualizado',
        timestamp: new Date()
      },
      {
        type: 'SUCCESS',
        title: 'Medidas de seguridad efectivas',
        message: 'Sistema de detección perimetral funcionando 99.2% del tiempo. Cero incidentes registrados en últimas 72 horas.',
        actionRequired: 'Mantener protocolo actual',
        timestamp: new Date()
      },
      {
        type: 'WARNING',
        title: 'Mantenimiento programado requerido',
        message: 'Sistema de cámaras en Almacén Naucalpan requiere actualización firmware. Planificar mantenimiento.',
        actionRequired: 'Coordinar con equipo técnico',
        timestamp: new Date()
      },
      {
        type: 'INFO',
        title: 'Reporte semanal disponible',
        message: 'Análisis de riesgos semanal generado. Tendencia general: estable con mejoras en detección temprana.',
        actionRequired: 'Descargar reporte completo',
        timestamp: new Date()
      },
      {
        type: 'CRITICAL',
        title: 'Alerta de evento externo',
        message: 'Manifestación programada cerca de Almacén Cuautitlán para mañana 14:00-18:00. Incrementar vigilancia.',
        actionRequired: 'Activar protocolo eventos',
        timestamp: new Date()
      },
      {
        type: 'SUCCESS',
        title: 'Optimización completada',
        message: 'Algoritmo de IA ha optimizado rutas de patrullaje, reduciendo tiempo de respuesta en 23%.',
        actionRequired: 'Revisar nuevas rutas',
        timestamp: new Date()
      }
    ];

    return notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
  };

  // Generar notificaciones realistas
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateRealisticNotifications();
      
      setNotifications(prev => {
        const updated = [newNotification, ...prev].slice(0, 10); // Mantener solo 10
        return updated;
      });

      setLatestNotification(newNotification);
      setSnackbarOpen(true);
    }, 12000); // Cada 12 segundos para que no sea molesto

    // Generar una notificación inicial
    const initialNotification = generateRealisticNotifications();
    setNotifications([initialNotification]);

    return () => clearInterval(interval);
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClearNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getPriorityColor = (type) => {
    return notificationTypes[type]?.color || '#757575';
  };

  const getPriorityIcon = (type) => {
    return notificationTypes[type]?.icon || <Info />;
  };

  return (
    <>
      {/* Notificaciones flotantes */}
      <Card 
        sx={{ 
          position: 'fixed',
          bottom: 20,
          left: 20,
          width: 400,
          maxHeight: isExpanded ? 500 : 80,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: theme.shadows[8]
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge badgeContent={notifications.length} color="error" max={99}>
                <NotificationsActive sx={{ color: 'primary.main', mr: 1 }} />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Alertas del Sistema
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {notifications.length > 0 && (
                <IconButton size="small" onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}>
                  <Clear />
                </IconButton>
              )}
              <IconButton size="small">
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </Box>

          {/* Lista de notificaciones */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2 }}>
              {notifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <NotificationsOff sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No hay alertas activas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Las notificaciones aparecerán aquí cuando el sistema detecte eventos importantes
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 350, overflow: 'auto' }}>
                  {notifications.map((notification, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        sx={{ 
                          px: 0,
                          py: 1,
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Box sx={{ 
                            color: getPriorityColor(notification.type),
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {getPriorityIcon(notification.type)}
                          </Box>
                        </ListItemIcon>
                        
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {notification.title}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => handleClearNotification(index)}
                              >
                                <Clear sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                {notification.message}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Chip
                                  label={notification.actionRequired}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    fontSize: '0.7rem',
                                    borderColor: getPriorityColor(notification.type),
                                    color: getPriorityColor(notification.type)
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {notification.timestamp.toLocaleTimeString()}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>

            {/* Footer con explicación */}
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              🔴 Crítico: Acción inmediata • 🟡 Advertencia: Revisar • 🔵 Info: Tendencias • 🟢 Éxito: Confirmación
            </Typography>
          </Collapse>
        </CardContent>
      </Card>

      {/* Snackbar para nuevas notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {latestNotification && (
          <Alert
            onClose={handleCloseSnackbar}
            severity={
              latestNotification.type === 'CRITICAL' ? 'error' :
              latestNotification.type === 'WARNING' ? 'warning' :
              latestNotification.type === 'SUCCESS' ? 'success' : 'info'
            }
            sx={{ width: '100%' }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {latestNotification.title}
            </Typography>
            <Typography variant="body2">
              {latestNotification.message}
            </Typography>
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default NotificationSystem;
