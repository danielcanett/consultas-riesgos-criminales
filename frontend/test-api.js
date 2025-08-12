// Script de prueba para la API
const axios = require('axios');

async function testAPI() {
  try {
    console.log("🧪 INICIANDO PRUEBA DIRECTA DE LA API");
    
    const payload = {
      address: "CIUDAD DE MEXICO",
      ambito: "urbano",
      scenarios: ["robo_transporte"],
      security_measures: ["camara_seguridad"],
      comments: "Prueba directa desde Node.js"
    };
    
    console.log("📤 Enviando payload:", payload);
    
    const response = await axios.post('http://localhost:8000/consultar-riesgo', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("📥 Respuesta del backend:");
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Data:", JSON.stringify(response.data, null, 2));
    
    // Verificar la estructura esperada
    if (response.data.success && response.data.results) {
      console.log("✅ Backend devuelve estructura correcta");
      console.log("📊 Summary:", response.data.results.summary);
      console.log("📊 Datos criminalidad:", response.data.results.datos_criminalidad);
    } else {
      console.log("❌ Estructura inesperada del backend");
    }
    
  } catch (error) {
    console.error("❌ Error en prueba:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
}

testAPI();
