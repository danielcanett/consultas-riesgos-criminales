import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};

export const ThemeContextProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#1976d2');

  // Cargar preferencias del usuario
  useEffect(() => {
    const savedTheme = localStorage.getItem('riskAppTheme');
    const savedAccent = localStorage.getItem('riskAppAccentColor');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    if (savedAccent) {
      setAccentColor(savedAccent);
    }
  }, []);

  // Guardar preferencias
  useEffect(() => {
    localStorage.setItem('riskAppTheme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('riskAppAccentColor', accentColor);
  }, [isDarkMode, accentColor]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
  };

  // Paleta de colores personalizados
  const createCustomTheme = (darkMode, accent) => {
    const baseTheme = createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: accent,
          light: darkMode ? '#64B5F6' : '#42A5F5',
          dark: darkMode ? '#1565C0' : '#1976D2',
        },
        secondary: {
          main: darkMode ? '#FFB74D' : '#FF9800',
          light: darkMode ? '#FFE082' : '#FFB74D',
          dark: darkMode ? '#F57C00' : '#F57C00',
        },
        background: {
          default: darkMode ? '#121212' : '#fafafa',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: darkMode ? '#ffffff' : '#000000',
          secondary: darkMode ? '#b3b3b3' : '#666666',
        },
        error: {
          main: darkMode ? '#f44336' : '#d32f2f',
        },
        warning: {
          main: darkMode ? '#ff9800' : '#ed6c02',
        },
        success: {
          main: darkMode ? '#4caf50' : '#2e7d32',
        },
        info: {
          main: darkMode ? '#2196f3' : '#0288d1',
        },
        // Colores personalizados para la app
        risk: {
          low: darkMode ? '#4CAF50' : '#388E3C',
          medium: darkMode ? '#FF9800' : '#F57C00',
          high: darkMode ? '#FF5722' : '#D84315',
          critical: darkMode ? '#F44336' : '#C62828',
        },
        gamification: {
          gold: '#FFD700',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
          experience: darkMode ? '#9C27B0' : '#7B1FA2',
        }
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 600,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 600,
        },
        h3: {
          fontSize: '1.75rem',
          fontWeight: 600,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 500,
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 500,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 500,
        },
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: darkMode 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 4px 20px rgba(0, 0, 0, 0.1)',
              backdrop: 'blur(10px)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: darkMode 
                  ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
                  : '0 8px 30px rgba(0, 0, 0, 0.15)',
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            },
            contained: {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              fontWeight: 500,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              backdropFilter: 'blur(10px)',
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              borderRadius: 4,
              height: 8,
            },
          },
        },
      },
      shape: {
        borderRadius: 12,
      },
      shadows: darkMode 
        ? [
            'none',
            '0px 2px 1px -1px rgba(0,0,0,0.2)',
            '0px 4px 3px -1px rgba(0,0,0,0.3)',
            '0px 6px 5px -1px rgba(0,0,0,0.4)',
            '0px 8px 7px -1px rgba(0,0,0,0.5)',
            // ... más sombras personalizadas para modo oscuro
          ]
        : undefined,
    });

    return baseTheme;
  };

  const theme = createCustomTheme(isDarkMode, accentColor);

  const contextValue = {
    isDarkMode,
    accentColor,
    toggleTheme,
    changeAccentColor,
    theme,
    availableAccentColors: [
      { name: 'Azul', color: '#1976d2' },
      { name: 'Verde', color: '#388e3c' },
      { name: 'Púrpura', color: '#7b1fa2' },
      { name: 'Naranja', color: '#f57c00' },
      { name: 'Rojo', color: '#d32f2f' },
      { name: 'Teal', color: '#00796b' },
      { name: 'Índigo', color: '#303f9f' },
      { name: 'Rosa', color: '#c2185b' },
    ],
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
