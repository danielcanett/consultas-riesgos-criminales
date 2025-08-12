import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Grid,
  Chip,
  Button,
  Collapse,
  Divider
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Palette,
  Settings,
  ExpandMore,
  ExpandLess,
  AutoMode,
  Contrast,
  FormatPaint
} from '@mui/icons-material';
import { useTheme } from './ThemeContext';

const ThemeSelector = () => {
  const { 
    isDarkMode, 
    accentColor, 
    toggleTheme, 
    changeAccentColor, 
    availableAccentColors 
  } = useTheme();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleAccentColorChange = (color) => {
    changeAccentColor(color);
    
    // Efecto visual al cambiar color
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    // Aquí podrías implementar una vista previa temporal
  };

  return (
    <Card className="theme-selector" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Palette color="primary" />
            Personalización Visual
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={togglePreviewMode}
              color={previewMode ? "primary" : "default"}
            >
              <Tooltip title="Modo Vista Previa">
                <FormatPaint />
              </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {/* Control Principal de Tema */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isDarkMode ? <DarkMode color="primary" /> : <LightMode color="warning" />}
              <Typography variant="body1">
                Modo {isDarkMode ? 'Oscuro' : 'Claro'}
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  color="primary"
                  size="medium"
                />
              }
              label=""
            />
          </Box>

          <Chip
            label={isDarkMode ? "🌙 Activo" : "☀️ Activo"}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Selector de Color de Acento */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
            Color de Acento:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(availableAccentColors || []).map((colorOption) => (
              <Tooltip key={colorOption.color} title={colorOption.name}>
                <IconButton
                  onClick={() => handleAccentColorChange(colorOption.color)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: colorOption.color,
                    border: accentColor === colorOption.color ? '3px solid' : '2px solid transparent',
                    borderColor: accentColor === colorOption.color ? 'white' : 'transparent',
                    boxShadow: accentColor === colorOption.color 
                      ? `0 0 0 2px ${colorOption.color}` 
                      : `0 2px 8px ${colorOption.color}40`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 4px 16px ${colorOption.color}60`,
                    },
                  }}
                >
                  {accentColor === colorOption.color && (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✓
                    </Box>
                  )}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Collapse in={isExpanded} timeout="auto">
          <Divider sx={{ my: 2 }} />
          
          {/* Configuraciones Avanzadas */}
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings fontSize="small" />
            Configuración Avanzada
          </Typography>

          <Grid container spacing={2}>
            {/* Vista Previa de Temas */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>Vista Previa:</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 50,
                    borderRadius: 1,
                    background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)',
                    border: !isDarkMode ? '2px solid' : '1px solid #ddd',
                    borderColor: !isDarkMode ? 'primary.main' : '#ddd',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                  onClick={() => !isDarkMode || toggleTheme()}
                >
                  <Box sx={{ p: 0.5, fontSize: '0.6rem', color: '#333' }}>
                    ☀️ Claro
                  </Box>
                </Box>
                
                <Box
                  sx={{
                    width: 80,
                    height: 50,
                    borderRadius: 1,
                    background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
                    border: isDarkMode ? '2px solid' : '1px solid #333',
                    borderColor: isDarkMode ? 'primary.main' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                  onClick={() => isDarkMode || toggleTheme()}
                >
                  <Box sx={{ p: 0.5, fontSize: '0.6rem', color: '#fff' }}>
                    🌙 Oscuro
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Información del Tema Actual */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" gutterBottom>Tema Actual:</Typography>
              <Box sx={{ 
                p: 1, 
                borderRadius: 1, 
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Modo: {isDarkMode ? 'Oscuro' : 'Claro'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Acento: {availableAccentColors.find(c => c.color === accentColor)?.name || 'Personalizado'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Auto-guardado: ✅ Activo
                </Typography>
              </Box>
            </Grid>

            {/* Acciones Rápidas */}
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>Acciones Rápidas:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AutoMode />}
                  onClick={() => {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark !== isDarkMode) toggleTheme();
                  }}
                >
                  Auto (Sistema)
                </Button>
                
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Contrast />}
                  onClick={() => {
                    // Cambiar a un color de alto contraste
                    handleAccentColorChange('#000000');
                  }}
                >
                  Alto Contraste
                </Button>
                
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    // Resetear a configuración por defecto
                    changeAccentColor('#1976d2');
                    if (isDarkMode) toggleTheme();
                  }}
                >
                  Restaurar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ThemeSelector;
