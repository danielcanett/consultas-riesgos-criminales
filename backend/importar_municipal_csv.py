import sqlite3
import csv
import os
from datetime import datetime

def normalize(s):
    import unicodedata
    if not isinstance(s, str):
        return ""
    return unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('ASCII').strip().upper()

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
CSV_PATH = os.path.join(DATA_DIR, 'municipal_delitos_2015_2025.csv')
DB_PATH = os.path.join(DATA_DIR, 'real_crime_data.db')

def importar_csv():
    # Asegurar que el directorio de datos existe
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    # Abrir la base de datos
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    total_insertados = 0
    with open(CSV_PATH, encoding='latin1') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Normalizar campos
            estado = normalize(row.get('Entidad', ''))
            municipio = normalize(row.get('Municipio', ''))
            year = int(row.get('Año', 0))
            # Insertar por cada mes
            for mes in ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']:
                try:
                    month = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].index(mes)+1
                    tipo_delito = row.get('Tipo de delito','')
                    subtipo_delito = row.get('Subtipo de delito','')
                    modalidad = row.get('Modalidad','')
                    # Manejar valores vacíos como cero
                    def safe_float(val):
                        return float(val) if val not in [None, '', ' '] else 0.0
                    valor_mes = safe_float(row.get(mes,0))
                    homicidio_doloso = valor_mes if 'Homicidio doloso' in subtipo_delito else 0
                    homicidio_culposo = valor_mes if 'Homicidio culposo' in subtipo_delito else 0
                    extorsion = valor_mes if 'Extorsion' in tipo_delito else 0
                    secuestro = valor_mes if 'Secuestro' in tipo_delito else 0
                    robo_comun = valor_mes if 'Robo' in tipo_delito else 0
                    robo_casa_habitacion = 0 # No hay columna directa, se puede ajustar si existe
                    robo_negocio = 0 # No hay columna directa, se puede ajustar si existe
                    robo_vehiculo = 0 # No hay columna directa, se puede ajustar si existe
                    total_delitos = valor_mes
                    poblacion = 0 # No disponible en el CSV
                    tasa_criminalidad = 0 # No disponible en el CSV
                    fuente = 'SESNSP'
                    fecha_actualizacion = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    cursor.execute('''
                        INSERT OR REPLACE INTO crime_data 
                        (estado, municipio, year, month, tipo_delito, robo_comun, robo_casa_habitacion, 
                         robo_negocio, robo_vehiculo, homicidio_doloso, homicidio_culposo, 
                         extorsion, secuestro, total_delitos, poblacion, tasa_criminalidad, fuente, fecha_actualizacion)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        estado, municipio, year, month, tipo_delito, robo_comun, robo_casa_habitacion, robo_negocio, robo_vehiculo,
                        homicidio_doloso, homicidio_culposo, extorsion, secuestro, total_delitos, poblacion,
                        tasa_criminalidad, fuente, fecha_actualizacion
                    ))
                    total_insertados += 1
                except Exception as e:
                    print(f"Error en fila: {row} mes {mes} -> {e}")
    conn.commit()
    conn.close()
    print(f"✅ Importación finalizada. Registros insertados/actualizados: {total_insertados}")

if __name__ == "__main__":
    importar_csv()
