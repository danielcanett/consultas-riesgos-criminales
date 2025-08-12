"""
Expansión de conectores INEGI para datos socioeconómicos completos
"""
import requests
import pandas as pd
import json
from typing import Dict, List, Optional
import asyncio
import aiohttp
from datetime import datetime

class INEGIExpandedConnector:
    """Conector expandido para datos socioeconómicos detallados de INEGI"""
    
    def __init__(self):
        self.base_url = "https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/"
        self.denue_base_url = "https://www.inegi.org.mx/app/api/denue/v1/Buscar/"
        
        # Indicadores socioeconómicos clave para análisis de riesgo
        self.indicadores_riesgo = {
            'pib_municipal': '6207019014',  # PIB municipal
            'poblacion_ocupada': '6207020032',  # Población económicamente activa ocupada
            'densidad_comercial': '6207021045',  # Unidades económicas por km²
            'ingreso_promedio': '6207022011',  # Ingreso promedio mensual
            'desempleo': '6207020033',  # Tasa de desempleo
            'pobreza': '6207023001',  # Porcentaje de población en pobreza
            'educacion': '6207024012',  # Nivel de escolaridad promedio
            'servicios_salud': '6207025003'  # Cobertura de servicios de salud
        }
        
        # Códigos SCIAN para tipos de negocio relevantes
        self.scian_codes = {
            'comercio_retail': '461',  # Comercio al por menor
            'almacenes_depositos': '493',  # Almacenamiento
            'transporte_carga': '484',  # Transporte de carga
            'servicios_financieros': '522',  # Instituciones de crédito
            'centros_comerciales': '531',  # Servicios inmobiliarios
        }
    
    async def get_socioeconomic_data(self, codigo_municipio: str) -> Dict:
        """Obtiene datos socioeconómicos completos por municipio"""
        print(f"📊 Obteniendo datos socioeconómicos INEGI para municipio: {codigo_municipio}")
        
        socioeconomic_data = {
            'codigo_municipio': codigo_municipio,
            'fecha_consulta': datetime.now().isoformat(),
            'indicadores': {},
            'densidad_comercial': {},
            'contexto_economico': {}
        }
        
        # Obtener cada indicador socioeconómico
        async with aiohttp.ClientSession() as session:
            tasks = []
            for nombre_indicador, codigo_indicador in self.indicadores_riesgo.items():
                task = self._get_indicador_data(session, codigo_indicador, codigo_municipio, nombre_indicador)
                tasks.append(task)
            
            resultados = await asyncio.gather(*tasks, return_exceptions=True)
            
            for resultado in resultados:
                if isinstance(resultado, dict) and 'indicador' in resultado:
                    socioeconomic_data['indicadores'][resultado['indicador']] = resultado['valor']
        
        # Obtener densidad comercial por tipo de negocio
        for tipo_negocio, scian_code in self.scian_codes.items():
            try:
                densidad = await self._get_business_density(codigo_municipio, scian_code)
                socioeconomic_data['densidad_comercial'][tipo_negocio] = densidad
            except Exception as e:
                print(f"⚠️ Error obteniendo densidad para {tipo_negocio}: {e}")
                socioeconomic_data['densidad_comercial'][tipo_negocio] = None
        
        # Calcular contexto económico para análisis de riesgo
        socioeconomic_data['contexto_economico'] = self._calculate_economic_context(socioeconomic_data)
        
        return socioeconomic_data
    
    async def _get_indicador_data(self, session: aiohttp.ClientSession, codigo_indicador: str, 
                                 codigo_municipio: str, nombre_indicador: str) -> Dict:
        """Obtiene un indicador específico de INEGI"""
        try:
            url = f"{self.base_url}{codigo_indicador}/es/0700/false/BIE/2.0/{codigo_municipio}?type=json"
            
            async with session.get(url, timeout=30) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Procesar respuesta de INEGI API
                    if 'Series' in data and len(data['Series']) > 0:
                        serie = data['Series'][0]
                        if 'OBSERVATIONS' in serie and len(serie['OBSERVATIONS']) > 0:
                            ultimo_valor = serie['OBSERVATIONS'][-1]['OBS_VALUE']
                            return {
                                'indicador': nombre_indicador,
                                'valor': float(ultimo_valor) if ultimo_valor else None,
                                'periodo': serie['OBSERVATIONS'][-1]['TIME_PERIOD']
                            }
                
                return {'indicador': nombre_indicador, 'valor': None}
                
        except Exception as e:
            print(f"⚠️ Error obteniendo {nombre_indicador}: {e}")
            return {'indicador': nombre_indicador, 'valor': None}
    
    async def _get_business_density(self, codigo_municipio: str, scian_code: str) -> Optional[int]:
        """Obtiene densidad de negocios por código SCIAN usando DENUE"""
        try:
            # URL para consultar DENUE API
            url = f"{self.denue_base_url}Nombre/todos/Entidad//Municipio/{codigo_municipio}/Actividad/{scian_code}/"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=45) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        if isinstance(data, list):
                            return len(data)  # Número de establecimientos
                        elif isinstance(data, dict) and 'total' in data:
                            return data['total']
                        else:
                            return 0
                    else:
                        return None
                        
        except Exception as e:
            print(f"⚠️ Error consultando DENUE para SCIAN {scian_code}: {e}")
            return None
    
    def _calculate_economic_context(self, socioeconomic_data: Dict) -> Dict:
        """Calcula contexto económico para análisis de riesgo"""
        indicadores = socioeconomic_data.get('indicadores', {})
        densidad = socioeconomic_data.get('densidad_comercial', {})
        
        context = {
            'nivel_desarrollo': 'medio',  # bajo, medio, alto
            'actividad_comercial': 'media',  # baja, media, alta
            'vulnerabilidad_economica': 'media',  # baja, media, alta
            'factor_riesgo_economico': 1.0  # multiplicador para cálculo de riesgo
        }
        
        # Calcular nivel de desarrollo
        pib = indicadores.get('pib_municipal', 0) or 0
        ingreso = indicadores.get('ingreso_promedio', 0) or 0
        educacion = indicadores.get('educacion', 0) or 0
        
        desarrollo_score = 0
        if pib > 1000000: desarrollo_score += 1  # PIB alto
        if ingreso > 8000: desarrollo_score += 1  # Ingreso alto
        if educacion > 9: desarrollo_score += 1  # Educación alta
        
        if desarrollo_score >= 2:
            context['nivel_desarrollo'] = 'alto'
            context['factor_riesgo_economico'] = 0.8  # Menor riesgo
        elif desarrollo_score == 1:
            context['nivel_desarrollo'] = 'medio'
            context['factor_riesgo_economico'] = 1.0  # Riesgo neutral
        else:
            context['nivel_desarrollo'] = 'bajo'
            context['factor_riesgo_economico'] = 1.3  # Mayor riesgo
        
        # Calcular actividad comercial
        total_comercios = sum(v for v in densidad.values() if v is not None)
        if total_comercios > 500:
            context['actividad_comercial'] = 'alta'
        elif total_comercios > 100:
            context['actividad_comercial'] = 'media'
        else:
            context['actividad_comercial'] = 'baja'
        
        # Calcular vulnerabilidad económica
        desempleo = indicadores.get('desempleo', 0) or 0
        pobreza = indicadores.get('pobreza', 0) or 0
        
        if desempleo > 8 or pobreza > 40:
            context['vulnerabilidad_economica'] = 'alta'
            context['factor_riesgo_economico'] *= 1.2
        elif desempleo > 5 or pobreza > 25:
            context['vulnerabilidad_economica'] = 'media'
        else:
            context['vulnerabilidad_economica'] = 'baja'
            context['factor_riesgo_economico'] *= 0.9
        
        return context

# Función helper para uso en el motor de riesgo
async def get_enhanced_municipal_data(codigo_municipio: str) -> Dict:
    """Función principal para obtener datos municipales expandidos"""
    connector = INEGIExpandedConnector()
    return await connector.get_socioeconomic_data(codigo_municipio)
