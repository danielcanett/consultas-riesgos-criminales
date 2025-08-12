"""
Motor de análisis de riesgo ESPECIALIZADO para Mercado Libre
Versión 1.0.0 - Híbrido con datos históricos ML + gubernamentales
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import json

from .real_data_connectors import GobiernoDataConnector
from .inegi_expanded_connector import INEGIExpandedConnector
from .super_integrated_engine import calculate_super_integrated_risk

logger = logging.getLogger(__name__)

class MLRiskEngine:
    """Motor especializado para análisis de riesgo de almacenes Mercado Libre"""
    
    def __init__(self):
        self.ml_warehouses = self._load_ml_warehouses()
        self.historical_data = self._initialize_historical_data()
        
    def _load_ml_warehouses(self) -> Dict[str, Any]:
        """Carga catálogo de almacenes ML con sus características"""
        # Almacenes ML especializados (con datos históricos completos)
        specialized_warehouses = {
            "TULT001": {
                "codigo": "TULT001",
                "nombre": "Almacén Tultepec Norte",
                "municipio": "Tultepec",
                "estado": "México",
                "coordenadas": {"lat": 19.6053, "lng": -99.1363},
                "tipo_operacion": "distribucion_mixta",
                "volumen_diario_promedio": 1200,
                "valor_inventario_promedio": 2500000,
                "horario_operacion": "24_7",
                "personal_seguridad": True,
                "camaras_perimetrales": True,
                "control_acceso_biometrico": True,
                "sistemas_alarma": True,
                "rutas_principales": ["México-Pachuca", "Circuito Exterior"],
                "vulnerabilities_identificadas": ["zona_industrial_aislada", "trafico_nocturno_alto"]
            },
            "CDMX002": {
                "codigo": "CDMX002", 
                "nombre": "Almacén Ciudad de México Sur",
                "municipio": "Tlalpan",
                "estado": "Ciudad de México",
                "coordenadas": {"lat": 19.2976, "lng": -99.1681},
                "tipo_operacion": "distribucion_ultima_milla",
                "volumen_diario_promedio": 2500,
                "valor_inventario_promedio": 4000000,
                "horario_operacion": "6_22",
                "personal_seguridad": True,
                "camaras_perimetrales": True,
                "control_acceso_biometrico": True,
                "sistemas_alarma": True,
                "rutas_principales": ["Periférico Sur", "Insurgentes Sur"],
                "vulnerabilities_identificadas": ["alto_trafico_urbano", "zona_comercial_densa"]
            }
        }
        
        # Cargar también almacenes del catálogo principal de ML
        import json
        import os
        
        try:
            # Ruta corregida desde backend/app hacia frontend
            warehouses_file = os.path.join(os.path.dirname(__file__), "../../frontend/src/data/warehouses.json")
            if os.path.exists(warehouses_file):
                with open(warehouses_file, 'r', encoding='utf-8') as f:
                    main_warehouses = json.load(f)
                    
                # Convertir almacenes principales a formato ML
                for warehouse in main_warehouses:
                    if warehouse["id"] not in specialized_warehouses:
                        address_parts = warehouse["address"].split(",")
                        municipio = address_parts[1].strip() if len(address_parts) > 1 else "México"
                        
                        specialized_warehouses[warehouse["id"]] = {
                            "codigo": warehouse["id"],
                            "nombre": warehouse["name"],
                            "municipio": municipio,
                            "estado": warehouse.get("region", "México"),
                            "coordenadas": {"lat": warehouse["lat"], "lng": warehouse["lng"]},
                            "tipo_operacion": "fulfillment_center",
                            "volumen_diario_promedio": 1500,
                            "valor_inventario_promedio": 3000000,
                            "horario_operacion": "24_7",
                            "personal_seguridad": True,
                            "camaras_perimetrales": True,
                            "control_acceso_biometrico": True,
                            "sistemas_alarma": True,
                            "rutas_principales": ["Principal", "Secundaria"],
                            "vulnerabilities_identificadas": ["evaluacion_pendiente"]
                        }
        except Exception as e:
            print(f"⚠️ No se pudo cargar warehouses.json: {e}")
            
        return specialized_warehouses
    
    def _initialize_historical_data(self) -> Dict[str, Any]:
        """Inicializa base de datos histórica ML con incidentes y patrones"""
        return {
            "TULT001": {
                "incidentes_historicos": [
                    {
                        "fecha": "2024-03-15",
                        "tipo": "robo_mercancia_transito",
                        "descripcion": "Robo durante descarga matutina",
                        "impacto_operacional": 25.0,  # Porcentaje de afectación
                        "costo_estimado": 45000,
                        "mercancia_afectada": ["electronica", "smartphones"],
                        "horario_incidente": "07:30",
                        "medidas_implementadas": ["refuerzo_seguridad_matutino", "escolta_vehiculos"],
                        "efectividad_medidas": 85
                    },
                    {
                        "fecha": "2024-01-22", 
                        "tipo": "bloqueo_carretero",
                        "descripcion": "Manifestación en México-Pachuca",
                        "impacto_operacional": 60.0,
                        "costo_estimado": 120000,
                        "duracion_horas": 8,
                        "rutas_alternativas_usadas": ["Circuito Exterior", "Autopista Pachuca"],
                        "medidas_implementadas": ["coordinacion_policial", "rutas_contingencia"],
                        "efectividad_medidas": 70
                    },
                    {
                        "fecha": "2023-11-20",
                        "tipo": "intrusion_almacen_nocturna", 
                        "descripcion": "Intento de intrusión 02:00 AM",
                        "impacto_operacional": 15.0,
                        "costo_estimado": 8000,
                        "mercancia_afectada": [],
                        "sistemas_activados": ["alarmas", "camaras", "contacto_policial"],
                        "medidas_implementadas": ["refuerzo_perimetral", "guardias_nocturnos"],
                        "efectividad_medidas": 95
                    }
                ],
                "patrones_identificados": {
                    "temporadas_criticas": {
                        "buen_fin": {"noviembre": 1.4},
                        "navidad": {"diciembre": 1.6},
                        "regreso_clases": {"enero": 1.2, "agosto": 1.1}
                    },
                    "horarios_vulnerables": {
                        "carga_matutina": {"06:00-08:00": 1.3},
                        "operacion_nocturna": {"22:00-06:00": 1.2}
                    },
                    "mercancia_objetivo": {
                        "electronica": 1.5,
                        "smartphones": 1.8,
                        "computadoras": 1.4,
                        "gaming": 1.3
                    },
                    "rutas_riesgo": {
                        "mexico_pachuca": 1.2,
                        "circuito_exterior": 1.1
                    }
                },
                "movimientos_sociales_historicos": [
                    {
                        "fecha": "2024-05-01",
                        "tipo": "marcha_dia_trabajador",
                        "impacto_rutas": ["México-Pachuca"],
                        "duracion_estimada": 6,
                        "recurrencia": "anual",
                        "nivel_afectacion": "alto"
                    },
                    {
                        "fecha": "2024-02-14",
                        "tipo": "bloqueo_transportistas",
                        "impacto_rutas": ["Circuito Exterior"],
                        "duracion_estimada": 12,
                        "recurrencia": "esporádica", 
                        "nivel_afectacion": "crítico"
                    }
                ]
            },
            "CDMX002": {
                "incidentes_historicos": [
                    {
                        "fecha": "2024-04-10",
                        "tipo": "robo_vehiculo_reparto",
                        "descripcion": "Robo a repartidor en zona comercial",
                        "impacto_operacional": 20.0,
                        "costo_estimado": 35000,
                        "mercancia_afectada": ["ropa", "accesorios"],
                        "horario_incidente": "14:30",
                        "medidas_implementadas": ["rutas_seguras", "comunicacion_continua"],
                        "efectividad_medidas": 75
                    }
                ],
                "patrones_identificados": {
                    "temporadas_criticas": {
                        "buen_fin": {"noviembre": 1.3},
                        "navidad": {"diciembre": 1.5}
                    },
                    "horarios_vulnerables": {
                        "reparto_tarde": {"14:00-18:00": 1.2}
                    },
                    "mercancia_objetivo": {
                        "electronica": 1.4,
                        "ropa_marca": 1.2
                    }
                },
                "movimientos_sociales_historicos": []
            }
        }

async def calculate_ml_specialized_risk(
    codigo_almacen: str,
    scenarios: List[str] = None,
    security_measures: List[str] = None,
    fecha_analisis: str = None
) -> Dict[str, Any]:
    """
    Calcula riesgo especializado para almacén específico de ML
    """
    
    ml_engine = MLRiskEngine()
    
    print(f"🏭 INICIANDO ANÁLISIS ESPECIALIZADO ML para almacén: {codigo_almacen}")
    
    try:
        # Validar que el almacén existe en el catálogo
        if codigo_almacen not in ml_engine.ml_warehouses:
            raise ValueError(f"Almacén {codigo_almacen} no encontrado en catálogo ML")
        
        almacen_info = ml_engine.ml_warehouses[codigo_almacen]
        print(f"📍 Analizando: {almacen_info['nombre']} - {almacen_info['municipio']}, {almacen_info['estado']}")
        
        # Obtener fecha de análisis
        if not fecha_analisis:
            fecha_analisis = datetime.now().strftime("%Y-%m-%d")
        
        # 1. Obtener datos gubernamentales para la ubicación
        datos_gubernamentales = await _get_government_data_for_warehouse(almacen_info)
        
        # 2. Analizar historial específico del almacén
        datos_historicos = _analyze_warehouse_history(ml_engine.historical_data.get(codigo_almacen, {}))
        
        # 3. Calcular factores estacionales y temporales
        factores_temporales = _calculate_seasonal_factors(fecha_analisis, almacen_info, 
                                                         ml_engine.historical_data.get(codigo_almacen, {}))
        
        # 4. Evaluar movimientos sociales próximos
        movimientos_proximos = _evaluate_upcoming_social_movements(codigo_almacen, fecha_analisis, 
                                                                  ml_engine.historical_data.get(codigo_almacen, {}))
        
        # 5. Calcular riesgo específico por escenario
        riesgos_por_escenario = _calculate_scenario_specific_risks(
            scenarios, almacen_info, datos_historicos, datos_gubernamentales
        )
        
        # 6. Aplicar medidas de seguridad específicas ML
        factor_proteccion_ml = _calculate_ml_protection_factor(security_measures, almacen_info)
        
        # 7. Generar resultado integrado
        resultado_ml = _generate_ml_integrated_result(
            almacen_info, datos_historicos, datos_gubernamentales, factores_temporales,
            movimientos_proximos, riesgos_por_escenario, factor_proteccion_ml, scenarios, security_measures
        )
        
        return resultado_ml
        
    except Exception as e:
        logger.error(f"Error en análisis ML especializado: {e}")
        raise Exception(f"Error en motor ML: {e}")

async def _get_government_data_for_warehouse(almacen_info: Dict[str, Any]) -> Dict[str, Any]:
    """Obtiene datos gubernamentales para la ubicación del almacén"""
    try:
        # Usar el motor super integrado para obtener datos gubernamentales
        datos_gov = await calculate_super_integrated_risk(
            municipio=almacen_info['municipio'],
            estado=almacen_info['estado'],
            business_type="almacen",
            business_value=almacen_info['valor_inventario_promedio'],
            scenarios=["robo_mercancia"],
            security_measures=["camaras"],
            ambito="industrial"
        )
        return datos_gov
    except Exception as e:
        logger.warning(f"Error obteniendo datos gubernamentales: {e}")
        return {}

def _analyze_warehouse_history(historical_data: Dict[str, Any]) -> Dict[str, Any]:
    """Analiza el historial de incidentes del almacén"""
    if not historical_data:
        return {"incidentes_totales": 0, "riesgo_historico": 20.0}
    
    incidentes = historical_data.get("incidentes_historicos", [])
    
    # Calcular métricas históricas
    total_incidentes = len(incidentes)
    impacto_promedio = sum(i.get("impacto_operacional", 0) for i in incidentes) / max(total_incidentes, 1)
    costo_promedio = sum(i.get("costo_estimado", 0) for i in incidentes) / max(total_incidentes, 1)
    
    # Calcular riesgo histórico base
    riesgo_historico = min(50.0, 20.0 + (total_incidentes * 3) + (impacto_promedio * 0.2))
    
    return {
        "incidentes_totales": total_incidentes,
        "impacto_operacional_promedio": round(impacto_promedio, 1),
        "costo_promedio": round(costo_promedio, 0),
        "riesgo_historico": round(riesgo_historico, 1),
        "tipos_incidentes_frecuentes": _get_frequent_incident_types(incidentes)
    }

def _get_frequent_incident_types(incidentes: List[Dict]) -> List[str]:
    """Identifica tipos de incidentes más frecuentes"""
    tipos = {}
    for incidente in incidentes:
        tipo = incidente.get("tipo", "unknown")
        tipos[tipo] = tipos.get(tipo, 0) + 1
    
    return sorted(tipos.keys(), key=lambda x: tipos[x], reverse=True)[:3]

def _calculate_seasonal_factors(fecha_analisis: str, almacen_info: Dict[str, Any], 
                               historical_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calcula factores estacionales basados en patrones ML"""
    try:
        fecha_obj = datetime.strptime(fecha_analisis, "%Y-%m-%d")
        mes_actual = fecha_obj.strftime("%B").lower()
        
        patrones = historical_data.get("patrones_identificados", {})
        temporadas = patrones.get("temporadas_criticas", {})
        
        factor_estacional = 1.0
        temporada_activa = "normal"
        
        # Verificar temporadas críticas
        for temporada, meses in temporadas.items():
            if mes_actual in meses or fecha_obj.month in [11, 12]:  # Nov-Dic siempre críticos
                factor_estacional = meses.get(mes_actual, 1.4)
                temporada_activa = temporada
                break
        
        return {
            "factor_estacional": factor_estacional,
            "temporada_activa": temporada_activa,
            "mes_analisis": mes_actual,
            "ajuste_riesgo": (factor_estacional - 1.0) * 100
        }
    except Exception as e:
        return {"factor_estacional": 1.0, "temporada_activa": "normal", "ajuste_riesgo": 0}

