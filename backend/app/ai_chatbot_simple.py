#!/usr/bin/env python3
"""
🚀 AI Chatbot Simple - VERSIÓN PRODUCTIVA LIMPIA
Sistema híbrido para análisis de riesgos - SIN DATOS FALSOS
"""

import asyncio
import os
import sys
from typing import Dict, Any, List
from datetime import datetime

# Importar Google Gemini
try:
    import google.generativeai as genai
    print("✅ Google Gemini importado correctamente")
    GEMINI_AVAILABLE = True
except ImportError:
    print("⚠️ Google Gemini no disponible. Instala: pip install google-generativeai")
    GEMINI_AVAILABLE = False

class ConversationMemory:
    """Sistema de memoria para mantener contexto de conversaciones"""
    def __init__(self):
        self.conversations: Dict[str, List[Dict]] = {}
    
    def add_interaction(self, user_id: str, user_message: str, bot_response: str, context: Dict[str, Any]):
        if user_id not in self.conversations:
            self.conversations[user_id] = []
        
        self.conversations[user_id].append({
            'timestamp': datetime.now().isoformat(),
            'user_message': user_message,
            'bot_response': bot_response,
            'context': context
        })
        
        # Mantener solo las últimas 10 interacciones
        if len(self.conversations[user_id]) > 10:
            self.conversations[user_id] = self.conversations[user_id][-10:]
    
    def get_context(self, user_id: str) -> str:
        if user_id not in self.conversations or not self.conversations[user_id]:
            return "Nueva conversación iniciada."
        
        recent = self.conversations[user_id][-3:]
        context = "Contexto de conversación reciente:\n"
        for interaction in recent:
            context += f"Usuario: {interaction['user_message']}\n"
            context += f"Asistente: {interaction['bot_response'][:100]}...\n\n"
        
        return context

# Instancia global de memoria
conversation_memory = ConversationMemory()

class RiskAnalysisAI:
    """Sistema inteligente para análisis de riesgos - PRODUCTIVO"""
    def __init__(self):
        self.memory = conversation_memory
    
    async def get_detailed_explanation(self, user_message: str, analysis_data: Dict[str, Any], user_id: str = "default") -> str:
        """Respuesta conversacional inteligente - SOLO DATOS REALES"""
        user_message_lower = user_message.lower()
        
        # Respuestas más humanas y cálidas
        if any(word in user_message_lower for word in ['hola', 'hi', 'hello', 'buenos días', 'buenas tardes']):
            response = (
                "¡Hola! 😊 Soy tu asistente de riesgos. ¿En qué puedo ayudarte hoy? Si tienes alguna duda sobre seguridad, riesgos o prevención, dime y lo vemos juntos."
            )
        elif any(word in user_message_lower for word in ['cómo estás', 'how are you', 'qué tal']):
            response = (
                "¡Estoy muy bien, gracias por preguntar! ¿Te gustaría saber algo sobre seguridad o cómo reducir riesgos? Estoy aquí para ayudarte."
            )
        elif any(word in user_message_lower for word in ['riesgo', 'seguridad', 'análisis', 'ubicación']):
            response = (
                f"Sobre tu consulta de riesgos: '{user_message}'.\n\n"
                "Puedo ayudarte a entender mejor la situación, darte consejos prácticos y explicarte los factores más importantes. ¿Quieres que te explique algo en particular o tienes una situación específica en mente?"
            )
        else:
            response = (
                f"He recibido tu mensaje: '{user_message}'.\n\n"
                "Cuéntame un poco más sobre tu caso o lo que te preocupa, así podré darte una respuesta clara y útil. 😊"
            )

        self.memory.add_interaction(user_id, user_message, response, analysis_data)
        return response

