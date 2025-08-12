"""
API Endpoints especializados para análisis de riesgo Mercado Libre
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import logging

from ..ml_specialized_engine import calculate_ml_specialized_risk, MLRiskEngine

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ml", tags=["Mercado Libre Especializado"])

class MLRiskRequest(BaseModel):
    warehouse_id: str  # Cambio de codigo_almacen a warehouse_id para consistencia
    scenarios: Optional[List[str]] = None
    security_measures: Optional[List[str]] = None
    fecha_analisis: Optional[str] = None
    location_data: Optional[Dict[str, Any]] = None  # Para almacenes del JSON principal

class MLWarehouseInfo(BaseModel):
    codigo: str
    nombre: str
    municipio: str
    estado: str
    coordenadas: Dict[str, float]

@router.get("/warehouses", response_model=List[MLWarehouseInfo])
async def get_ml_warehouses():
    """
    Obtiene catálogo completo de almacenes Mercado Libre
    """
    try:
        ml_engine = MLRiskEngine()
        warehouses = []
        
        print(f"🏭 Total de almacenes ML cargados: {len(ml_engine.ml_warehouses)}")
        for codigo, info in ml_engine.ml_warehouses.items():
            print(f"   - {codigo}: {info['nombre']}")
            warehouses.append(MLWarehouseInfo(
                codigo=info["codigo"],
                nombre=info["nombre"],
                municipio=info["municipio"],
                estado=info["estado"],
                coordenadas=info["coordenadas"]
            ))
        
        return warehouses
        
    except Exception as e:
        logger.error(f"Error obteniendo almacenes ML: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno: {e}")

@router.get("/warehouse/{codigo_almacen}")
async def get_warehouse_details(codigo_almacen: str):
    """
    Obtiene detalles específicos de un almacén ML
    """
    try:
        ml_engine = MLRiskEngine()
        
        if codigo_almacen not in ml_engine.ml_warehouses:
            raise HTTPException(status_code=404, detail=f"Almacén {codigo_almacen} no encontrado")
        
        almacen_info = ml_engine.ml_warehouses[codigo_almacen]
        historical_info = ml_engine.historical_data.get(codigo_almacen, {})
        
        # Calcular estadísticas históricas
        incidentes = historical_info.get("incidentes_historicos", [])
        total_incidentes = len(incidentes)
        
        return {
            "almacen": almacen_info,
            "estadisticas_historicas": {
                "total_incidentes": total_incidentes,
                "ultimo_incidente": incidentes[0]["fecha"] if incidentes else None,
                "tipos_incidentes": list(set(i.get("tipo", "") for i in incidentes)),
                "patrones_identificados": historical_info.get("patrones_identificados", {})
            },
            "movimientos_sociales": {
                "eventos_historicos": len(historical_info.get("movimientos_sociales_historicos", [])),
                "proximos_eventos": []  # Se calculará en análisis de riesgo
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo detalles almacén {codigo_almacen}: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno: {e}")

@router.post("/calculate-risk")
async def calculate_ml_risk(request: MLRiskRequest):
    """
    Calcula riesgo especializado para almacén específico de Mercado Libre
    """
    try:
        print(f"🏭 Solicitando análisis ML para almacén: {request.warehouse_id}")
        
        # Si incluye location_data, agregar temporalmente el almacén al catálogo
        ml_engine = MLRiskEngine()
        if request.location_data and request.warehouse_id not in ml_engine.ml_warehouses:
            print(f"📍 Agregando almacén temporal con datos de ubicación: {request.warehouse_id}")
            
            # Crear entrada temporal con datos básicos
            ml_engine.ml_warehouses[request.warehouse_id] = {
                "codigo": request.warehouse_id,
                "nombre": f"Almacén ML {request.warehouse_id}",
                "municipio": request.location_data.get("municipio", "México"),
                "estado": request.location_data.get("estado", "México"),
                "coordenadas": request.location_data.get("coordinates", {"lat": 0, "lng": 0}),
                "tipo_operacion": "fulfillment_center",
                "volumen_diario_promedio": 1500,
                "valor_inventario_promedio": 3000000,
                "horario_operacion": "24_7",
                "personal_seguridad": True,
                "camaras_perimetrales": True,
                "control_acceso_biometrico": True,
                "sistemas_alarma": True,
                "rutas_principales": ["Principal"],
                "vulnerabilities_identificadas": ["evaluacion_inicial"]
            }
        
        resultado = await calculate_ml_specialized_risk(
            codigo_almacen=request.warehouse_id,
            scenarios=request.scenarios,
            security_measures=request.security_measures,
            fecha_analisis=request.fecha_analisis
        )
        
        return resultado
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error calculando riesgo ML: {e}")
        raise HTTPException(status_code=500, detail=f"Error en análisis ML: {e}")

@router.get("/scenarios")
async def get_ml_scenarios():
    """
    Obtiene catálogo de escenarios específicos para operaciones ML
    """
    return {
        "escenarios_ml": [
            {
                "codigo": "robo_mercancia_transito",
                "nombre": "Robo de mercancía en tránsito",
                "descripcion": "Durante procesos de carga/descarga",
                "criticidad": "media-alta"
            },
            {
                "codigo": "intrusion_almacen_nocturna", 
                "nombre": "Intrusión nocturna al almacén",
                "descripcion": "Fuera de horarios operativos",
                "criticidad": "alta"
            },
            {
                "codigo": "robo_vehiculo_reparto",
                "nombre": "Robo a vehículo de reparto",
                "descripcion": "Asalto a repartidores en ruta",
                "criticidad": "media"
            },
            {
                "codigo": "extorsion_operacional",
                "nombre": "Extorsión operacional",
                "descripcion": "Amenazas que afectan operaciones",
                "criticidad": "alta"
            },
            {
                "codigo": "bloqueo_carretero",
                "nombre": "Bloqueo de carreteras",
                "descripcion": "Manifestaciones que afectan distribución",
                "criticidad": "alta"
            },
            {
                "codigo": "intrusion_armada",
                "nombre": "Intrusión armada",
                "descripcion": "Asalto con armas a instalaciones",
                "criticidad": "crítica"
            },
            {
                "codigo": "vandalismo",
                "nombre": "Vandalismo",
                "descripcion": "Daños a infraestructura",
                "criticidad": "baja"
            },
            {
                "codigo": "manifestaciones",
                "nombre": "Manifestaciones cercanas",
                "descripcion": "Protestas que pueden afectar accesos",
                "criticidad": "media"
            }
        ]
    }

@router.get("/security-measures")
async def get_ml_security_measures():
    """
    Obtiene catálogo de medidas de seguridad específicas para ML
    """
    return {
        "medidas_ml": [
            {
                "codigo": "escolta_vehiculos",
                "nombre": "Escolta de vehículos",
                "descripcion": "Acompañamiento de seguridad para transporte",
                "efectividad": "alta",
                "tipo": "transito"
            },
            {
                "codigo": "coordinacion_policial",
                "nombre": "Coordinación policial",
                "descripcion": "Comunicación directa con autoridades",
                "efectividad": "alta",
                "tipo": "institucional"
            },
            {
                "codigo": "rutas_variables",
                "nombre": "Rutas variables",
                "descripcion": "Alternancia de rutas de distribución",
                "efectividad": "media-alta",
                "tipo": "operacional"
            },
            {
                "codigo": "gps_avanzado",
                "nombre": "GPS avanzado",
                "descripcion": "Monitoreo en tiempo real de vehículos",
                "efectividad": "alta",
                "tipo": "tecnologico"
            },
            {
                "codigo": "guardias_24_7",
                "nombre": "Guardias 24/7",
                "descripcion": "Personal de seguridad permanente",
                "efectividad": "muy_alta",
                "tipo": "perimetral"
            },
            {
                "codigo": "camaras_perimetrales",
                "nombre": "Cámaras perimetrales",
                "descripcion": "Videovigilancia del perímetro",
                "efectividad": "media-alta",
                "tipo": "perimetral"
            },
            {
                "codigo": "control_acceso_biometrico",
                "nombre": "Control de acceso biométrico",
                "descripcion": "Acceso controlado por biometría",
                "efectividad": "alta",
                "tipo": "acceso"
            },
            {
                "codigo": "sistemas_alarma",
                "nombre": "Sistemas de alarma",
                "descripcion": "Detección automática de intrusiones",
                "efectividad": "media",
                "tipo": "deteccion"
            },
            {
                "codigo": "comunicacion_continua",
                "nombre": "Comunicación continua",
                "descripcion": "Radio comunicación con repartidores",
                "efectividad": "media",
                "tipo": "comunicacion"
            },
            {
                "codigo": "rutas_seguras",
                "nombre": "Rutas seguras",
                "descripcion": "Mapeo de rutas de menor riesgo",
                "efectividad": "media",
                "tipo": "operacional"
            }
        ]
    }

@router.get("/warehouse/{codigo_almacen}/history")
async def get_warehouse_history(codigo_almacen: str):
    """
    Obtiene historial detallado de incidentes del almacén
    """
    try:
        ml_engine = MLRiskEngine()
        
        if codigo_almacen not in ml_engine.historical_data:
            raise HTTPException(status_code=404, detail=f"Historial para almacén {codigo_almacen} no encontrado")
        
        historical_data = ml_engine.historical_data[codigo_almacen]
        
        return {
            "codigo_almacen": codigo_almacen,
            "incidentes_historicos": historical_data.get("incidentes_historicos", []),
            "patrones_identificados": historical_data.get("patrones_identificados", {}),
            "movimientos_sociales_historicos": historical_data.get("movimientos_sociales_historicos", []),
            "estadisticas": {
                "total_incidentes": len(historical_data.get("incidentes_historicos", [])),
                "costo_total_estimado": sum(i.get("costo_estimado", 0) for i in historical_data.get("incidentes_historicos", [])),
                "tipos_mas_frecuentes": _get_most_frequent_types(historical_data.get("incidentes_historicos", []))
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo historial almacén {codigo_almacen}: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno: {e}")

def _get_most_frequent_types(incidentes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Obtiene tipos de incidentes más frecuentes con estadísticas"""
    tipos = {}
    for incidente in incidentes:
        tipo = incidente.get("tipo", "unknown")
        if tipo not in tipos:
            tipos[tipo] = {"count": 0, "total_cost": 0}
        tipos[tipo]["count"] += 1
        tipos[tipo]["total_cost"] += incidente.get("costo_estimado", 0)
    
    # Ordenar por frecuencia
    tipos_ordenados = sorted(tipos.items(), key=lambda x: x[1]["count"], reverse=True)
    
    return [
        {
            "tipo": tipo,
            "frecuencia": stats["count"],
            "costo_promedio": stats["total_cost"] / stats["count"]
        }
        for tipo, stats in tipos_ordenados[:5]
    ]