def _evaluate_upcoming_social_movements(codigo_almacen: str, fecha_analisis: str, 
                                       historical_data: Dict[str, Any]) -> Dict[str, Any]:
    """Evalúa movimientos sociales próximos que puedan afectar operaciones"""
    try:
        fecha_obj = datetime.strptime(fecha_analisis, "%Y-%m-%d")
        
        movimientos_historicos = historical_data.get("movimientos_sociales_historicos", [])
        movimientos_proximos = []
        
        # Buscar movimientos recurrentes próximos (siguientes 30 días)
        for movimiento in movimientos_historicos:
            if movimiento.get("recurrencia") == "anual":
                # Calcular próxima fecha del evento anual
                fecha_historica = datetime.strptime(movimiento["fecha"], "%Y-%m-%d")
                proxima_fecha = fecha_historica.replace(year=fecha_obj.year)
                
                # Si ya pasó este año, calcular para el siguiente
                if proxima_fecha < fecha_obj:
                    proxima_fecha = proxima_fecha.replace(year=fecha_obj.year + 1)
                
                # Si está en los próximos 60 días
                dias_diferencia = (proxima_fecha - fecha_obj).days
                if 0 <= dias_diferencia <= 60:
                    movimientos_proximos.append({
                        **movimiento,
                        "proxima_fecha": proxima_fecha.strftime("%Y-%m-%d"),
                        "dias_restantes": dias_diferencia
                    })
        
        riesgo_movimientos = sum(
            30 if m.get("nivel_afectacion") == "crítico" else 
            20 if m.get("nivel_afectacion") == "alto" else 10
            for m in movimientos_proximos
        )
        
        return {
            "movimientos_proximos": movimientos_proximos,
            "total_eventos": len(movimientos_proximos),
            "riesgo_movimientos_sociales": min(40.0, riesgo_movimientos),
            "alertas": [f"Evento {m['tipo']} programado para {m['proxima_fecha']}" 
                       for m in movimientos_proximos[:3]]
        }
    except Exception as e:
        return {"movimientos_proximos": [], "total_eventos": 0, "riesgo_movimientos_sociales": 0, "alertas": []}

