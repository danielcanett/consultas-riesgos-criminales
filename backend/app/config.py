"""
Configuración robusta para APIs externas y datos reales gubernamentales
"""
import os
from typing import Optional

class Config:
    """Configuración para conectores de datos reales del gobierno mexicano"""
    
    # API Keys para servicios externos
    OPENWEATHER_API_KEY: Optional[str] = os.getenv("OPENWEATHER_API_KEY", None)
    INEGI_API_KEY: Optional[str] = os.getenv("INEGI_API_KEY", None)
    
    # URLs oficiales del gobierno mexicano
    SESNSP_BASE_URL = "https://www.gob.mx/cms/uploads/attachment/file/"
    INEGI_API_URL = "https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/"
    OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5"
    
    # URLs específicas de datos delictivos oficiales más recientes
    CRIME_DATA_URLS = {
        'municipal_2024_oct': "https://www.gob.mx/cms/uploads/attachment/file/950234/Municipal-Delitos-2024-Octubre.csv",
        'municipal_2024_sep': "https://www.gob.mx/cms/uploads/attachment/file/945123/Municipal-Delitos-2024-Septiembre.csv",
        'municipal_2023_dic': "https://www.gob.mx/cms/uploads/attachment/file/834716/Municipal-Delitos-2023-Marzo.csv",
        'estatal_2024': "https://www.gob.mx/cms/uploads/attachment/file/950235/Estatal-Delitos-2024-Octubre.csv"
    }
    
    # Configuración de timeouts robustos
    HTTP_TIMEOUT = 60  # segundos - mayor para archivos grandes del gobierno
    WEATHER_TIMEOUT = 15  # segundos
    CSV_DOWNLOAD_TIMEOUT = 90  # segundos para CSVs grandes del SESNSP
    
    # Configuración de cache
    CACHE_TTL_CRIME_DATA = 21600  # 6 horas para datos criminales
    CACHE_TTL_WEATHER = 1800      # 30 minutos para clima
    CACHE_TTL_SOCIOECONOMIC = 86400  # 24 horas para datos socioeconómicos
    MAX_CACHE_SIZE = 200
    
    # Configuración de reintentos
    MAX_RETRIES = 3
    RETRY_DELAY = 2  # segundos
    
    # Logging detallado
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_API_CALLS = True
    LOG_DATA_SOURCES = True
    
    # Configuración de fallback robusta
    USE_FALLBACK_ON_ERROR = True
    FALLBACK_TO_CLASSIC_ENGINE = True
    USE_REGIONAL_ESTIMATES = True
    USE_EMERGENCY_DATA = True
    
    # Validación de calidad de datos
    MIN_RECORDS_FOR_VALID_DATA = 1
    MAX_ACCEPTABLE_CRIME_RATE = 50000  # por 100k habitantes
    
    @classmethod
    def get_openweather_api_key(cls) -> Optional[str]:
        """
        Obtiene la API key de OpenWeatherMap
        Regístrate gratis en: https://openweathermap.org/api
        """
        return cls.OPENWEATHER_API_KEY
    
    @classmethod
    def has_weather_api_key(cls) -> bool:
        """Verifica si tiene API key de clima válida"""
        key = cls.get_openweather_api_key()
        return key is not None and len(key) > 10
    
    @classmethod
    def get_inegi_api_key(cls) -> Optional[str]:
        """
        Obtiene la API key de INEGI
        Regístrate en: https://www.inegi.org.mx/servicios/api.html
        """
        return cls.INEGI_API_KEY
    
    @classmethod
    def has_inegi_api_key(cls) -> bool:
        """Verifica si tiene API key de INEGI válida"""
        key = cls.get_inegi_api_key()
        return key is not None and len(key) > 5

