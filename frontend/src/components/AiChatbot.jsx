import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
  Chip,
  Fade,
  useTheme
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Psychology
} from '@mui/icons-material';

import axios from 'axios';

// Comunicación real con el backend FastAPI IA
const sendMessageToAI = async (message, userId, analysisContext = {}) => {
  try {
    const response = await axios.post(
      "http://localhost:8015/ai-chat",
      {
        message,
        user_id: userId,
        analysis_context: analysisContext || {}
      },
      {
        timeout: 20000
      }
    );
    if (response.data && response.data.response) {
      return response.data.response;
    } else {
      return "No se recibió respuesta válida del servidor de IA.";
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      return `Error del servidor: ${error.response.data.detail}`;
    }
    return "Error de conexión con el servidor de IA.";
  }
};

const AiChatbot = ({ analysisData }) => {
  const theme = useTheme();
  const quickQuestions = [
    "¿Por qué tengo este % de riesgo exacto?",
    "Dame análisis detallado de machine learning",
    "¿Cómo mejorar mi seguridad específicamente?",
    "Comparar motores de cálculo disponibles",
    "Analiza mis datos históricos completos",
    "Predice tendencias futuras con IA"
  ];

  // Estados para el chat
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // Ref para hacer scroll automático al último mensaje
  const messagesEndRef = useRef(null);


  
  // Generar ID único del usuario (persistente en sesión)
  const [userId] = useState(() => {
    const stored = sessionStorage.getItem('chatbot_user_id');
    if (stored) return stored;
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('chatbot_user_id', newId);
    return newId;
  });

  const handleQuickQuestion = async (question) => {
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Generar respuesta con IA
    const aiResponse = await sendMessageToAI(question, userId, analysisData);
    
    const aiMessage = {
      type: 'ai',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  // Función para enviar mensaje desde el input
  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const userMessage = {
      type: 'user',
      content: trimmed,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    try {
      const aiResponse = await sendMessageToAI(trimmed, userId, analysisData);
      const aiMessage = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Ocurrió un error al procesar tu mensaje.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatMessage = (content) => {
    // Convertir markdown básico a JSX
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <Typography key={index} variant="h6" component="span" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>{line.substring(2)}</Typography>;
      }
      if (line.startsWith('## ')) {
        return <Typography key={index} variant="subtitle1" component="span" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>{line.substring(3)}</Typography>;
      }
      if (line.startsWith('• ')) {
        return <Typography key={index} variant="body2" component="span" sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <span style={{ color: theme.palette.primary.main, marginRight: 8 }}>•</span>
          {line.substring(2)}
        </Typography>;
      }
      if (line.includes('**') && line.includes('**')) {
        const parts = line.split('**');
        return (
          <Typography key={index} variant="body2" component="span" sx={{ display: 'block' }}>
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} style={{ color: theme.palette.primary.main }}>{part}</strong> : part
            )}
          </Typography>
        );
      }
      // Evitar <br> directo para no romper la estructura de React
      if (!line) {
        return <Typography key={index} variant="body2" component="span">&nbsp;</Typography>;
      }
      return <Typography key={index} variant="body2" component="span">{line}</Typography>;
    });
  };

  return (
    <Card sx={{ height: 480, minHeight: 380, maxHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        textAlign: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Psychology sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Asistente IA Híbrido
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          Sistema Híbrido: IA Inteligente + Google Gemini
        </Typography>
      </CardContent>



      {/* Mensajes */}
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto', minHeight: 80, maxHeight: 320 }}>
        {messages.map((message, index) => (
          <Fade in={true} key={index}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: 1,
                maxWidth: '85%',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
              }}>
                <Avatar sx={{ 
                  bgcolor: message.type === 'user' ? theme.palette.primary.main : theme.palette.secondary.main,
                  width: 32, 
                  height: 32
                }}>
                  {message.type === 'user' ? <Person /> : <SmartToy />}
                </Avatar>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: message.type === 'user' 
                    ? theme.palette.primary.main 
                    : theme.palette.background.paper,
                  color: message.type === 'user' ? 'white' : 'inherit',
                  borderRadius: message.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  boxShadow: theme.shadows[2]
                }}>
                  <Box sx={{ whiteSpace: 'pre-wrap' }}>
                    {formatMessage(message.content)}
                  </Box>
                  <Typography variant="caption" sx={{ 
                    opacity: 0.7, 
                    mt: 1, 
                    display: 'block',
                    textAlign: message.type === 'user' ? 'right' : 'left'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Fade>
        ))}
        
        {isTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
              <SmartToy />
            </Avatar>
            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="textSecondary">
                Analizando con IA...
              </Typography>
            </Paper>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input SIEMPRE visible y usable */}
      <Box sx={{ p: 2, display: 'flex', gap: 1, borderTop: `1px solid ${theme.palette.divider}`, background: theme.palette.background.paper }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Pregúntame sobre tu análisis de riesgo..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            }
          }}
        />
        <IconButton 
          onClick={handleSendMessage}
          disabled={inputValue.trim() === '' || isTyping}
          sx={{ 
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': { bgcolor: theme.palette.primary.dark },
            '&:disabled': { bgcolor: theme.palette.grey[300] }
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Card>
  );
};

export default AiChatbot;