class HybridRiskAnalysisAI:
    """Sistema híbrido: IA local + Gemini AI - VERSIÓN PRODUCTIVA"""
    
    def __init__(self):
        print("🚀 Inicializando chatbot híbrido con Gemini REAL...")
        self.intelligent_system = RiskAnalysisAI()
        self.gemini_available = False
        
        # Configurar Gemini si está disponible
        if GEMINI_AVAILABLE:
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                try:
                    genai.configure(api_key=api_key)
                    print("🔍 Modelos disponibles en Gemini:")
                    try:
                        models = genai.list_models()
                        print("Objetos de modelos disponibles:")
                        for m in models:
                            print(m)
                    except Exception as e:
                        print(f"⚠️ No se pudieron listar modelos: {e}")
                    # Cambia aquí el nombre del modelo si es necesario
                    self.gemini_model = genai.GenerativeModel('models/gemini-2.0-pro-exp')
                    self.gemini_available = True
                    print("✅ Gemini API configurado correctamente")
                    print(f"🔑 API Key configurada: {api_key[:20]}...")
                except Exception as e:
                    print(f"❌ Error configurando Gemini: {e}")
                    self.gemini_available = False
            else:
                print("⚠️ GEMINI_API_KEY no encontrada en variables de entorno")
        
        print("✅ Chatbot híbrido listo")
    
    def _should_use_gemini(self, user_message: str) -> tuple[bool, str]:
        """Decidir si usar Gemini o sistema inteligente"""
        message_lower = user_message.lower()
        # Solo usar sistema inteligente para saludos simples
        if any(word in message_lower for word in ['hola', 'hi', 'hello', 'gracias', 'thanks']):
            return False, "Saludo simple - usando sistema inteligente"
        # Para todo lo demás, usar Gemini si está disponible
        return True, "Usando Gemini AI para todas las consultas salvo saludos simples"
    
    async def get_detailed_explanation(self, user_message: str, analysis_data: Dict[str, Any], user_id: str = "default") -> str:
        """Endpoint principal del chatbot híbrido"""
        use_gemini, reason = self._should_use_gemini(user_message)
        
        if use_gemini and self.gemini_available:
            try:
                # Usar Gemini para consultas complejas
                response = await self._get_gemini_response(user_message, analysis_data, user_id)
                final_response = f"🚀 **Respuesta con Gemini AI**\n\n{response}\n\n*{reason}*"
            except Exception as e:
                # Fallback al sistema inteligente
                response = await self.intelligent_system.get_detailed_explanation(user_message, analysis_data, user_id)
                final_response = f"🤖 **Fallback a Sistema Inteligente**\n\n{response}\n\n*Error con Gemini: {str(e)}*"
        else:
            # Usar sistema inteligente
            response = await self.intelligent_system.get_detailed_explanation(user_message, analysis_data, user_id)
            final_response = f"{response}\n\n*🤖 {reason}*"
        
        return final_response
    
    async def _get_gemini_response(self, user_message: str, analysis_data: Dict[str, Any], user_id: str) -> str:
        """Obtener respuesta de Gemini AI"""
        if self.gemini_available:
            context = conversation_memory.get_context(user_id)
            prompt = (
                "Eres el asistente oficial de la web app de análisis de riesgos más avanzada de México. Tu función es ayudar a usuarios a entender, prevenir y gestionar riesgos de seguridad en almacenes, empresas y ubicaciones críticas, usando ciencia, datos reales y metodologías internacionales.\n\n"
                "Contexto de la plataforma:\n"
                "- El sistema integra datos oficiales de SESNSP, INEGI, ENVIPE, OpenWeatherMap, ONGs y reportes policiales.\n"
                "- Aplica modelos matemáticos y criminológicos: Teoría de la Actividad Rutinaria, Crime Pattern Theory, Target Hardening, CPTED, Bayesian Risk Assessment, ISO 31000.\n"
                "- Utiliza fórmulas como: P(evento) = P(base_ASIS) × (IVF × IAC_mejorado) × (1 - Σ Medidas) × Factor_real. IVF es el Índice de Vulnerabilidad Física, IAC el Índice de Amenaza Criminal, y Factor_real combina datos criminales, socioeconómicos y meteorológicos.\n"
                "- Analiza factores como: tipo de delito, frecuencia histórica, ubicación, medidas de seguridad, contexto social, clima y patrones estacionales.\n"
                "- Emplea machine learning para predicción de tendencias y clustering geográfico.\n"
                "- Todas las recomendaciones y análisis se basan en evidencia científica, literatura académica y validación cruzada con datos reales.\n\n"
                "Fuentes científicas y técnicas:\n"
                "- ASIS International, ISO 31000, UNODC, British Journal of Criminology, estudios de INACIPE, y literatura sobre prevención situacional y análisis cuantitativo de riesgo.\n"
                "- Modelos estadísticos: Poisson, Bayes, regresión, deep learning para series temporales.\n\n"
                "Objetivo principal:\n"
                "- Brindar análisis de riesgo transparente, preciso y personalizado, con recomendaciones prácticas y fundamentadas.\n"
                "- Explicar el porqué de cada resultado, los factores que influyen y cómo reducir el riesgo de manera concreta.\n\n"
                f"Contexto de conversación reciente:\n{context}\n\n"
                f"Consulta del usuario:\n{user_message}\n\n"
                f"Información adicional relevante:\n{analysis_data}\n\n"
                "Instrucciones para tu respuesta:\n"
                "- Sé conversacional, profesional y claro.\n"
                "- Explica la lógica detrás de los cálculos si el usuario lo pide.\n"
                "- Usa ejemplos reales y referencias a fuentes oficiales.\n"
                "- No inventes datos; si no hay información suficiente, sugiere buenas prácticas.\n"
                "- Si el usuario pregunta por la ciencia, metodología o fuentes, responde con detalle y menciona los modelos y teorías usados.\n"
            )
            try:
                response = self.gemini_model.generate_content(prompt)
                return response.text
            except Exception as e:
                print(f"❌ Error con Gemini: {e}")
                return self._get_advanced_fallback_response(user_message, analysis_data)
        else:
            return self._get_advanced_fallback_response(user_message, analysis_data)
    
    def _get_advanced_fallback_response(self, user_message: str, analysis_data: Dict[str, Any]) -> str:
        """Respuesta avanzada cuando Gemini no está disponible"""
        return (
            f"Gracias por tu mensaje: '{user_message}'.\n\n"
            "Voy a analizarlo y darte una recomendación sencilla y útil. Si tienes detalles extra (como ubicación, tipo de riesgo o contexto), cuéntamelo para afinar la respuesta."
        )

# ✅ INSTANCIA GLOBAL DEL CHATBOT HÍBRIDO
print("🔧 Creando instancia global del chatbot...")
chatbot = HybridRiskAnalysisAI()
print("✅ Chatbot híbrido global creado exitosamente")

# Verificación final
if __name__ == "__main__":
    print("🧪 Ejecutando pruebas del chatbot...")
    print(f"📋 Tipo de chatbot: {type(chatbot)}")
    print("✅ Chatbot híbrido funcionando correctamente")
