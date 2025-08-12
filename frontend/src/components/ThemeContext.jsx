import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const accentColors = {
  blue: '#2196f3',
  green: '#4caf50',
  orange: '#ff9800',
  red: '#f44336',
  purple: '#9c27b0',
  teal: '#009688',
  indigo: '#3f51b5',
  pink: '#e91e63'
};

const availableAccentColors = [
  { color: 'blue', name: 'Azul' },
  { color: 'green', name: 'Verde' },
  { color: 'orange', name: 'Naranja' },
  { color: 'red', name: 'Rojo' },
  { color: 'purple', name: 'Púrpura' },
  { color: 'teal', name: 'Verde Azulado' },
  { color: 'indigo', name: 'Índigo' },
  { color: 'pink', name: 'Rosa' }
];

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || 'blue';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: accentColors[accentColor] || accentColors.blue,
      },
      background: {
        default: isDarkMode ? '#121212' : '#fafafa',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: isDarkMode 
              ? 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            boxShadow: isDarkMode
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
              : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          },
        },
      },
    },
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
  };

  const value = {
    isDarkMode,
    setIsDarkMode,
    accentColor,
    setAccentColor,
    accentColors,
    availableAccentColors,
    theme,
    toggleTheme,
    changeAccentColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