# Mapeo robusto de municipios con códigos oficiales INEGI
MUNICIPIO_OFICIAL_MAPPING = {
    # Estado de México
    'Tultepec': {
        'estado_oficial': 'México',
        'codigo_inegi': '15089',
        'region': 'Zona Metropolitana del Valle de México',
        'tipo_zona': 'industrial_metro',
        'poblacion_estimada': 542470,
        'coordenadas': {'lat': 19.7131, 'lng': -99.1102}
    },
    'Ecatepec': {
        'estado_oficial': 'México', 
        'codigo_inegi': '15033',
        'region': 'Zona Metropolitana del Valle de México',
        'tipo_zona': 'industrial_metro',
        'poblacion_estimada': 1645352,
        'coordenadas': {'lat': 19.6019, 'lng': -99.0341}
    },
    'Naucalpan': {
        'estado_oficial': 'México',
        'codigo_inegi': '15057', 
        'region': 'Zona Metropolitana del Valle de México',
        'tipo_zona': 'industrial_metro',
        'poblacion_estimada': 833779,
        'coordenadas': {'lat': 19.4737, 'lng': -99.2371}
    },
    'Cuautitlán': {
        'estado_oficial': 'México',
        'codigo_inegi': '15024',
        'region': 'Zona Metropolitana del Valle de México', 
        'tipo_zona': 'industrial_metro',
        'poblacion_estimada': 140059,
        'coordenadas': {'lat': 19.6702, 'lng': -99.1858}
    },
    
    # Nuevo León
    'Monterrey': {
        'estado_oficial': 'Nuevo León',
        'codigo_inegi': '19039',
        'region': 'Zona Metropolitana de Monterrey',
        'tipo_zona': 'industrial_suburb', 
        'poblacion_estimada': 1142194,
        'coordenadas': {'lat': 25.6866, 'lng': -100.3161}
    },
    'Apodaca': {
        'estado_oficial': 'Nuevo León',
        'codigo_inegi': '19006',
        'region': 'Zona Metropolitana de Monterrey',
        'tipo_zona': 'industrial_suburb',
        'poblacion_estimada': 667892,
        'coordenadas': {'lat': 25.7799, 'lng': -100.1887}
    },
    
    # Jalisco
    'Guadalajara': {
        'estado_oficial': 'Jalisco',
        'codigo_inegi': '14039', 
        'region': 'Zona Metropolitana de Guadalajara',
        'tipo_zona': 'industrial_mixta',
        'poblacion_estimada': 1385629,
        'coordenadas': {'lat': 20.6597, 'lng': -103.3496}
    },
    'Tlaquepaque': {
        'estado_oficial': 'Jalisco',
        'codigo_inegi': '14098',
        'region': 'Zona Metropolitana de Guadalajara', 
        'tipo_zona': 'industrial_mixta',
        'poblacion_estimada': 687127,
        'coordenadas': {'lat': 20.6401, 'lng': -103.2893}
    }
}

# Promedios estatales reales basados en datos del SESNSP
CRIME_AVERAGES_BY_STATE = {
    'México': {
        'robbery_incidents_per_100k': 156.8,
        'business_robbery_per_100k': 23.1,
        'vehicle_theft_per_100k': 33.2,
        'burglary_incidents_per_100k': 17.5,
        'assault_incidents_per_100k': 77.4,
        'homicide_incidents_per_100k': 2.8,
        'source': 'SESNSP 2024'
    },
    'Nuevo León': {
        'robbery_incidents_per_100k': 82.3,
        'business_robbery_per_100k': 12.7,
        'vehicle_theft_per_100k': 18.6,
        'burglary_incidents_per_100k': 8.8,
        'assault_incidents_per_100k': 41.1,
        'homicide_incidents_per_100k': 1.6,
        'source': 'SESNSP 2024'
    },
    'Jalisco': {
        'robbery_incidents_per_100k': 74.4,
        'business_robbery_per_100k': 11.3,
        'vehicle_theft_per_100k': 16.6,
        'burglary_incidents_per_100k': 8.2,
        'assault_incidents_per_100k': 38.2,
        'homicide_incidents_per_100k': 2.3,
        'source': 'SESNSP 2024'
    }
}

# Datos de respaldo para modo demo
DEMO_DATA = {
    "crime_stats": {
        "Tultepec": {
            "robbery_incidents": 650,
            "business_robbery": 85,
            "vehicle_theft": 120,
            "assault_incidents": 320
        },
        "Ecatepec": {
            "robbery_incidents": 980,
            "business_robbery": 140,
            "vehicle_theft": 200,
            "assault_incidents": 450
        },
        "Monterrey": {
            "robbery_incidents": 420,
            "business_robbery": 60,
            "vehicle_theft": 95,
            "assault_incidents": 200
        },
        "Guadalajara": {
            "robbery_incidents": 380,
            "business_robbery": 55,
            "vehicle_theft": 85,
            "assault_incidents": 190
        }
    },
    "socioeconomic": {
        "Estado de México": {
            "unemployment_rate": 4.8,
            "poverty_index": 0.18,
            "education_level": 8.9,
            "risk_multiplier": 1.25
        },
        "Nuevo León": {
            "unemployment_rate": 3.2,
            "poverty_index": 0.08,
            "education_level": 10.5,
            "risk_multiplier": 0.85
        },
        "Jalisco": {
            "unemployment_rate": 3.8,
            "poverty_index": 0.12,
            "education_level": 9.8,
            "risk_multiplier": 0.95
        }
    }
}

# Configuración específica por región
REGION_CONFIG = {
    "Estado de México": {
        "high_crime_threshold": 600,
        "business_robbery_threshold": 80,
        "risk_multiplier_base": 1.2
    },
    "Nuevo León": {
        "high_crime_threshold": 400,
        "business_robbery_threshold": 50,
        "risk_multiplier_base": 0.9
    },
    "Jalisco": {
        "high_crime_threshold": 450,
        "business_robbery_threshold": 60,
        "risk_multiplier_base": 1.0
    }
}