@router.get("/analytics/risk-trends/{codigo_almacen}")
async def get_risk_trends(codigo_almacen: str, days: int = Query(30, description="Días hacia atrás para análisis")):
    """
    Obtiene tendencias de riesgo para el almacén en período específico
    """
    try:
        ml_engine = MLRiskEngine()
        
        if codigo_almacen not in ml_engine.ml_warehouses:
            raise HTTPException(status_code=404, detail=f"Almacén {codigo_almacen} no encontrado")
        
        # Por ahora simulamos tendencias - en implementación real consultaría BD histórica
        fecha_actual = datetime.now()
        tendencias = []
        
        for i in range(days, 0, -1):
            fecha = fecha_actual - timedelta(days=i)
            # Simular riesgo basado en patrones estacionales
            riesgo_base = 35.0
            if fecha.month in [11, 12]:  # Temporada alta
                riesgo_base *= 1.4
            if fecha.weekday() in [4, 5, 6]:  # Fin de semana
                riesgo_base *= 1.1
                
            tendencias.append({
                "fecha": fecha.strftime("%Y-%m-%d"),
                "riesgo_calculado": round(min(80.0, riesgo_base), 1),
                "incidentes_reportados": 1 if i % 15 == 0 else 0  # Simular incidente cada 15 días
            })
        
        return {
            "codigo_almacen": codigo_almacen,
            "periodo_analisis": f"{days} días",
            "tendencias": tendencias,
            "resumen": {
                "riesgo_promedio": round(sum(t["riesgo_calculado"] for t in tendencias) / len(tendencias), 1),
                "picos_riesgo": len([t for t in tendencias if t["riesgo_calculado"] > 50]),
                "total_incidentes": sum(t["incidentes_reportados"] for t in tendencias)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo tendencias almacén {codigo_almacen}: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno: {e}")

from datetime import timedelta
