"""
Conectores para Fiscalías Estatales - Datos oficiales de criminalidad local
"""
import requests
import pandas as pd
import json
from typing import Dict, List, Optional
import asyncio
import aiohttp
from datetime import datetime, timedelta
import re

class FiscaliasEstatalesConnector:
    """Conector para obtener datos de Fiscalías Estatales mexicanas"""
    
    def __init__(self):
        # URLs y endpoints de fiscalías estatales
        self.fiscalias_endpoints = {
            'estado_mexico': {
                'base_url': 'https://pgjem.edomex.gob.mx/api/',
                'estadisticas_url': 'https://pgjem.edomex.gob.mx/transparencia/estadisticas/',
                'carpetas_url': 'https://pgjem.edomex.gob.mx/carpetas-investigacion/',
                'municipios_clave': ['Tultepec', 'Ecatepec', 'Naucalpan', 'Cuautitlán'],
                'codigo_estado': '15'
            },
            'nuevo_leon': {
                'base_url': 'https://www.fiscalinl.gob.mx/api/',
                'estadisticas_url': 'https://www.fiscalinl.gob.mx/estadisticas/',
                'carpetas_url': 'https://www.fiscalinl.gob.mx/transparencia/carpetas/',
                'municipios_clave': ['Monterrey', 'Apodaca', 'San Nicolás', 'Guadalupe'],
                'codigo_estado': '19'
            },
            'jalisco': {
                'base_url': 'https://www.fiscalia.jalisco.gob.mx/api/',
                'estadisticas_url': 'https://www.fiscalia.jalisco.gob.mx/estadisticas/',
                'carpetas_url': 'https://www.fiscalia.jalisco.gob.mx/transparencia/',
                'municipios_clave': ['Guadalajara', 'Tlaquepaque', 'Zapopan', 'Tonalá'],
                'codigo_estado': '14'
            }
        }
        
        # Mapeo de delitos por fiscalía
        self.delitos_mapping = {
            'robo_negocio': ['robo a negocio', 'robo comercio', 'robo establecimiento'],
            'robo_vehiculo': ['robo vehículo', 'robo auto', 'robo transporte'],
            'extorsion': ['extorsión', 'amenazas', 'intimidación'],
            'homicidio': ['homicidio', 'asesinato', 'muerte violenta'],
            'secuestro': ['secuestro', 'privación libertad', 'plagio'],
            'fraude': ['fraude', 'estafa', 'abuso confianza'],
            'lesiones': ['lesiones', 'agresión', 'golpes'],
            'violencia_familiar': ['violencia familiar', 'violencia doméstica']
        }
    
    async def get_state_crime_data(self, estado: str, municipio: str) -> Dict:
        """Obtiene datos de criminalidad específicos por estado y municipio"""
        print(f"🏛️ Consultando Fiscalía Estatal: {estado} - {municipio}")
        
        if estado.lower().replace(' ', '_') not in self.fiscalias_endpoints:
            print(f"⚠️ Estado {estado} no configurado en fiscalías")
            return self._get_fallback_data(estado, municipio)
        
        fiscalia_config = self.fiscalias_endpoints[estado.lower().replace(' ', '_')]
        
        try:
            # Intentar obtener datos oficiales de la fiscalía
            data_oficial = await self._fetch_official_data(fiscalia_config, municipio)
            
            if data_oficial:
                return data_oficial
            else:
                # Fallback a web scraping si API no disponible
                return await self._scrape_fiscalia_data(fiscalia_config, municipio)
                
        except Exception as e:
            print(f"❌ Error consultando fiscalía {estado}: {e}")
            return self._get_fallback_data(estado, municipio)
    
    async def _fetch_official_data(self, fiscalia_config: Dict, municipio: str) -> Optional[Dict]:
        """Intenta obtener datos oficiales via API de la fiscalía"""
        try:
            async with aiohttp.ClientSession() as session:
                # Construir URL de consulta
                api_url = f"{fiscalia_config['base_url']}estadisticas/municipio/{municipio}"
                
                async with session.get(api_url, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._process_official_data(data, municipio, fiscalia_config)
                    else:
                        print(f"⚠️ API fiscalía no disponible: {response.status}")
                        return None
                        
        except Exception as e:
            print(f"⚠️ Error en API fiscalía: {e}")
            return None
    
    async def _scrape_fiscalia_data(self, fiscalia_config: Dict, municipio: str) -> Dict:
        """Web scraping de páginas de estadísticas de fiscalías"""
        print(f"🕷️ Haciendo scraping de datos de fiscalía para {municipio}")
        
        crime_data = {
            'municipio': municipio,
            'estado': fiscalia_config.get('codigo_estado'),
            'fuente': 'fiscalia_estatal_scraping',
            'fecha_consulta': datetime.now().isoformat(),
            'delitos': {},
            'estadisticas_adicionales': {}
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                # Scraping de página de estadísticas
                stats_url = fiscalia_config['estadisticas_url']
                
                async with session.get(stats_url, timeout=45) as response:
                    if response.status == 200:
                        html_content = await response.text()
                        crime_data['delitos'] = self._extract_crime_stats_from_html(html_content, municipio)
                
                # Scraping de carpetas de investigación
                carpetas_url = fiscalia_config['carpetas_url']
                
                async with session.get(carpetas_url, timeout=45) as response:
                    if response.status == 200:
                        html_content = await response.text()
                        crime_data['estadisticas_adicionales'] = self._extract_investigation_stats(html_content, municipio)
                        
        except Exception as e:
            print(f"⚠️ Error en scraping: {e}")
        
        return crime_data
    
    def _extract_crime_stats_from_html(self, html_content: str, municipio: str) -> Dict:
        """Extrae estadísticas de criminalidad del HTML"""
        crime_stats = {}
        
        # Patrones regex para extraer números de delitos
        patterns = {
            'robo_negocio': r'robo.*?negocio.*?(\d+)',
            'extorsion': r'extorsión.*?(\d+)',
            'homicidio': r'homicidio.*?(\d+)',
            'secuestro': r'secuestro.*?(\d+)',
            'fraude': r'fraude.*?(\d+)'
        }
        
        for delito, pattern in patterns.items():
            matches = re.findall(pattern, html_content.lower())
            if matches:
                # Tomar el primer número encontrado
                crime_stats[delito] = int(matches[0])
            else:
                crime_stats[delito] = 0
        
        return crime_stats
    
    def _extract_investigation_stats(self, html_content: str, municipio: str) -> Dict:
        """Extrae estadísticas de carpetas de investigación"""
        investigation_stats = {
            'carpetas_abiertas': 0,
            'casos_resueltos': 0,
            'tasa_resolucion': 0,
            'tiempo_promedio_resolucion': None
        }
        
        # Patrones para extraer estadísticas de investigación
        try:
            # Buscar números de carpetas
            carpetas_match = re.search(r'carpetas.*?(\d+)', html_content.lower())
            if carpetas_match:
                investigation_stats['carpetas_abiertas'] = int(carpetas_match.group(1))
            
            # Buscar casos resueltos
            resueltos_match = re.search(r'resuelto.*?(\d+)', html_content.lower())
            if resueltos_match:
                investigation_stats['casos_resueltos'] = int(resueltos_match.group(1))
            
            # Calcular tasa de resolución
            if investigation_stats['carpetas_abiertas'] > 0:
                investigation_stats['tasa_resolucion'] = round(
                    (investigation_stats['casos_resueltos'] / investigation_stats['carpetas_abiertas']) * 100, 2
                )
                
        except Exception as e:
            print(f"⚠️ Error extrayendo estadísticas de investigación: {e}")
        
        return investigation_stats
    
    def _process_official_data(self, data: Dict, municipio: str, fiscalia_config: Dict) -> Dict:
        """Procesa datos oficiales de la API de fiscalía"""
        processed_data = {
            'municipio': municipio,
            'estado': fiscalia_config.get('codigo_estado'),
            'fuente': 'fiscalia_estatal_api',
            'fecha_consulta': datetime.now().isoformat(),
            'delitos': {},
            'estadisticas_adicionales': {}
        }
        
        # Procesar estructura de datos según fiscalía
        if 'delitos' in data:
            processed_data['delitos'] = data['delitos']
        
        if 'estadisticas' in data:
            processed_data['estadisticas_adicionales'] = data['estadisticas']
        
        return processed_data
    
    def _get_fallback_data(self, estado: str, municipio: str) -> Dict:
        """Datos de fallback cuando no se puede consultar fiscalía"""
        return {
            'municipio': municipio,
            'estado': estado,
            'fuente': 'fallback_estimacion',
            'fecha_consulta': datetime.now().isoformat(),
            'delitos': {
                'robo_negocio': None,
                'extorsion': None,
                'homicidio': None,
                'secuestro': None,
                'fraude': None
            },
            'estadisticas_adicionales': {
                'carpetas_abiertas': None,
                'casos_resueltos': None,
                'tasa_resolucion': None
            },
            'nota': 'Datos no disponibles de fiscalía estatal'
        }

# Función principal para uso en el sistema
async def get_state_prosecutor_data(estado: str, municipio: str) -> Dict:
    """Función principal para obtener datos de fiscalías estatales"""
    connector = FiscaliasEstatalesConnector()
    return await connector.get_state_crime_data(estado, municipio)
