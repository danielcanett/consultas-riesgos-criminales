import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, LinearProgress, Chip, 
  IconButton, Grid, Paper, Tooltip, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, List, ListItem, ListItemText,
  ListItemIcon, Divider, Alert
} from '@mui/material';
import { 
  Star, EmojiEvents, TrendingUp, Security, Map, Assessment,
  Help, Info, CheckCircle, Lock, Timeline, Close
} from '@mui/icons-material';

const GamificationPanel = ({ evaluationsCompleted, onScoreUpdate }) => {
  const [userStats, setUserStats] = useState({
    totalScore: 120, // Empezar con algunos puntos para mostrar el sistema
    level: 2,
    evaluationsCount: 3,
    badges: ['first_evaluation'],
    achievements: [],
    currentStreak: 1,
    totalRisksAnalyzed: 3,
    weeklyGoal: 5,
    weeklyProgress: 3
  });

  const [showHelp, setShowHelp] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);

  // Definición de badges y logros con explicaciones claras
  const availableBadges = [
    { 
      id: 'first_evaluation', 
      name: 'Primer Análisis', 
      icon: '🎯', 
      requirement: 1, 
      description: 'Completa tu primer análisis de riesgo',
      points: 50,
      type: 'achievement'
    },
    { 
      id: 'risk_expert', 
      name: 'Experto en Riesgos', 
      icon: '🔒', 
      requirement: 10, 
      description: 'Completa 10 análisis de riesgo',
      points: 200,
      type: 'achievement'
    },
    { 
      id: 'security_master', 
      name: 'Maestro de Seguridad', 
      icon: '🛡️', 
      requirement: 25, 
      description: 'Completa 25 análisis de riesgo',
      points: 500,
      type: 'achievement'
    },
    { 
      id: 'streak_warrior', 
      name: 'Constancia', 
      icon: '🔥', 
      requirement: 5, 
      description: 'Realiza análisis 5 días seguidos',
      points: 300,
      type: 'streak'
    },
    { 
      id: 'explorer', 
      name: 'Explorador', 
      icon: '🗺️', 
      requirement: 15, 
      description: 'Analiza 15 ubicaciones diferentes',
      points: 400,
      type: 'exploration'
    }
  ];

  // Sistema de niveles con beneficios
  const levelSystem = {
    1: { name: 'Novato', minScore: 0, maxScore: 99, color: '#757575', benefits: ['Acceso básico al sistema'] },
    2: { name: 'Aprendiz', minScore: 100, maxScore: 299, color: '#4CAF50', benefits: ['Reportes detallados', 'Alertas básicas'] },
    3: { name: 'Analista', minScore: 300, maxScore: 599, color: '#2196F3', benefits: ['Análisis predictivo', 'Recomendaciones IA'] },
    4: { name: 'Experto', minScore: 600, maxScore: 999, color: '#FF9800', benefits: ['Dashboards avanzados', 'Integración APIs'] },
    5: { name: 'Maestro', minScore: 1000, maxScore: 1999, color: '#9C27B0', benefits: ['Funciones premium', 'Soporte prioritario'] },
    6: { name: 'Leyenda', minScore: 2000, maxScore: 9999, color: '#F44336', benefits: ['Todas las funciones', 'Acceso beta'] }
  };

  // Calcular nivel basado en puntos
  const calculateLevel = (score) => {
    for (let level = 6; level >= 1; level--) {
      if (score >= levelSystem[level].minScore) {
        return level;
      }
    }
    return 1;
  };

  // Calcular progreso al siguiente nivel
  const getLevelProgress = (score) => {
    const currentLevel = calculateLevel(score);
    const currentLevelData = levelSystem[currentLevel];
    const nextLevelData = levelSystem[currentLevel + 1];
    
    if (!nextLevelData) return 100; // Nivel máximo

    const currentLevelScore = currentLevelData.minScore;
    const nextLevelScore = nextLevelData.minScore;
    return ((score - currentLevelScore) / (nextLevelScore - currentLevelScore)) * 100;
  };

  // Actualizar estadísticas cuando se completa una evaluación
  useEffect(() => {
    if (evaluationsCompleted > userStats.evaluationsCount) {
      const pointsGained = 25 + Math.floor(Math.random() * 15); // 25-40 puntos por evaluación
      const newStats = {
        ...userStats,
        totalScore: userStats.totalScore + pointsGained,
        evaluationsCount: evaluationsCompleted,
        currentStreak: userStats.currentStreak + 1,
        totalRisksAnalyzed: userStats.totalRisksAnalyzed + 1,
        weeklyProgress: Math.min(userStats.weeklyProgress + 1, userStats.weeklyGoal)
      };
      
      newStats.level = calculateLevel(newStats.totalScore);
      
      // Verificar nuevos logros
      availableBadges.forEach(badge => {
        if (!newStats.badges.includes(badge.id)) {
          let shouldAward = false;
          
          switch (badge.id) {
            case 'first_evaluation':
              shouldAward = newStats.evaluationsCount >= 1;
              break;
            case 'risk_expert':
              shouldAward = newStats.evaluationsCount >= 10;
              break;
            case 'security_master':
              shouldAward = newStats.evaluationsCount >= 25;
              break;
            case 'streak_warrior':
              shouldAward = newStats.currentStreak >= 5;
              break;
            case 'explorer':
              shouldAward = newStats.totalRisksAnalyzed >= 15;
              break;
          }
          
          if (shouldAward) {
            newStats.badges = [...newStats.badges, badge.id];
            newStats.totalScore += badge.points;
            setNewAchievement(badge);
            setTimeout(() => setNewAchievement(null), 4000);
          }
        }
      });
      
      setUserStats(newStats);
      onScoreUpdate && onScoreUpdate(newStats);
      
      // Guardar en localStorage
      localStorage.setItem('riskAppUserStats', JSON.stringify(newStats));
    }
  }, [evaluationsCompleted]);

  // Cargar estadísticas al iniciar
  useEffect(() => {
    const savedStats = localStorage.getItem('riskAppUserStats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setUserStats(parsed);
      } catch (error) {
        console.log('Error loading saved stats, using defaults');
      }
    }
  }, []);

  const currentLevelData = levelSystem[userStats.level];
  const nextLevelData = levelSystem[userStats.level + 1];

  const getLevelIcon = (level) => {
    if (level >= 5) return <EmojiEvents sx={{ color: '#FFD700' }} />;
    if (level >= 3) return <EmojiEvents sx={{ color: '#C0C0C0' }} />;
    return <Star sx={{ color: '#CD7F32' }} />;
  };

  return (
    <>
      <Card sx={{ 
        mb: 2, 
        background: `linear-gradient(135deg, ${currentLevelData.color}20 0%, ${currentLevelData.color}40 100%)`,
        border: `2px solid ${currentLevelData.color}30`
      }}>
        <CardContent>
          {/* Header con explicación */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getLevelIcon(userStats.level)}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Sistema de Progreso
              </Typography>
            </Box>
            <Tooltip title="¿Cómo funciona el sistema de gamificación?">
              <IconButton size="small" onClick={() => setShowHelp(true)}>
                <Help />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Nivel actual */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: `${currentLevelData.color}10` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ color: currentLevelData.color, fontWeight: 600 }}>
                Nivel {userStats.level} - {currentLevelData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userStats.totalScore} puntos
              </Typography>
            </Box>
            
            {nextLevelData && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Progreso al nivel {userStats.level + 1}: {nextLevelData.name}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={getLevelProgress(userStats.totalScore)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: `${currentLevelData.color}20`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: currentLevelData.color
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {nextLevelData.minScore - userStats.totalScore} puntos restantes
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Estadísticas */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {userStats.evaluationsCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Evaluaciones
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">
                  {userStats.currentStreak}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Racha
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {userStats.badges.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Logros
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {userStats.weeklyProgress}/{userStats.weeklyGoal}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Meta Semanal
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Logros obtenidos */}
          {userStats.badges.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Logros Desbloqueados:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {userStats.badges.map(badgeId => {
                  const badge = availableBadges.find(b => b.id === badgeId);
                  return badge ? (
                    <Tooltip key={badgeId} title={`${badge.description} (+${badge.points} puntos)`}>
                      <Chip
                        label={`${badge.icon} ${badge.name}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    </Tooltip>
                  ) : null;
                })}
              </Box>
            </Box>
          )}

          {/* Próximo logro */}
          {(() => {
            const nextBadge = availableBadges.find(badge => !userStats.badges.includes(badge.id));
            if (nextBadge) {
              let progress = 0;
              let current = 0;
              
              switch (nextBadge.id) {
                case 'first_evaluation':
                  current = userStats.evaluationsCount;
                  progress = Math.min((current / nextBadge.requirement) * 100, 100);
                  break;
                case 'risk_expert':
                  current = userStats.evaluationsCount;
                  progress = Math.min((current / nextBadge.requirement) * 100, 100);
                  break;
                case 'security_master':
                  current = userStats.evaluationsCount;
                  progress = Math.min((current / nextBadge.requirement) * 100, 100);
                  break;
                case 'streak_warrior':
                  current = userStats.currentStreak;
                  progress = Math.min((current / nextBadge.requirement) * 100, 100);
                  break;
                case 'explorer':
                  current = userStats.totalRisksAnalyzed;
                  progress = Math.min((current / nextBadge.requirement) * 100, 100);
                  break;
              }
              
              return (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Próximo Logro: {nextBadge.icon} {nextBadge.name}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress}
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                    color="secondary"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {current}/{nextBadge.requirement} - {nextBadge.description}
                  </Typography>
                </Box>
              );
            }
            return null;
          })()}
        </CardContent>
      </Card>

      {/* Nueva notificación de logro */}
      {newAchievement && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed', 
            top: 20, 
            right: 20, 
            zIndex: 1300,
            minWidth: 300
          }}
          action={
            <IconButton size="small" onClick={() => setNewAchievement(null)}>
              <Close />
            </IconButton>
          }
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            ¡Nuevo Logro Desbloqueado!
          </Typography>
          <Typography variant="body2">
            {newAchievement.icon} {newAchievement.name} (+{newAchievement.points} puntos)
          </Typography>
        </Alert>
      )}

      {/* Dialog de ayuda */}
      <Dialog open={showHelp} onClose={() => setShowHelp(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info color="primary" />
          ¿Cómo funciona el Sistema de Gamificación?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            <strong>El sistema de gamificación te motiva a usar la plataforma regularmente:</strong>
          </Typography>
          
          <Typography variant="h6" gutterBottom>🎯 Puntos y Niveles</Typography>
          <Typography variant="body2" paragraph>
            • Ganas puntos por cada análisis de riesgo completado (25-40 puntos)<br/>
            • Los puntos te permiten subir de nivel y desbloquear nuevas funciones<br/>
            • Cada nivel tiene beneficios específicos como reportes avanzados o IA predictiva
          </Typography>

          <Typography variant="h6" gutterBottom>🏆 Logros y Badges</Typography>
          <Typography variant="body2" paragraph>
            • Completa desafíos específicos para ganar logros<br/>
            • Cada logro otorga puntos extra y reconocimiento<br/>
            • Los logros muestran tu experiencia y dedicación
          </Typography>

          <Typography variant="h6" gutterBottom>🔥 Rachas y Metas</Typography>
          <Typography variant="body2" paragraph>
            • Mantén una racha diaria de análisis para bonificaciones<br/>
            • Cumple metas semanales para puntos adicionales<br/>
            • La consistencia es recompensada con logros especiales
          </Typography>

          <Typography variant="h6" gutterBottom>📊 Beneficios por Nivel</Typography>
          <List dense>
            {Object.entries(levelSystem).map(([level, data]) => (
              <ListItem key={level}>
                <ListItemIcon>
                  <Box sx={{ color: data.color, fontWeight: 'bold' }}>
                    {level}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={data.name}
                  secondary={data.benefits.join(', ')}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelp(false)} variant="contained">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GamificationPanel;
