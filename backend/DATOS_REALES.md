# 🌟 Sistema de Consultas de Riesgos con Datos Reales

## 📋 Descripción

Tu sistema ahora puede funcionar con **datos gubernamentales oficiales en tiempo real** además de los cálculos matemáticos originales. 

## 🆕 Nuevas Funcionalidades

### **1. Fuentes de Datos Reales**

#### 🏛️ **Datos Gubernamentales Oficiales**
- **SESNSP** (Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública)
  - Estadísticas de criminalidad por municipio
  - Incidentes de robo, asaltos, robos a negocios
  - Datos actualizados mensualmente

#### 📊 **Indicadores Socioeconómicos (INEGI)**
- Tasa de desempleo
- Índice de marginación/pobreza
- Nivel educativo promedio
- Densidad poblacional

#### 🌤️ **Datos Meteorológicos en Tiempo Real**
- Temperatura, humedad, visibilidad
- Condiciones climáticas actuales
- Factor de riesgo meteorológico (estudios muestran correlación clima-criminalidad)

### **2. Motor de Análisis Mejorado**

#### 🧮 **Fórmula Mejorada**
```
P(evento) = P(base_ASIS) × (IVF × IAC_mejorado) × (1 - Σ Medidas) × Factor_real
```

Donde:
- `P(base_ASIS)`: Probabilidad base según metodología ASIS International
- `IAC_mejorado`: Índice de Amenaza Criminal con datos reales
- `Factor_real`: Datos criminales + socioeconómicos + meteorológicos

#### 🎯 **Análisis Más Preciso**
- Variabilidad dinámica basada en calidad de datos
- Recomendaciones específicas por zona
- Factores de riesgo identificados con datos locales

## 🚀 Configuración e Instalación

### **Paso 1: Instalar Dependencias**
```bash
cd backend
pip install -r requirements.txt
```

### **Paso 2: Configurar APIs (Opcional)**
Para datos reales completos, obtener API keys:

1. **OpenWeatherMap** (gratis): https://openweathermap.org/api
2. **INEGI** (gratis): https://www.inegi.org.mx/servicios/api.html

Crear archivo `.env`:
```bash
OPENWEATHER_API_KEY=tu_api_key_aqui
INEGI_API_KEY=tu_api_key_inegi
USE_DEMO_DATA=false
```

### **Paso 3: Iniciar Servidor**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📱 Uso de la API

### **Endpoint Principal (Con Datos Reales)**
```http
POST /consultar-riesgo
Content-Type: application/json

{
  "address": "Tultepec, Estado de México",
  "ambito": "industrial_metro",
  "scenarios": ["intrusion_armada", "robo_interno"],
  "security_measures": ["camaras", "guardias"],
  "comments": "Análisis con datos reales"
}
```

### **Endpoint Clásico (Solo Cálculos)**
```http
POST /consultar-riesgo-basico
```

## 🔄 Sistema de Fallback

El sistema incluye **fallback automático**:
1. **Intenta** usar datos reales de APIs gubernamentales
2. **Si falla**, usa el motor clásico original
3. **Transparente** para el usuario

## 📊 Ejemplo de Respuesta Mejorada

```json
{
  "results": {
    "summary": [
      {
        "scenario": "Intrusión armada con objetivo de robo",
        "probabilidad": "4.2% - 6.8%",
        "probabilidad_numerica": 5.5,
        "nivel_riesgo": "BAJO",
        "analisis_tecnico": "...",
        "real_data_impact": {
          "crime_factor": "Alto impacto: 650 robos a negocios registrados",
          "socioeconomic_factor": "Condiciones adversas aumentan riesgo",
          "weather_factor": "Condiciones favorables (Despejado)",
          "combined_factor": 1.25
        }
      }
    ],
    "real_data_sources": {
      "crime_statistics": {
        "robbery_incidents": 650,
        "business_robbery": 85,
        "data_source": "SESNSP - Datos oficiales"
      },
      "socioeconomic_indicators": {
        "risk_multiplier": 1.25,
        "data_source": "INEGI"
      },
      "weather_conditions": {
        "temperature": 22,
        "conditions": "Despejado",
        "weather_risk_factor": 1.0
      },
      "data_timestamp": "2025-07-23T10:30:00"
    }
  }
}
```

## 🎯 Ventajas del Sistema Mejorado

### **Para Usuarios**
- ✅ **Datos actualizados** de fuentes oficiales
- ✅ **Análisis más preciso** basado en criminalidad real local
- ✅ **Recomendaciones específicas** por zona
- ✅ **Transparencia** en fuentes de datos

### **Para Desarrolladores**
- ✅ **Compatibilidad** con sistema existente
- ✅ **Fallback automático** si APIs fallan
- ✅ **Cache inteligente** para optimizar rendimiento
- ✅ **Logs detallados** para debugging

### **Para Mercado Libre**
- ✅ **Decisiones basadas en datos reales** gubernamentales
- ✅ **Cumplimiento** con estándares internacionales (ASIS)
- ✅ **Escalabilidad** para múltiples ubicaciones
- ✅ **Actualización automática** de condiciones de riesgo

## 📈 Próximas Mejoras Sugeridas

1. **Machine Learning Predictivo**
   - Modelos entrenados con históricos
   - Predicción de tendencias criminales

2. **Integración con Más Fuentes**
   - Datos de tráfico y movilidad
   - Información de eventos públicos
   - Datos de redes sociales (sentiment analysis)

3. **Dashboard en Tiempo Real**
   - Monitoreo continuo de riesgos
   - Alertas automáticas
   - Reportes automatizados

4. **API de Geocoding**
   - Coordenadas precisas automáticamente
   - Análisis geoespacial avanzado

## 🔧 Troubleshooting

### **Error: APIs no responden**
- El sistema usa fallback automático
- Verificar conectividad a internet
- Validar API keys en `.env`

### **Error: Dependencias**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### **Modo Demo**
Si no tienes API keys, el sistema funciona con datos demo realistas.

## 📞 Soporte

El sistema está diseñado para ser **robusto** y **fácil de mantener**. En caso de problemas:

1. **Verificar logs** en `logs/`
2. **Usar endpoint básico** `/consultar-riesgo-basico`
3. **Modo demo** con `USE_DEMO_DATA=true`

---

**¡Tu sistema ahora utiliza datos reales del gobierno mexicano para análisis de riesgo más precisos!** 🇲🇽📊
