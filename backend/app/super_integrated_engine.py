"""
Motor de análisis de riesgo SUPER integrado con datos reales gubernamentales
Versión 3.0.0 - Con integración completa de fuentes oficiales
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime



import sys
sys.path.append('../engines')
from engines.scientific_risk_engine import ScientificRiskEngine
sys.path.append('../services')
from services.real_data_service import real_data_service

logger = logging.getLogger(__name__)


# Motor científico v4
scientific_engine = ScientificRiskEngine()

async def calculate_super_integrated_risk(
    municipio: str,
    estado: str,
    business_type: str = "retail",
    business_value: float = 500000,
    scenarios: List[str] = None,
    security_measures: List[str] = None,
    ambito: str = "urbano"
) -> Dict[str, Any]:
    """
    Calcula el riesgo usando el motor científico v4 (probabilidades por escenario)
    """
    print(f"🚀 INICIANDO ANÁLISIS SUPER INTEGRADO v4 para {municipio}, {estado}")
    try:
        if scenarios is None:
            scenarios = []
        if security_measures is None:
            security_measures = []

        # 1. Obtener datos reales SESNSP para el municipio/estado directamente de la base local
        crime_data = real_data_service.get_crime_data_by_municipio_estado(municipio, estado)
        if not crime_data:
            raise Exception(f"No se encontraron datos reales de criminalidad para {municipio}, {estado}")

        # 2. Preparar datos_criminalidad para el panel (usando valores absolutos, no porcentajes)
        raw = crime_data.get('raw_data', {})
        delitos_principales = [
            {"tipo": "Robo", "incidentes": (raw.get('robo_comun', 0) + raw.get('robo_negocio', 0) + raw.get('robo_vehiculo', 0))},
            {"tipo": "Homicidio", "incidentes": (raw.get('homicidio_doloso', 0) + raw.get('homicidio_culposo', 0))},
            {"tipo": "Extorsión", "incidentes": raw.get('extorsion', 0)}
        ]
        datos_criminalidad = {
            "municipio": municipio,
            "estado": estado,
            "incidencia_total": raw.get('total_delitos', 0),
            "delitos_principales": delitos_principales,
            "fuente": raw.get('fuente', crime_data.get('fuente', 'SESNSP')),
            "fecha_actualizacion": raw.get('fecha_actualizacion', datetime.now().strftime("%Y-%m-%d"))
        }

        # 3. Calcular resultado científico para cada escenario usando motor v4.0 y datos reales
        summary = []
        # Definir location como municipio, estado (nombre oficial para trazabilidad)
        location = f"{municipio}, {estado}"
        if not scenarios or len(scenarios) == 0:
            logger.error("No se recibieron escenarios para calcular el riesgo científico.")
        else:
            for scenario in scenarios:
                try:
                    prob_result = scientific_engine.calculate_scenario_probability(
                        scenario=scenario,
                        location=location,
                        security_measures=security_measures,
                        crime_context=crime_data['crime_percentages']
                    )
                    summary.append({
                        "escenario": scenario,
                        "address": location,
                        "nivel_riesgo": "CIENTÍFICO",
                        "probabilidad": prob_result.get("probability", 0.0),
                        "intervalo_confianza": prob_result.get("confidence_interval", {}),
                        "confiabilidad": prob_result.get("reliability_score", 0.0),
                        "metadatos_cientificos": prob_result.get("scientific_metadata", {}),
                        "fuentes_datos": prob_result.get("data_sources", []),
                        "medidas_seguridad_count": len(security_measures),
                        "motor_usado": "SUPER Integrado v4.0",
                        "timestamp": datetime.now().isoformat(),
                        "calculo": prob_result
                    })
                except Exception as e:
                    logger.error(f"Error al calcular probabilidad científica para escenario {scenario}: {e}")
                    summary.append({
                        "escenario": scenario,
                        "address": location,
                        "nivel_riesgo": "ERROR",
                        "probabilidad": None,
                        "intervalo_confianza": {},
                        "confiabilidad": 0.0,
                        "metadatos_cientificos": {"error": str(e)},
                        "fuentes_datos": [],
                        "medidas_seguridad_count": len(security_measures),
                        "motor_usado": "SUPER Integrado v4.0",
                        "timestamp": datetime.now().isoformat(),
                        "calculo": {}
                    })

        return {
            "summary": summary,
            "datos_criminalidad": datos_criminalidad,
            "motor_usado": "SUPER Integrado v4.0",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"❌ Error en motor científico v4: {e}")
        raise Exception(f"Error en motor científico v4: {e}")

async def _realizar_analisis_super_integrado(
    datos_base: Dict[str, Any],
    municipio: str,
    estado: str,
    business_type: str,
    business_value: float,
    scenarios: List[str],
    security_measures: List[str],
    ambito: str
) -> Dict[str, Any]:
    """
    Realiza el análisis integrado de todos los datos recopilados
    """
    
    # Mapeo de escenarios para mostrar en frontend
    scenario_mapping = {
        'robo_simple': 'Robo simple',
        'robo_vehiculo': 'Robo de vehículo',
        'secuestro_vehiculos': 'Secuestro de vehículos',
        'intrusion_armada': 'Intrusión armada',
        'robo_mercancia': 'Robo de mercancía',
        'extorsion': 'Extorsión',
        'bloqueo_movimientos_sociales': 'Bloqueo por movimientos sociales',
        'vandalismo': 'Vandalismo',
        'manifestaciones': 'Manifestaciones',
        'huelgas': 'Huelgas'
    }
    
    # Calcular métricas de riesgo integradas
    riesgo_base = _calcular_riesgo_base(datos_base, business_type, business_value, ambito) or 40.0
    riesgo_contextual = _calcular_riesgo_contextual(datos_base, scenarios) or 0.0
    factor_proteccion = _calcular_factor_proteccion(security_measures) or 1.0
    
    # Ajustes por escenarios específicos
    ajustes_escenarios = _calcular_ajustes_escenarios(scenarios, datos_base) or 0.0
    
    # Cálculo final de riesgo
    riesgo_final = max(0, min(100, (riesgo_base + riesgo_contextual + ajustes_escenarios) * factor_proteccion))
    
    # Determinar nivel de riesgo
    if riesgo_final <= 30:
        nivel_riesgo = "BAJO"
        color_riesgo = "#4CAF50"
    elif riesgo_final <= 60:
        nivel_riesgo = "MEDIO"
        color_riesgo = "#FF9800"
    elif riesgo_final <= 80:
        nivel_riesgo = "ALTO"
        color_riesgo = "#F44336"
    else:
        nivel_riesgo = "CRÍTICO"
        color_riesgo = "#D32F2F"
    
    # Preparar escenarios para frontend
    escenarios_mostrar = []
    if scenarios:
        for scenario in scenarios:
            escenarios_mostrar.append(scenario_mapping.get(scenario, scenario))
    
    # Obtener datos de criminalidad para el panel
    datos_criminalidad = _extraer_datos_criminalidad(datos_base)
    
    return {
        "riesgo_general": round(riesgo_final, 1),
        "nivel_riesgo": nivel_riesgo,
        "color_riesgo": color_riesgo,
        "motor_usado": "SUPER Integrado v3.0",
        "ubicacion": f"{municipio}, {estado}",
        "tipo_negocio": business_type,
        "valor_negocio": business_value,
        "escenarios_analizados": escenarios_mostrar,
        "medidas_seguridad_count": len(security_measures) if security_measures else 0,
        "ambito": ambito,
        "timestamp": datetime.now().isoformat(),
        "fuentes_datos": {
            "sesnsp_disponible": bool(datos_base.get('sesnsp')),
            "inegi_disponible": bool(datos_base.get('inegi')),
            "fiscalias_disponible": bool(datos_base.get('fiscalias')),
            "ongs_disponible": bool(datos_base.get('ongs'))
        },
        "detalles_calculo": {
            "riesgo_base": round(riesgo_base, 1),
            "riesgo_contextual": round(riesgo_contextual, 1),
            "ajustes_escenarios": round(ajustes_escenarios, 1),
            "factor_proteccion": round(factor_proteccion, 2)
        },
        "datos_criminalidad": datos_criminalidad,
        "recomendaciones": _generar_recomendaciones_super(
            riesgo_final, scenarios, security_measures, datos_base
        )
    }

def _calcular_riesgo_base(datos_base: Dict[str, Any], business_type: str, business_value: float, ambito: str) -> float:
    """
    Calcula el riesgo base considerando datos socioeconómicos y criminalidad general
    """
    riesgo = 40.0  # Base inicial
    
    # Ajustes por tipo de negocio
    ajustes_negocio = {
        'retail': 10,
        'industrial': 15,
        'oficinas': 5,
        'almacen': 20,
        'residencial': 8
    }
    riesgo += ajustes_negocio.get(business_type, 10)
    
    # Ajustes por valor del negocio
    if business_value > 1000000:
        riesgo += 15
    elif business_value > 500000:
        riesgo += 10
    elif business_value > 100000:
        riesgo += 5
    
    # Ajustes por ámbito
    ajustes_ambito = {
        'urbano': 0,
        'suburbano': -5,
        'rural': -10,
        'industrial_metro': 10,
        'zona_turistica': 5
    }
    riesgo += ajustes_ambito.get(ambito, 0)
    
    # Ajustes por datos SESNSP
    if 'sesnsp' in datos_base and datos_base['sesnsp']:
        datos_sesnsp = datos_base['sesnsp']
        if 'incidencia_total' in datos_sesnsp:
            incidencia = datos_sesnsp.get('incidencia_total', 0)
            if incidencia is not None and incidencia > 1000:
                riesgo += 10
            elif incidencia is not None and incidencia > 500:
                riesgo += 5
    
    # Ajustes por datos INEGI
    if 'inegi' in datos_base and datos_base['inegi']:
        datos_inegi = datos_base['inegi']
        if 'indice_desarrollo' in datos_inegi:
            desarrollo = datos_inegi.get('indice_desarrollo', 0.5)
            if desarrollo is not None and desarrollo < 0.3:
                riesgo += 15
            elif desarrollo is not None and desarrollo < 0.5:
                riesgo += 8
    
    return max(0, min(100, riesgo))

def _calcular_riesgo_contextual(datos_base: Dict[str, Any], scenarios: List[str]) -> float:
    """
    Calcula el riesgo contextual basado en datos de fiscalías y ONGs
    """
    riesgo = 0.0
    
    # Ajustes por datos de fiscalías
    if 'fiscalias' in datos_base and datos_base['fiscalias']:
        fiscalias = datos_base['fiscalias']
        if 'casos_pendientes' in fiscalias:
            casos = fiscalias.get('casos_pendientes', 0)
            if casos is not None and casos > 100:
                riesgo += 10
            elif casos is not None and casos > 50:
                riesgo += 5
        
        if 'eficiencia_procesal' in fiscalias:
            eficiencia = fiscalias.get('eficiencia_procesal', 0.5)
            if eficiencia is not None and eficiencia < 0.3:
                riesgo += 15
            elif eficiencia is not None and eficiencia < 0.5:
                riesgo += 8
    
    # Ajustes por datos de ONGs
    if 'ongs' in datos_base and datos_base['ongs']:
        ongs = datos_base['ongs']
        if 'alertas_seguridad' in ongs:
            alertas = ongs.get('alertas_seguridad', 0)
            if alertas is not None and alertas > 5:
                riesgo += 12
            elif alertas is not None and alertas > 2:
                riesgo += 6
    
    return max(0, min(50, riesgo))

def _calcular_ajustes_escenarios(scenarios: List[str], datos_base: Dict[str, Any]) -> float:
    """
    Calcula ajustes específicos por escenarios considerando datos reales
    """
    if not scenarios:
        return 0.0
    
    ajustes_totales = 0.0
    
    for scenario in scenarios:
        if scenario == 'intrusion_armada':
            ajustes_totales += 15
        elif scenario == 'secuestro_vehiculos':
            ajustes_totales += 20
        elif scenario == 'robo_vehiculo':
            ajustes_totales += 12
        elif scenario == 'extorsion':
            ajustes_totales += 18
        elif scenario == 'robo_mercancia':
            ajustes_totales += 10
        elif scenario == 'bloqueo_movimientos_sociales':
            ajustes_totales += 8
        else:
            ajustes_totales += 5
    
    # Ajustes adicionales basados en datos reales
    if 'sesnsp' in datos_base and datos_base['sesnsp']:
        if 'robo_vehiculos' in datos_base['sesnsp'] and 'secuestro_vehiculos' in scenarios:
            robos_vehiculos = datos_base['sesnsp'].get('robo_vehiculos', 0)
            if robos_vehiculos is not None and robos_vehiculos > 50:
                ajustes_totales += 5
    
    return max(0, min(30, ajustes_totales))

def _calcular_factor_proteccion(security_measures: List[str]) -> float:
    """
    Calcula el factor de protección basado en medidas de seguridad implementadas
    """
    if not security_measures:
        return 1.0
    
    # Factor base de reducción por medida
    reduccion_por_medida = 0.02  # 2% por medida
    reduccion_total = len(security_measures) * reduccion_por_medida
    
    # Bonificaciones por medidas específicas de alta efectividad
    medidas_criticas = ['guardias', 'camaras', 'control_acceso', 'sistemas_intrusion']
    medidas_presentes = [m for m in medidas_criticas if m in security_measures]
    
    if len(medidas_presentes) >= 3:
        reduccion_total += 0.05  # 5% adicional por sinergia
    
    # El factor no puede reducir más del 40% el riesgo
    reduccion_total = min(0.4, reduccion_total)
    
    return 1.0 - reduccion_total

def _extraer_datos_criminalidad(datos_base: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extrae y formatea datos de criminalidad para el frontend
    """
    criminalidad = {
        "municipio": "No disponible",
        "estado": "No disponible",
        "incidencia_total": 0,
        "delitos_principales": [],
        "fuente": "SESNSP",
        "fecha_actualizacion": datetime.now().strftime("%Y-%m-%d")
    }
    
    if 'sesnsp' in datos_base and datos_base['sesnsp']:
        datos_sesnsp = datos_base['sesnsp']
        
        # Mapear delitos principales con sus nombres en español
        delitos_principales = []
        if 'robbery_incidents' in datos_sesnsp and datos_sesnsp['robbery_incidents'] > 0:
            delitos_principales.append({
                'tipo': 'Robos generales',
                'incidentes': datos_sesnsp['robbery_incidents']
            })
        if 'business_robbery' in datos_sesnsp and datos_sesnsp['business_robbery'] > 0:
            delitos_principales.append({
                'tipo': 'Robos a negocios',
                'incidentes': datos_sesnsp['business_robbery']
            })
        if 'vehicle_theft' in datos_sesnsp and datos_sesnsp['vehicle_theft'] > 0:
            delitos_principales.append({
                'tipo': 'Robo de vehículos',
                'incidentes': datos_sesnsp['vehicle_theft']
            })
        if 'assault_incidents' in datos_sesnsp and datos_sesnsp['assault_incidents'] > 0:
            delitos_principales.append({
                'tipo': 'Lesiones/Agresiones',
                'incidentes': datos_sesnsp['assault_incidents']
            })
        
        criminalidad.update({
            "municipio": datos_sesnsp.get('municipio', 'No disponible'),
            "estado": datos_sesnsp.get('estado', 'No disponible'),
            "incidencia_total": datos_sesnsp.get('total_incidents', 0),
            "delitos_principales": delitos_principales,
            "fuente": datos_sesnsp.get('data_source', 'SESNSP'),
            "fecha_actualizacion": datos_sesnsp.get('last_updated', 
                                                  datetime.now().strftime("%Y-%m-%d"))
        })
    
    return criminalidad

