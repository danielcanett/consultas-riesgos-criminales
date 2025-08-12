import axios from "axios";

// 🔥 BYPASS AGRESIVO DE CACHE - FORZAR RECARGA COMPLETA
const CACHE_BUSTER = Math.random().toString(36).substring(7);
const TIMESTAMP_UNIQUE = Date.now();
console.log("🔥🔥 CACHE BUSTER ACTIVADO:", CACHE_BUSTER);
console.log("🔥🔥🔥 TIMESTAMP ÚNICO:", TIMESTAMP_UNIQUE);
console.log("🔥🔥🔥 ESTE ES EL ARCHIVO CORRECTO - NO CACHE");

const API_URL = "/api";  // Usar proxy en lugar de URL directa
console.log("📡 API_URL DEFINITIVO:", API_URL);

// 🔥 FUNCIÓN COMPLETAMENTE NUEVA CON NOMBRE ÚNICO PARA BYPASSER CACHE EXTREMO
export const consultarRiesgoLimpio2025 = async (payload) => {
  console.log("🔥🔥🔥 FUNCIÓN NUEVA LIMPIA 2025 - ZERO CACHE");
  console.log("🔥 ENVIANDO REQUEST A:", `${API_URL}/consultar-riesgo`);
  console.log("🔥 Payload limpio enviado:", payload);
  
  // Verificar que el payload NO tenga campos extra
  const payloadLimpio = {
    address: payload.address,
    ambito: payload.ambito || "urbano",
    scenarios: payload.scenarios || [],
    security_measures: payload.security_measures || [],
    comments: payload.comments || ""
  };
  
  console.log("🧹 Payload verificado sin campos extra:", payloadLimpio);
  
  try {
    const res = await axios.post(`${API_URL}/consultar-riesgo`, payloadLimpio, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    console.log("🔥🔥🔥 RESPUESTA EXITOSA LIMPIA:", res.data);
    
    if (res.data && res.data.success) {
      // Mapear la estructura REAL del backend (no la que esperábamos)
      const crimeData = res.data.crime_data || {};
      const metadata = res.data.metadata || {};
      const analysis = res.data.analysis || {};
      const recommendations = res.data.recommendations || [];
      
      console.log("🔥🔥🔥 MAPEANDO ESTRUCTURA REAL DEL BACKEND:");
      console.log("📊 Respuesta completa del backend:", res.data);
      console.log("📊 crime_data:", crimeData);
      console.log("📊 analysis:", analysis);
      console.log("📊 metadata:", metadata);
      console.log("📊 recommendations:", recommendations);
      
      // Extraer la probabilidad científica real de las recomendaciones
      let scientificProbability = crimeData.robo || 0; // fallback
      let riskReduction = 0;
      
      // Buscar la probabilidad específica del escenario en las recomendaciones
      const probabilityRecommendation = recommendations.find(rec => 
        rec.includes("Probabilidad específica del escenario")
      );
      
      if (probabilityRecommendation) {
        const match = probabilityRecommendation.match(/(\d+\.?\d*)%/);
        if (match) {
          scientificProbability = parseFloat(match[1]);
          console.log("🔬 Probabilidad científica extraída:", scientificProbability + "%");
        }
      }
      
      // Buscar la reducción de riesgo
      const reductionRecommendation = recommendations.find(rec => 
        rec.includes("Reducción de riesgo alcanzada")
      );
      
      if (reductionRecommendation) {
        const match = reductionRecommendation.match(/(\d+\.?\d*)%/);
        if (match) {
          riskReduction = parseFloat(match[1]);
          console.log("📉 Reducción de riesgo extraída:", riskReduction + "%");
        }
      }
      
      // Crear el summary basado en los datos científicos REALES
      const summary = [{
        escenario: metadata.scenarios_analyzed?.[0] || "incidencia_general",
        address: metadata.location || "Ubicación desconocida",
        nivel_riesgo: analysis.motor_usado === "scientific_risk_engine_v4" ? "CIENTÍFICO" : "REAL",
        probabilidad: scientificProbability, // ✅ Usar probabilidad científica real
        riesgo_general: scientificProbability, // ✅ Usar probabilidad científica real
        medidas_seguridad_count: metadata.security_measures_count || 0,
        nivel_vulnerabilidad: analysis.confiabilidad || "MEDIUM",
        warehouse_code: metadata.location || "",
        warehouse_name: metadata.location || "",
        probabilidad_escenario: scientificProbability, // ✅ Usar probabilidad científica real
        probabilidad_numerica: scientificProbability, // ✅ Usar probabilidad científica real
        reduccion_por_medidas: riskReduction // ✅ Mostrar reducción real
      }];
      
      // Crear estructura que espera el frontend
      const finalData = {
        results: {
          summary: summary,
          datos_criminalidad: crimeData,
          scenario_analysis: analysis
        },
        summary: summary,
        datosCriminalidad: crimeData,
        datos_criminalidad: crimeData,
        motor: analysis.motor_usado || "real_data_engine",
        version: metadata.version || "4.0.0",
        timestamp: res.data.timestamp,
        analysis: analysis,
        security_assessment: res.data.security_assessment,
        recommendations: res.data.recommendations,
        metadata: metadata
      };
      
      console.log("🎯🎯🎯 ESTRUCTURA FINAL PARA FRONTEND:", finalData);
      return finalData;
    }
    return null;
  } catch (error) {
    console.error("🔴 ERROR EN REQUEST LIMPIO:", error);
    throw error;
  }
};

// 🔥 FUNCIÓN CON NOMBRE ÚNICO PARA EVITAR CACHE
export const consultarRiesgoNuevo = consultarRiesgoLimpio2025;

// APIs específicas para Mercado Libre
export const getMLWarehouses = async () => {
  const res = await axios.get(`${API_URL}/ml/warehouses`);
  return res.data;
};

export const getWarehouseDetails = async (codigoAlmacen) => {
  const res = await axios.get(`${API_URL}/ml/warehouse/${codigoAlmacen}`);
  return res.data;
};

export const getMLScenarios = async () => {
  const res = await axios.get(`${API_URL}/ml/scenarios`);
  return res.data;
};

export const getMLSecurityMeasures = async () => {
  const res = await axios.get(`${API_URL}/ml/security-measures`);
  return res.data;
};

// 🔥 ALIAS PARA MANTENER COMPATIBILIDAD Y FORZAR USO DE NUEVA FUNCIÓN
export const consultarRiesgo = consultarRiesgoNuevo;