def _calculate_scenario_specific_risks(scenarios: List[str], almacen_info: Dict[str, Any],
                                     datos_historicos: Dict[str, Any], datos_gubernamentales: Dict[str, Any]) -> Dict[str, float]:
    """Calcula riesgo específico por escenario basado en contexto ML"""
    if not scenarios:
        return {}
    
    # Mapeo de escenarios ML específicos (ACTUALIZADO PARA FRONTEND)
    ml_scenario_weights = {
        # Escenarios originales ML
        'robo_mercancia_transito': 18.0,    # Durante carga/descarga
        'intrusion_almacen_nocturna': 15.0, # Fuera de horarios
        'robo_vehiculo_reparto': 12.0,      # A repartidores
        'extorsion_operacional': 25.0,      # Impacto operacional alto
        'bloqueo_carretero': 20.0,          # Afecta distribución
        'robo_mercancia': 14.0,             # General
        'vandalismo': 8.0,                  # Menor impacto
        'manifestaciones': 16.0,            # Afecta operaciones
        
        # Escenarios del frontend (NUEVOS)
        'intrusion_armada': 32.0,           # Escenario crítico ML - más alto
        'bloqueo_social': 15.0,             # Bloqueos/manifestaciones
        'intrusion_nocturna': 18.0,         # Intrusión nocturna
        'ocupacion_ilegal': 25.0,           # Ocupación terreno
        'robo_transporte': 20.0,            # Robo en tránsito
        'extorsion': 28.0,                  # Extorsión
        'sabotaje': 24.0,                   # Sabotaje operacional
        'secuestro_personal': 35.0,         # Escenario más crítico
        'robo_vehicular': 16.0,             # Robo vehículos
        'vandalismo_instalaciones': 12.0,   # Daño instalaciones
        'manifestacion_bloqueo': 14.0,      # Manifestaciones
        'robo_mercancia_almacen': 22.0,     # Robo en almacén
        'incendio_intencional': 30.0,       # Incendio provocado
        'ciberataque': 26.0,                # Ataques digitales
        'espionaje_industrial': 20.0,       # Espionaje
        'amenaza_bomba': 40.0,              # Amenaza más crítica
        'invasion_terreno': 18.0            # Invasión propiedad
    }
    
    riesgos_escenarios = {}
    tipos_frecuentes = datos_historicos.get("tipos_incidentes_frecuentes", [])
    
    for scenario in scenarios:
        # Peso base del escenario
        riesgo_base = ml_scenario_weights.get(scenario, 10.0)
        
        # Ajuste por historial del almacén
        if scenario in tipos_frecuentes:
            riesgo_base *= 1.3  # 30% más si ha ocurrido antes
        
        # Ajuste por características del almacén
        if scenario in ['robo_mercancia_transito', 'robo_vehiculo_reparto']:
            if almacen_info.get('volumen_diario_promedio', 0) > 1000:
                riesgo_base *= 1.15  # Más volumen = más riesgo
        
        if scenario in ['intrusion_almacen_nocturna']:
            if almacen_info.get('horario_operacion') == '24_7':
                riesgo_base *= 0.85  # Operación continua reduce riesgo
        
        # Ajuste por valor de inventario
        if almacen_info.get('valor_inventario_promedio', 0) > 3000000:
            riesgo_base *= 1.1  # Inventario alto = más atractivo
        
        riesgos_escenarios[scenario] = round(min(35.0, riesgo_base), 1)
    
    return riesgos_escenarios

