"""
Motor de riesgo integrado con múltiples fuentes de datos reales
"""
import asyncio
from typing import Dict, List, Optional
from datetime import datetime
import json

# Importar todos los conectores expandidos
from .real_data_connectors import GobiernoDataConnector
from .inegi_expanded_connector import get_enhanced_municipal_data
from .fiscalias_connector import get_state_prosecutor_data
from .ong_security_connector import get_ong_security_analysis

class IntegratedRiskEngine:
    """Motor de riesgo integrado con múltiples fuentes de datos oficiales"""
    
    def __init__(self):
        self.gobierno_connector = GobiernoDataConnector()
        
        # Pesos para diferentes fuentes de datos
        self.source_weights = {
            'sesnsp_federal': 0.35,      # Datos oficiales federales
            'fiscalia_estatal': 0.25,    # Datos oficiales estatales
            'inegi_socioeconomico': 0.20, # Contexto socioeconómico
            'ong_analysis': 0.15,        # Análisis de ONGs
            'metodologia_asis': 0.05     # Metodología ASIS base
        }
        
        # Factores de riesgo por tipo de delito
        self.crime_risk_factors = {
            'robo_negocio': 1.0,         # Factor base
            'robo_vehiculo': 0.7,        # Menor impacto directo
            'extorsion': 1.5,            # Mayor impacto en negocios
            'homicidio': 0.8,            # Indicador de violencia general
            'secuestro': 1.2,            # Riesgo para personal
            'fraude': 0.9,               # Riesgo financiero
            'lesiones': 0.6,             # Menor impacto directo
            'violencia_familiar': 0.3    # Menor relación con negocios
        }
    
    async def calculate_integrated_risk(self, municipio: str, estado: str, 
                                      tipo_negocio: str, valor_inventario: float,
                                      medidas_seguridad: List[str]) -> Dict:
        """Calcula riesgo integrador usando todas las fuentes disponibles"""
        
        print(f"🎯 Iniciando análisis de riesgo integrado para {municipio}, {estado}")
        print(f"📊 Tipo de negocio: {tipo_negocio}, Valor: ${valor_inventario:,.2f}")
        
        # Estructura del resultado
        risk_result = {
            'municipio': municipio,
            'estado': estado,
            'tipo_negocio': tipo_negocio,
            'valor_inventario': valor_inventario,
            'medidas_seguridad': medidas_seguridad,
            'fecha_analisis': datetime.now().isoformat(),
            'fuentes_consultadas': [],
            'datos_recopilados': {},
            'analisis_riesgo': {},
            'recomendaciones': [],
            'nivel_confianza': 0.0
        }
        
        # Obtener datos de todas las fuentes de forma asíncrona
        print("📡 Consultando fuentes de datos...")
        
        tasks = [
            self._get_federal_crime_data(municipio, estado),
            self._get_state_prosecutor_data(municipio, estado),
            self._get_socioeconomic_data(municipio),
            self._get_ong_analysis(municipio, estado)
        ]
        
        # Ejecutar consultas en paralelo
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Procesar resultados
        federal_data, state_data, socio_data, ong_data = results
        
        # Agregar datos exitosos al resultado
        if isinstance(federal_data, dict) and 'error' not in federal_data:
            risk_result['fuentes_consultadas'].append('SESNSP_Federal')
            risk_result['datos_recopilados']['federal'] = federal_data
        
        if isinstance(state_data, dict) and 'error' not in state_data:
            risk_result['fuentes_consultadas'].append('Fiscalia_Estatal')
            risk_result['datos_recopilados']['estatal'] = state_data
        
        if isinstance(socio_data, dict) and 'error' not in socio_data:
            risk_result['fuentes_consultadas'].append('INEGI_Socioeconomico')
            risk_result['datos_recopilados']['socioeconomico'] = socio_data
        
        if isinstance(ong_data, dict) and 'error' not in ong_data:
            risk_result['fuentes_consultadas'].append('ONGs_Seguridad')
            risk_result['datos_recopilados']['ong'] = ong_data
        
        # Calcular análisis de riesgo integrado
        risk_result['analisis_riesgo'] = await self._calculate_integrated_analysis(
            risk_result['datos_recopilados'], tipo_negocio, valor_inventario, medidas_seguridad
        )
        
        # Generar recomendaciones basadas en todos los datos
        risk_result['recomendaciones'] = self._generate_integrated_recommendations(
            risk_result['analisis_riesgo'], risk_result['datos_recopilados']
        )
        
        # Calcular nivel de confianza basado en fuentes disponibles
        risk_result['nivel_confianza'] = self._calculate_confidence_level(
            len(risk_result['fuentes_consultadas'])
        )
        
        print(f"✅ Análisis completado. Fuentes consultadas: {len(risk_result['fuentes_consultadas'])}")
        print(f"🎯 Nivel de confianza: {risk_result['nivel_confianza']:.1%}")
        
        return risk_result
    
    async def _get_federal_crime_data(self, municipio: str, estado: str) -> Dict:
        """Obtiene datos federales de criminalidad"""
        try:
            return await self.gobierno_connector.get_crime_data_by_municipio(municipio, estado)
        except Exception as e:
            print(f"⚠️ Error obteniendo datos federales: {e}")
            return {'error': str(e)}
    
    async def _get_state_prosecutor_data(self, municipio: str, estado: str) -> Dict:
        """Obtiene datos de fiscalía estatal"""
        try:
            return await get_state_prosecutor_data(estado, municipio)
        except Exception as e:
            print(f"⚠️ Error obteniendo datos estatales: {e}")
            return {'error': str(e)}
    
    async def _get_socioeconomic_data(self, municipio: str) -> Dict:
        """Obtiene datos socioeconómicos de INEGI"""
        try:
            # Buscar código INEGI del municipio
            codigo_municipio = self._get_inegi_code(municipio)
            if codigo_municipio:
                return await get_enhanced_municipal_data(codigo_municipio)
            else:
                return {'error': 'Código INEGI no encontrado'}
        except Exception as e:
            print(f"⚠️ Error obteniendo datos socioeconómicos: {e}")
            return {'error': str(e)}
    
    async def _get_ong_analysis(self, municipio: str, estado: str) -> Dict:
        """Obtiene análisis de ONGs"""
        try:
            return await get_ong_security_analysis(municipio, estado)
        except Exception as e:
            print(f"⚠️ Error obteniendo análisis ONGs: {e}")
            return {'error': str(e)}
    
    def _get_inegi_code(self, municipio: str) -> Optional[str]:
        """Obtiene código INEGI del municipio"""
        # Mapeo básico - expandir según necesidades
        inegi_codes = {
            'Tultepec': '15089',
            'Ecatepec': '15033',
            'Naucalpan': '15057',
            'Cuautitlán': '15024',
            'Monterrey': '19039',
            'Guadalajara': '14039',
            'Apodaca': '19006',
            'Tlaquepaque': '14098'
        }
        return inegi_codes.get(municipio)
    
    async def _calculate_integrated_analysis(self, datos_recopilados: Dict, 
                                           tipo_negocio: str, valor_inventario: float,
                                           medidas_seguridad: List[str]) -> Dict:
        """Calcula análisis de riesgo integrado"""
        
        analysis = {
            'riesgo_base': 5.0,  # Riesgo base sobre 10
            'factores_agravantes': [],
            'factores_mitigantes': [],
            'riesgo_final': 5.0,
            'distribucion_riesgo': {},
            'escenarios': []
        }
        
        # Analizar datos federales (SESNSP)
        if 'federal' in datos_recopilados:
            federal_impact = self._analyze_federal_impact(datos_recopilados['federal'])
            analysis['riesgo_base'] += federal_impact['adjustment']
            analysis['factores_agravantes'].extend(federal_impact['aggravating'])
            analysis['factores_mitigantes'].extend(federal_impact['mitigating'])
        
        # Analizar datos estatales (Fiscalías)
        if 'estatal' in datos_recopilados:
            state_impact = self._analyze_state_impact(datos_recopilados['estatal'])
            analysis['riesgo_base'] += state_impact['adjustment']
            analysis['factores_agravantes'].extend(state_impact['aggravating'])
        
        # Analizar contexto socioeconómico (INEGI)
        if 'socioeconomico' in datos_recopilados:
            socio_impact = self._analyze_socioeconomic_impact(datos_recopilados['socioeconomico'])
            analysis['riesgo_base'] += socio_impact['adjustment']
            analysis['factores_agravantes'].extend(socio_impact['aggravating'])
            analysis['factores_mitigantes'].extend(socio_impact['mitigating'])
        
        # Analizar percepción y análisis ONGs
        if 'ong' in datos_recopilados:
            ong_impact = self._analyze_ong_impact(datos_recopilados['ong'])
            analysis['riesgo_base'] += ong_impact['adjustment']
            analysis['factores_agravantes'].extend(ong_impact['aggravating'])
        
        # Aplicar factores específicos del negocio
        business_factor = self._get_business_risk_factor(tipo_negocio)
        analysis['riesgo_base'] *= business_factor
        
        # Aplicar factor de valor de inventario
        value_factor = self._get_value_risk_factor(valor_inventario)
        analysis['riesgo_base'] *= value_factor
        
        # Aplicar mitigación por medidas de seguridad
        security_mitigation = self._calculate_security_mitigation(medidas_seguridad)
        analysis['riesgo_base'] *= (1 - security_mitigation)
        
        # Asegurar que el riesgo esté en el rango 0-10
        analysis['riesgo_final'] = max(0, min(10, analysis['riesgo_base']))
        
        # Generar distribución de riesgo por categoría
        analysis['distribucion_riesgo'] = {
            'robo_directo': analysis['riesgo_final'] * 0.4,
            'extorsion': analysis['riesgo_final'] * 0.25,
            'daños_propiedad': analysis['riesgo_final'] * 0.2,
            'fraude': analysis['riesgo_final'] * 0.1,
            'otros_delitos': analysis['riesgo_final'] * 0.05
        }
        
        # Generar escenarios de riesgo
        analysis['escenarios'] = self._generate_risk_scenarios(analysis['riesgo_final'])
        
        return analysis
    
    def _analyze_federal_impact(self, federal_data: Dict) -> Dict:
        """Analiza impacto de datos federales en el riesgo"""
        impact = {
            'adjustment': 0.0,
            'aggravating': [],
            'mitigating': []
        }
        
        if 'delitos_totals' in federal_data:
            total_crimes = federal_data['delitos_totals']
            if total_crimes > 1000:
                impact['adjustment'] += 1.5
                impact['aggravating'].append(f"Alta incidencia delictiva: {total_crimes} delitos reportados")
            elif total_crimes > 500:
                impact['adjustment'] += 0.8
                impact['aggravating'].append(f"Incidencia delictiva media: {total_crimes} delitos reportados")
            else:
                impact['adjustment'] -= 0.3
                impact['mitigating'].append(f"Baja incidencia delictiva: {total_crimes} delitos reportados")
        
        return impact
    
    def _analyze_state_impact(self, state_data: Dict) -> Dict:
        """Analiza impacto de datos estatales en el riesgo"""
        impact = {
            'adjustment': 0.0,
            'aggravating': []
        }
        
        if 'estadisticas_adicionales' in state_data:
            stats = state_data['estadisticas_adicionales']
            tasa_resolucion = stats.get('tasa_resolucion', 50)
            
            if tasa_resolucion < 30:
                impact['adjustment'] += 1.0
                impact['aggravating'].append(f"Baja tasa de resolución: {tasa_resolucion}%")
            elif tasa_resolucion < 50:
                impact['adjustment'] += 0.5
                impact['aggravating'].append(f"Tasa de resolución media: {tasa_resolucion}%")
        
        return impact
    
    def _analyze_socioeconomic_impact(self, socio_data: Dict) -> Dict:
        """Analiza impacto socioeconómico en el riesgo"""
        impact = {
            'adjustment': 0.0,
            'aggravating': [],
            'mitigating': []
        }
        
        if 'contexto_economico' in socio_data:
            context = socio_data['contexto_economico']
            
            if context.get('vulnerabilidad_economica') == 'alta':
                impact['adjustment'] += 0.8
                impact['aggravating'].append("Alta vulnerabilidad económica")
            elif context.get('vulnerabilidad_economica') == 'baja':
                impact['adjustment'] -= 0.4
                impact['mitigating'].append("Baja vulnerabilidad económica")
            
            if context.get('nivel_desarrollo') == 'alto':
                impact['adjustment'] -= 0.6
                impact['mitigating'].append("Alto nivel de desarrollo")
            elif context.get('nivel_desarrollo') == 'bajo':
                impact['adjustment'] += 0.6
                impact['aggravating'].append("Bajo nivel de desarrollo")
        
        return impact
    
    def _analyze_ong_impact(self, ong_data: Dict) -> Dict:
        """Analiza impacto de análisis de ONGs en el riesgo"""
        impact = {
            'adjustment': 0.0,
            'aggravating': []
        }
        
        if 'resumen_consolidado' in ong_data:
            resumen = ong_data['resumen_consolidado']
            
            if resumen.get('percepcion_seguridad') == 'baja':
                impact['adjustment'] += 0.5
                impact['aggravating'].append("Percepción ciudadana de inseguridad alta")
            
            areas_riesgo = resumen.get('areas_riesgo_identificadas', [])
            if len(areas_riesgo) > 2:
                impact['adjustment'] += 0.3 * len(areas_riesgo)
                impact['aggravating'].append(f"Múltiples áreas de riesgo identificadas: {', '.join(areas_riesgo)}")
        
        return impact
    
    def _get_business_risk_factor(self, tipo_negocio: str) -> float:
        """Obtiene factor de riesgo por tipo de negocio"""
        business_factors = {
            'Retail': 1.2,
            'Almacén': 1.0,
            'Oficina': 0.8,
            'Manufactura': 0.9,
            'Servicios': 0.7,
            'Tecnología': 0.6
        }
        return business_factors.get(tipo_negocio, 1.0)
    
    def _get_value_risk_factor(self, valor_inventario: float) -> float:
        """Obtiene factor de riesgo por valor de inventario"""
        if valor_inventario > 5000000:  # > 5M
            return 1.4
        elif valor_inventario > 1000000:  # > 1M
            return 1.2
        elif valor_inventario > 500000:  # > 500K
            return 1.1
        else:
            return 1.0
    
    def _calculate_security_mitigation(self, medidas_seguridad: List[str]) -> float:
        """Calcula mitigación por medidas de seguridad"""
        security_values = {
            'Cámaras de seguridad': 0.15,
            'Sistema de alarma': 0.12,
            'Guardias de seguridad': 0.20,
            'Control de acceso': 0.10,
            'Cercado perimetral': 0.08,
            'Iluminación': 0.05,
            'Sensores de movimiento': 0.08
        }
        
        total_mitigation = 0.0
        for medida in medidas_seguridad:
            total_mitigation += security_values.get(medida, 0.0)
        
        # Máximo 50% de mitigación
        return min(0.5, total_mitigation)
    
    def _generate_risk_scenarios(self, riesgo_final: float) -> List[Dict]:
        """Genera escenarios de riesgo específicos"""
        scenarios = []
        
        # Escenario optimista
        scenarios.append({
            'nombre': 'Escenario Optimista',
            'probabilidad': 0.7,
            'riesgo': max(0, riesgo_final - 1.5),
            'descripcion': 'Condiciones normales de operación con medidas de seguridad funcionando'
        })
        
        # Escenario realista
        scenarios.append({
            'nombre': 'Escenario Realista',
            'probabilidad': 0.8,
            'riesgo': riesgo_final,
            'descripcion': 'Condiciones promedio considerando todos los factores analizados'
        })
        
        # Escenario pesimista
        scenarios.append({
            'nombre': 'Escenario Pesimista',
            'probabilidad': 0.3,
            'riesgo': min(10, riesgo_final + 2.0),
            'descripcion': 'Condiciones adversas con factores de riesgo agravados'
        })
        
        return scenarios
    
    def _generate_integrated_recommendations(self, analisis_riesgo: Dict, 
                                           datos_recopilados: Dict) -> List[Dict]:
        """Genera recomendaciones basadas en análisis integrado"""
        recommendations = []
        
        riesgo_final = analisis_riesgo['riesgo_final']
        
        # Recomendaciones generales basadas en nivel de riesgo
        if riesgo_final > 7:
            recommendations.append({
                'categoria': 'Seguridad Física',
                'prioridad': 'Alta',
                'recomendacion': 'Implementar sistema de seguridad integral con guardias 24/7 y múltiples medidas tecnológicas'
            })
        elif riesgo_final > 5:
            recommendations.append({
                'categoria': 'Seguridad Tecnológica',
                'prioridad': 'Media',
                'recomendacion': 'Reforzar sistema de cámaras y alarmas con monitoreo remoto'
            })
        
        # Recomendaciones específicas basadas en fuentes de datos
        for factor in analisis_riesgo['factores_agravantes']:
            if 'alta incidencia delictiva' in factor.lower():
                recommendations.append({
                    'categoria': 'Coordinación Institucional',
                    'prioridad': 'Alta',
                    'recomendacion': 'Establecer comunicación directa con autoridades locales y participar en programas de seguridad empresarial'
                })
        
        return recommendations
    
    def _calculate_confidence_level(self, num_sources: int) -> float:
        """Calcula nivel de confianza basado en número de fuentes"""
        confidence_levels = {
            0: 0.3,  # Solo datos base
            1: 0.5,  # 1 fuente adicional
            2: 0.7,  # 2 fuentes adicionales
            3: 0.85, # 3 fuentes adicionales
            4: 0.95  # Todas las fuentes
        }
        return confidence_levels.get(num_sources, 0.95)

# Función principal para uso en la API
async def calculate_comprehensive_risk(municipio: str, estado: str, tipo_negocio: str,
                                     valor_inventario: float, medidas_seguridad: List[str]) -> Dict:
    """Función principal para cálculo de riesgo comprensivo"""
    engine = IntegratedRiskEngine()
    return await engine.calculate_integrated_risk(
        municipio, estado, tipo_negocio, valor_inventario, medidas_seguridad
    )
