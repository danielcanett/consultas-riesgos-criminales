# 🚀 Configuración Gemini API - Chatbot Híbrido

## 🎯 ¿Qué es el Sistema Híbrido?

Tu chatbot ahora usa **DOS sistemas inteligentes** automáticamente:

### 🤖 Sistema Inteligente (Siempre Disponible)
- ✅ Respuestas rápidas y confiables
- ✅ Memoria de conversación avanzada
- ✅ Especializado en análisis de riesgo
- ✅ Funciona sin configuración adicional

### 🚀 Gemini AI (Opcional - Gratis)
- ✅ Respuestas generativas muy avanzadas
- ✅ Análisis complejos y detallados
- ✅ Capacidades de razonamiento profundo
- ✅ API gratuita de Google

## 🔧 Cómo Configurar Gemini (Opcional)

### 1. Obtener API Key GRATUITA
1. Ve a: https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta Google
3. Haz clic en "Create API Key"
4. Copia tu API key (empieza con `AIzaSy...`)

### 2. Configurar en Windows
```bash
# Opción 1: Variable de entorno temporal
set GEMINI_API_KEY=tu_api_key_aqui

# Opción 2: Variable de entorno permanente
setx GEMINI_API_KEY "tu_api_key_aqui"
```

### 3. Configurar en VS Code
1. Crea archivo `.env` en la raíz del proyecto:
```
GEMINI_API_KEY=tu_api_key_aqui
```

2. Instala python-dotenv si no lo tienes:
```bash
pip install python-dotenv
```

## 🎯 Cómo Funciona el Router Automático

### 🤖 Usa Sistema Inteligente Cuando:
- Preguntas típicas: "¿Por qué tengo X% de riesgo?"
- Consejos de seguridad: "¿Cómo mejorar mi seguridad?"
- Datos históricos: "Muéstrame tendencias pasadas"
- Predicciones: "¿Qué pasará en el futuro?"

### 🚀 Usa Gemini AI Cuando:
- Preguntas complejas con múltiples partes
- Análisis técnicos profundos
- Comparaciones detalladas
- Preguntas largas (>15 palabras)
- Términos como: "complejo", "detallado", "técnico", "comparar"

## 📊 Estado Actual

### ✅ Sin Gemini (Solo Sistema Inteligente)
```
🤖 Sistema Inteligente Activo
- Memoria conversacional ✅
- Respuestas especializadas ✅
- Aprendizaje adaptativo ✅
- Fallback confiable ✅
```

### 🚀 Con Gemini (Sistema Híbrido Completo)
```
🚀 Sistema Híbrido Activo
- Decisión automática ✅
- Gemini para consultas complejas ✅
- Sistema inteligente para consultas típicas ✅
- Memoria compartida ✅
- Fallback automático ✅
```

## 🧪 Probar el Sistema

### 1. Iniciar Servidor
```bash
cd backend
python test_ai_server.py
```

### 2. Probar Consultas Diferentes

**Pregunta Simple** (Sistema Inteligente):
- "¿Por qué tengo 25% de riesgo?"

**Pregunta Compleja** (Gemini AI):
- "Explícame detalladamente cómo funciona el algoritmo de machine learning y compáralo con otros métodos técnicos de análisis de riesgo"

## 🔍 Logs del Sistema

El servidor mostrará qué sistema está usando:
- `🤖 Usando sistema inteligente (Patrones conocidos: 3)`
- `🚀 Usando Gemini (Complejidad: 5, Longitud: true)`

## 💡 Ventajas del Sistema Híbrido

1. **Velocidad**: Sistema inteligente responde instantáneamente
2. **Potencia**: Gemini para análisis complejos
3. **Confiabilidad**: Fallback automático
4. **Costo**: Gemini es GRATUITO hasta 60 consultas/minuto
5. **Memoria**: Ambos sistemas comparten el contexto de conversación

## 🎯 Recomendación

**Sin configurar Gemini**: Ya tienes un sistema excelente
**Con Gemini configurado**: Tienes el mejor sistema posible

¡El chatbot decide automáticamente qué es mejor para cada consulta!