def _calculate_ml_protection_factor(security_measures: List[str], almacen_info: Dict[str, Any]) -> float:
    """Calcula factor de protección específico para operaciones ML"""
    if not security_measures:
        return 1.0
    
    # Medidas específicas ML con mayor efectividad (ACTUALIZADO PARA FRONTEND)
    ml_security_weights = {
        # Medidas originales ML
        'escolta_vehiculos': 0.25,           # 25% reducción en tránsito
        'coordinacion_policial': 0.20,      # 20% reducción general
        'rutas_variables': 0.15,            # 15% reducción emboscadas
        'gps_avanzado': 0.18,               # 18% reducción vehículos
        'guardias_24_7': 0.30,              # 30% reducción nocturno
        'camaras_perimetrales': 0.12,       # 12% reducción intrusión
        'control_acceso_biometrico': 0.10,  # 10% reducción acceso
        'sistemas_alarma': 0.08,            # 8% reducción general
        'comunicacion_continua': 0.12,      # 12% reducción reparto
        'rutas_seguras': 0.14,              # 14% reducción tránsito
        
        # Medidas del frontend (NUEVAS - MÁS EFECTIVAS PARA ML)
        'camaras': 0.15,                    # Cámaras de seguridad
        'guardias': 0.25,                   # Personal de seguridad
        'sistemas_intrusion': 0.18,        # Sistemas detección
        'control_acceso': 0.12,             # Control de acceso
        'iluminacion': 0.08,                # Iluminación
        'plumas_acceso': 0.10,              # Plumas/barreras
        'bolardos': 0.06,                   # Bolardos seguridad
        'poncha_llantas': 0.12,             # Poncha llantas
        'casetas_seguridad': 0.20,          # Casetas vigilancia
        'camaras_acceso': 0.14,             # Cámaras acceso
        'torniquetes': 0.16,                # Torniquetes
        'rfid_acceso': 0.11,                # RFID acceso
        'radios_comunicacion': 0.13,        # Comunicación
        'centro_monitoreo': 0.22,           # Centro monitoreo
        'botones_panico': 0.09,             # Botones pánico
        'bardas_perimetrales': 0.17,        # Bardas perimetrales
        'sensores_movimiento': 0.14,        # Sensores movimiento
        'detectores_metales': 0.19,         # Detectores metales
        'videoanalytica_ia': 0.21,          # Video analytics IA
        'patrullajes_aleatorios': 0.16,     # Patrullajes
        'iluminacion_inteligente': 0.10,    # Iluminación smart
        'comunicacion_redundante': 0.15,    # Comunicación backup
        'verificacion_biometrica': 0.18,    # Biometría
        'cercas_electrificadas': 0.23,      # Cercas eléctricas
        'anti_drones': 0.12,                # Anti-drones
        'monitoreo_sismico': 0.08,          # Monitoreo sísmico
        'acceso_por_zonas': 0.13,           # Control zonas
        'evacuacion_automatizada': 0.11,    # Evacuación auto
        'protocolos_lockdown': 0.20,        # Protocolos cierre
        'coordinacion_autoridades': 0.24,   # Coordinación autoridades
        'alerta_temprana': 0.17             # Sistema alerta temprana
    }
    
    reduccion_total = 0.0
    
    # Aplicar reducciones por medidas implementadas
    for medida in security_measures:
        reduccion_total += ml_security_weights.get(medida, 0.02)  # 2% por medida no específica
    
    # Bonificación por medidas preexistentes del almacén
    if almacen_info.get('personal_seguridad'):
        reduccion_total += 0.15
    if almacen_info.get('camaras_perimetrales'):
        reduccion_total += 0.10
    if almacen_info.get('control_acceso_biometrico'):
        reduccion_total += 0.08
    if almacen_info.get('sistemas_alarma'):
        reduccion_total += 0.06
    
    # Bonificación por sinergia (múltiples medidas)
    if len(security_measures) >= 4:
        reduccion_total += 0.10  # 10% adicional por sinergia
    
    # Máximo 50% de reducción para ML (más agresivo que modelo general)
    reduccion_total = min(0.50, reduccion_total)
    
    return 1.0 - reduccion_total