def _generar_recomendaciones_super(
    riesgo_final: float, 
    scenarios: List[str], 
    security_measures: List[str], 
    datos_base: Dict[str, Any]
) -> List[str]:
    """
    Genera recomendaciones específicas basadas en el análisis super integrado
    """
    recomendaciones = []
    
    # Recomendaciones por nivel de riesgo
    if riesgo_final > 80:
        recomendaciones.extend([
            "🚨 Implementar plan de seguridad integral inmediatamente",
            "📹 Instalar sistema de videovigilancia con monitoreo 24/7",
            "👮 Contratar servicio de seguridad privada",
            "🚨 Establecer protocolos de emergencia y evacuación"
        ])
    elif riesgo_final > 60:
        recomendaciones.extend([
            "⚠️ Reforzar medidas de seguridad existentes",
            "📱 Implementar sistema de alertas tempranas",
            "🔐 Mejorar control de acceso y perímetro"
        ])
    else:
        recomendaciones.extend([
            "✅ Mantener medidas preventivas actuales",
            "📊 Realizar monitoreo periódico de la situación"
        ])
    
    # Recomendaciones por escenarios específicos
    if scenarios:
        if 'intrusion_armada' in scenarios:
            recomendaciones.append("🛡️ Instalar sistemas anti-intrusión perimetrales")
        if 'secuestro_vehiculos' in scenarios:
            recomendaciones.append("🚗 Implementar rastreo GPS en vehículos críticos")
        if 'extorsion' in scenarios:
            recomendaciones.append("📞 Establecer protocolo de comunicación con autoridades")
    
    # Recomendaciones basadas en datos reales
    if 'sesnsp' in datos_base and datos_base['sesnsp']:
        incidencia = datos_base['sesnsp'].get('incidencia_total', 0)
        if incidencia is not None and incidencia > 1000:
            recomendaciones.append("📈 Considerar reubicación debido a alta incidencia delictiva")
    
    if 'fiscalias' in datos_base and datos_base['fiscalias']:
        eficiencia = datos_base['fiscalias'].get('eficiencia_procesal', 1.0)
        if eficiencia is not None and eficiencia < 0.3:
            recomendaciones.append("⚖️ Mantener comunicación directa con autoridades locales")
    
    return recomendaciones[:8]  # Limitar a máximo 8 recomendaciones
