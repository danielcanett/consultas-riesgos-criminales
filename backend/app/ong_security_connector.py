"""
Conectores para ONGs especializadas en seguridad y análisis criminológico
"""
import requests
import pandas as pd
import json
from typing import Dict, List, Optional
import asyncio
import aiohttp
from datetime import datetime, timedelta
import feedparser
from bs4 import BeautifulSoup

class ONGSecurityConnector:
    """Conector para obtener datos de ONGs especializadas en seguridad"""
    
    def __init__(self):
        # Configuración de ONGs mexicanas especializadas
        self.ong_sources = {
            'mexico_evalua': {
                'base_url': 'https://www.mexicoevalua.org',
                'api_endpoint': '/api/indicadores/',
                'rss_feed': 'https://www.mexicoevalua.org/feed/',
                'reports_url': 'https://www.mexicoevalua.org/reportes/',
                'especialidad': 'indices_seguridad',
                'credibilidad': 9.2  # sobre 10
            },
            'insyde': {
                'base_url': 'http://insyde.org.mx',
                'api_endpoint': '/api/data/',
                'rss_feed': 'http://insyde.org.mx/feed/',
                'reports_url': 'http://insyde.org.mx/estudios/',
                'especialidad': 'estudios_seguridad_publica',
                'credibilidad': 8.8
            },
            'observatorio_nacional': {
                'base_url': 'https://onc.org.mx',
                'api_endpoint': '/api/reportes/',
                'rss_feed': 'https://onc.org.mx/feed/',
                'reports_url': 'https://onc.org.mx/reportes/',
                'especialidad': 'reportes_ciudadanos',
                'credibilidad': 8.5
            },
            'causa_comun': {
                'base_url': 'https://causaencomun.org.mx',
                'api_endpoint': '/api/analisis/',
                'rss_feed': 'https://causaencomun.org.mx/feed/',
                'reports_url': 'https://causaencomun.org.mx/analisis/',
                'especialidad': 'analisis_violencia',
                'credibilidad': 8.3
            },
            'mucd': {
                'base_url': 'https://movimientoporjusticia.mx',
                'api_endpoint': '/api/datos/',
                'rss_feed': 'https://movimientoporjusticia.mx/feed/',
                'reports_url': 'https://movimientoporjusticia.mx/datos/',
                'especialidad': 'datos_ciudadanos',
                'credibilidad': 7.8
            }
        }
        
        # Indicadores clave que buscar en reportes de ONGs
        self.indicadores_interes = [
            'índice de seguridad',
            'percepción de inseguridad',
            'efectividad policial',
            'corrupción institucional',
            'violencia urbana',
            'crimen organizado',
            'impunidad',
            'sistema de justicia'
        ]
    
    async def get_ong_security_data(self, municipio: str, estado: str) -> Dict:
        """Obtiene datos de seguridad de múltiples ONGs"""
        print(f"🏛️ Consultando ONGs de seguridad para {municipio}, {estado}")
        
        ong_data = {
            'municipio': municipio,
            'estado': estado,
            'fecha_consulta': datetime.now().isoformat(),
            'fuentes_consultadas': [],
            'indices_seguridad': {},
            'reportes_recientes': [],
            'analisis_cualitativo': {},
            'credibilidad_promedio': 0.0
        }
        
        # Consultar cada ONG de forma asíncrona
        tasks = []
        for ong_name, ong_config in self.ong_sources.items():
            task = self._fetch_ong_data(ong_name, ong_config, municipio, estado)
            tasks.append(task)
        
        resultados = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Procesar resultados
        credibilidades = []
        for i, resultado in enumerate(resultados):
            ong_name = list(self.ong_sources.keys())[i]
            ong_config = self.ong_sources[ong_name]
            
            if isinstance(resultado, dict) and not isinstance(resultado, Exception):
                ong_data['fuentes_consultadas'].append(ong_name)
                
                # Agregar datos de la ONG
                if 'indices' in resultado:
                    ong_data['indices_seguridad'][ong_name] = resultado['indices']
                
                if 'reportes' in resultado:
                    ong_data['reportes_recientes'].extend(resultado['reportes'])
                
                if 'analisis' in resultado:
                    ong_data['analisis_cualitativo'][ong_name] = resultado['analisis']
                
                credibilidades.append(ong_config['credibilidad'])
            else:
                print(f"⚠️ Error consultando {ong_name}: {resultado}")
        
        # Calcular credibilidad promedio
        if credibilidades:
            ong_data['credibilidad_promedio'] = round(sum(credibilidades) / len(credibilidades), 2)
        
        # Generar resumen consolidado
        ong_data['resumen_consolidado'] = self._generate_consolidated_summary(ong_data)
        
        return ong_data
    
    async def _fetch_ong_data(self, ong_name: str, ong_config: Dict, municipio: str, estado: str) -> Dict:
        """Obtiene datos de una ONG específica"""
        ong_result = {
            'ong': ong_name,
            'indices': {},
            'reportes': [],
            'analisis': {}
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                # Intentar API endpoint si existe
                api_data = await self._try_api_endpoint(session, ong_config, municipio, estado)
                if api_data:
                    ong_result.update(api_data)
                
                # Obtener reportes recientes via RSS
                rss_data = await self._fetch_rss_reports(session, ong_config, municipio, estado)
                if rss_data:
                    ong_result['reportes'].extend(rss_data)
                
                # Web scraping de reportes específicos
                scraped_data = await self._scrape_reports(session, ong_config, municipio, estado)
                if scraped_data:
                    ong_result['analisis'].update(scraped_data)
                    
        except Exception as e:
            print(f"❌ Error consultando {ong_name}: {e}")
        
        return ong_result
    
    async def _try_api_endpoint(self, session: aiohttp.ClientSession, ong_config: Dict, 
                               municipio: str, estado: str) -> Optional[Dict]:
        """Intenta consultar endpoint API de la ONG"""
        try:
            api_url = f"{ong_config['base_url']}{ong_config['api_endpoint']}"
            params = {
                'municipio': municipio,
                'estado': estado,
                'format': 'json'
            }
            
            async with session.get(api_url, params=params, timeout=30) as response:
                if response.status == 200:
                    data = await response.json()
                    return self._process_api_data(data, ong_config)
                else:
                    return None
                    
        except Exception as e:
            print(f"⚠️ API endpoint no disponible: {e}")
            return None
    
    async def _fetch_rss_reports(self, session: aiohttp.ClientSession, ong_config: Dict,
                                municipio: str, estado: str) -> List[Dict]:
        """Obtiene reportes recientes via RSS feed"""
        reportes = []
        
        try:
            async with session.get(ong_config['rss_feed'], timeout=30) as response:
                if response.status == 200:
                    rss_content = await response.text()
                    feed = feedparser.parse(rss_content)
                    
                    for entry in feed.entries[:10]:  # Últimos 10 reportes
                        # Filtrar reportes relevantes para la ubicación
                        title = entry.title.lower()
                        summary = getattr(entry, 'summary', '').lower()
                        
                        if any(keyword in title or keyword in summary 
                               for keyword in [municipio.lower(), estado.lower(), 'seguridad', 'criminalidad']):
                            
                            reporte = {
                                'titulo': entry.title,
                                'fecha': entry.get('published', ''),
                                'resumen': getattr(entry, 'summary', ''),
                                'url': entry.link,
                                'relevancia': self._calculate_relevance(entry, municipio, estado)
                            }
                            reportes.append(reporte)
                            
        except Exception as e:
            print(f"⚠️ Error obteniendo RSS: {e}")
        
        return sorted(reportes, key=lambda x: x['relevancia'], reverse=True)[:5]
    
    async def _scrape_reports(self, session: aiohttp.ClientSession, ong_config: Dict,
                             municipio: str, estado: str) -> Dict:
        """Web scraping de reportes específicos"""
        scraped_analysis = {}
        
        try:
            async with session.get(ong_config['reports_url'], timeout=45) as response:
                if response.status == 200:
                    html_content = await response.text()
                    soup = BeautifulSoup(html_content, 'html.parser')
                    
                    # Buscar datos relevantes en el HTML
                    for indicador in self.indicadores_interes:
                        value = self._extract_indicator_from_html(soup, indicador, municipio, estado)
                        if value:
                            scraped_analysis[indicador] = value
                            
        except Exception as e:
            print(f"⚠️ Error en web scraping: {e}")
        
        return scraped_analysis
    
    def _extract_indicator_from_html(self, soup: BeautifulSoup, indicador: str, 
                                   municipio: str, estado: str) -> Optional[str]:
        """Extrae un indicador específico del HTML"""
        try:
            # Buscar texto que contenga el indicador y la ubicación
            text_elements = soup.find_all(text=True)
            
            for text in text_elements:
                text_lower = text.lower()
                if (indicador.lower() in text_lower and 
                    (municipio.lower() in text_lower or estado.lower() in text_lower)):
                    
                    # Extraer el párrafo completo o elemento padre
                    parent = text.parent
                    if parent:
                        return parent.get_text().strip()[:500]  # Limitar a 500 caracteres
            
            return None
            
        except Exception as e:
            print(f"⚠️ Error extrayendo indicador {indicador}: {e}")
            return None
    
    def _calculate_relevance(self, entry, municipio: str, estado: str) -> float:
        """Calcula la relevancia de un reporte para la ubicación específica"""
        relevance_score = 0.0
        
        title = entry.title.lower()
        summary = getattr(entry, 'summary', '').lower()
        full_text = f"{title} {summary}"
        
        # Puntaje por mención directa de ubicación
        if municipio.lower() in full_text:
            relevance_score += 10.0
        if estado.lower() in full_text:
            relevance_score += 5.0
        
        # Puntaje por palabras clave de seguridad
        security_keywords = ['seguridad', 'criminalidad', 'delito', 'violencia', 'robo', 'homicidio']
        for keyword in security_keywords:
            if keyword in full_text:
                relevance_score += 1.0
        
        # Puntaje por fecha (más reciente = más relevante)
        try:
            published_date = datetime.strptime(entry.get('published', ''), '%a, %d %b %Y %H:%M:%S %z')
            days_old = (datetime.now(published_date.tzinfo) - published_date).days
            date_score = max(0, 30 - days_old) / 30 * 5  # Máximo 5 puntos por fecha
            relevance_score += date_score
        except:
            pass
        
        return relevance_score
    
    def _process_api_data(self, data: Dict, ong_config: Dict) -> Dict:
        """Procesa datos obtenidos de API de ONG"""
        processed = {
            'indices': {},
            'reportes': [],
            'analisis': {}
        }
        
        # Procesar según la especialidad de la ONG
        especialidad = ong_config['especialidad']
        
        if especialidad == 'indices_seguridad' and 'indices' in data:
            processed['indices'] = data['indices']
        
        if 'reportes' in data:
            processed['reportes'] = data['reportes'][:5]  # Limitar a 5 reportes
        
        if 'analisis' in data:
            processed['analisis'] = data['analisis']
        
        return processed
    
    def _generate_consolidated_summary(self, ong_data: Dict) -> Dict:
        """Genera resumen consolidado de datos de ONGs"""
        summary = {
            'fuentes_consultadas': len(ong_data['fuentes_consultadas']),
            'credibilidad_general': ong_data['credibilidad_promedio'],
            'percepcion_seguridad': 'neutral',  # baja, neutral, alta
            'areas_riesgo_identificadas': [],
            'recomendaciones_consolidadas': []
        }
        
        # Analizar indices de seguridad
        all_indices = []
        for ong, indices in ong_data['indices_seguridad'].items():
            for indice_name, valor in indices.items():
                if isinstance(valor, (int, float)):
                    all_indices.append(valor)
        
        if all_indices:
            avg_security_index = sum(all_indices) / len(all_indices)
            if avg_security_index < 4:
                summary['percepcion_seguridad'] = 'baja'
            elif avg_security_index > 7:
                summary['percepcion_seguridad'] = 'alta'
        
        # Identificar áreas de riesgo comunes
        risk_keywords = ['robo', 'extorsión', 'homicidio', 'secuestro', 'corrupción']
        for keyword in risk_keywords:
            count = 0
            for reportes in ong_data['reportes_recientes']:
                if keyword in reportes.get('titulo', '').lower():
                    count += 1
            
            if count >= 2:  # Mencionado en al menos 2 reportes
                summary['areas_riesgo_identificadas'].append(keyword)
        
        return summary

# Función principal para uso en el sistema
async def get_ong_security_analysis(municipio: str, estado: str) -> Dict:
    """Función principal para obtener análisis de ONGs de seguridad"""
    connector = ONGSecurityConnector()
    return await connector.get_ong_security_data(municipio, estado)