def _generate_ml_integrated_result(almacen_info: Dict[str, Any], datos_historicos: Dict[str, Any],
                                  datos_gubernamentales: Dict[str, Any], factores_temporales: Dict[str, Any],
                                  movimientos_proximos: Dict[str, Any], riesgos_por_escenario: Dict[str, float],
                                  factor_proteccion: float, scenarios: List[str], security_measures: List[str]) -> Dict[str, Any]:
    """Genera resultado integrado del análisis ML"""
    
    # Cálculo híbrido del riesgo final (MEJORADO)
    riesgo_historico = datos_historicos.get("riesgo_historico", 20.0)
    riesgo_gubernamental = datos_gubernamentales.get("riesgo_general", 40.0) if datos_gubernamentales else 40.0
    riesgo_movimientos = movimientos_proximos.get("riesgo_movimientos_sociales", 0.0)
    factor_estacional = factores_temporales.get("factor_estacional", 1.0)
    
    # Calcular riesgo promedio por escenarios (más dinámico)
    riesgo_escenarios = 0.0
    if riesgos_por_escenario:
        riesgo_escenarios = sum(riesgos_por_escenario.values()) / len(riesgos_por_escenario)
    else:
        riesgo_escenarios = 15.0  # Valor por defecto si no hay escenarios
    
    # Ponderación híbrida ML MEJORADA (más peso a escenarios y medidas)
    riesgo_base_hibrido = (
        riesgo_historico * 0.25 +           # 25% experiencia ML (reducido)
        riesgo_gubernamental * 0.25 +       # 25% datos oficiales (reducido)  
        riesgo_movimientos * 0.15 +         # 15% movimientos sociales (reducido)
        riesgo_escenarios * 0.35            # 35% escenarios específicos (AUMENTADO)
    )
    
    # Aplicar factor estacional
    riesgo_ajustado = riesgo_base_hibrido * factor_estacional
    
    # Aplicar factor de protección ML (MAS IMPACTO)
    riesgo_final = riesgo_ajustado * factor_proteccion
    
    # Agregar variabilidad basada en número de medidas de seguridad
    if security_measures:
        num_medidas = len(security_measures)
        if num_medidas >= 20:
            riesgo_final *= 0.85  # 15% reducción adicional por muchas medidas
        elif num_medidas >= 15:
            riesgo_final *= 0.90  # 10% reducción adicional
        elif num_medidas >= 10:
            riesgo_final *= 0.95  # 5% reducción adicional
    
    # Aplicar variabilidad por escenario específico
    if scenarios:
        escenarios_criticos = ['intrusion_armada', 'secuestro_personal', 'amenaza_bomba', 'incendio_intencional']
        escenarios_bajos = ['bloqueo_social', 'intrusion_nocturna', 'vandalismo_instalaciones']
        
        tiene_critico = any(s in escenarios_criticos for s in scenarios)
        tiene_bajo = all(s in escenarios_bajos for s in scenarios)
        
        if tiene_critico:
            riesgo_final *= 1.2  # 20% más riesgo por escenarios críticos
        elif tiene_bajo:
            riesgo_final *= 0.8  # 20% menos riesgo por escenarios bajos
    
    riesgo_final = max(5, min(95, riesgo_final))  # Rango 5-95% para más variabilidad
    
    # Determinar nivel de riesgo (RANGOS MEJORADOS)
    if riesgo_final <= 20:
        nivel_riesgo = "BAJO"
        color_riesgo = "#4CAF50"
    elif riesgo_final <= 40:
        nivel_riesgo = "MEDIO"
        color_riesgo = "#FF9800"
    elif riesgo_final <= 65:
        nivel_riesgo = "ALTO"
        color_riesgo = "#F44336"
    else:
        nivel_riesgo = "CRÍTICO"
        color_riesgo = "#D32F2F"
    
    # Generar recomendaciones ML específicas
    recomendaciones_ml = _generate_ml_recommendations(
        riesgo_final, almacen_info, datos_historicos, movimientos_proximos, 
        scenarios, security_measures
    )
    
    return {
        "riesgo_general": round(riesgo_final, 1),
        "nivel_riesgo": nivel_riesgo,
        "color_riesgo": color_riesgo,
        "motor_usado": "ML Especializado v1.0",
        "almacen": {
            "codigo": almacen_info["codigo"],
            "nombre": almacen_info["nombre"],
            "ubicacion": f"{almacen_info['municipio']}, {almacen_info['estado']}",
            "coordenadas": almacen_info["coordenadas"]
        },
        "escenarios_analizados": scenarios or [],
        "riesgos_por_escenario": riesgos_por_escenario,
        "medidas_seguridad_count": len(security_measures) if security_measures else 0,
        "timestamp": datetime.now().isoformat(),
        "analisis_hibrido": {
            "riesgo_historico_ml": round(riesgo_historico, 1),
            "riesgo_gubernamental": round(riesgo_gubernamental, 1),
            "riesgo_movimientos_sociales": round(riesgo_movimientos, 1),
            "riesgo_escenarios": round(riesgo_escenarios, 1),
            "factor_estacional": round(factor_estacional, 2),
            "factor_proteccion_ml": round(factor_proteccion, 2),
            "ponderacion": "Histórico ML 25% + Gubernamental 25% + Movimientos 15% + Escenarios 35%"
        },
        "contexto_almacen": {
            "volumen_diario": almacen_info.get("volumen_diario_promedio", 0),
            "valor_inventario": almacen_info.get("valor_inventario_promedio", 0),
            "operacion_24_7": almacen_info.get("horario_operacion") == "24_7",
            "incidentes_historicos": datos_historicos.get("incidentes_totales", 0),
            "temporada_actual": factores_temporales.get("temporada_activa", "normal")
        },
        "alertas_proximas": movimientos_proximos.get("alertas", []),
        "datos_criminalidad": datos_gubernamentales.get("datos_criminalidad", {}) if datos_gubernamentales else {},
        "recomendaciones": recomendaciones_ml
    }

def _generate_ml_recommendations(riesgo_final: float, almacen_info: Dict[str, Any],
                                datos_historicos: Dict[str, Any], movimientos_proximos: Dict[str, Any],
                                scenarios: List[str], security_measures: List[str]) -> List[str]:
    """Genera recomendaciones específicas para operaciones ML"""
    recomendaciones = []
    
    # Recomendaciones por nivel de riesgo ML
    if riesgo_final > 70:
        recomendaciones.extend([
            "🚨 CRÍTICO: Implementar protocolo de seguridad ML nivel máximo",
            "👮 Contratar seguridad privada especializada en logística",
            "🚛 Suspender operaciones nocturnas temporalmente",
            "📱 Activar monitoreo en tiempo real de todos los vehículos"
        ])
    elif riesgo_final > 45:
        recomendaciones.extend([
            "⚠️ ALTO: Reforzar medidas durante horarios vulnerables",
            "🗺️ Implementar rutas alternativas para distribución",
            "📞 Coordinar con autoridades locales de seguridad"
        ])
    else:
        recomendaciones.extend([
            "✅ Mantener protocolos actuales ML",
            "📊 Monitoreo preventivo de patrones de riesgo"
        ])
    
    # Recomendaciones por historial específico del almacén
    tipos_frecuentes = datos_historicos.get("tipos_incidentes_frecuentes", [])
    if "robo_mercancia_transito" in tipos_frecuentes:
        recomendaciones.append("🚛 Reforzar seguridad durante carga/descarga")
    if "bloqueo_carretero" in tipos_frecuentes:
        recomendaciones.append("🛣️ Diversificar rutas de distribución principales")
    
    # Recomendaciones por movimientos sociales próximos
    if movimientos_proximos.get("total_eventos", 0) > 0:
        recomendaciones.append("📅 Planificar operaciones considerando eventos próximos")
        recomendaciones.append("🚚 Activar rutas de contingencia para fechas críticas")
    
    # Recomendaciones por escenarios específicos ML
    if scenarios:
        if 'robo_mercancia_transito' in scenarios:
            recomendaciones.append("🔒 Implementar escort vehicular para mercancía de alto valor")
        if 'extorsion_operacional' in scenarios:
            recomendaciones.append("📞 Establecer línea directa con unidad anti-extorsión")
        if 'bloqueo_carretero' in scenarios:
            recomendaciones.append("🗺️ Mapear y validar rutas alternativas semanalmente")
    
    # Recomendaciones por características del almacén
    if almacen_info.get("volumen_diario_promedio", 0) > 1500:
        recomendaciones.append("📦 Considerar fraccionamiento de envíos de alto volumen")
    
    if almacen_info.get("horario_operacion") == "24_7":
        recomendaciones.append("🌙 Reforzar seguridad perimetral durante horario nocturno")
    
    return recomendaciones[:10]  # Máximo 10 recomendaciones específicas
