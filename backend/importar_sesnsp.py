


import os
import sqlite3
import pandas as pd
import time
import unicodedata

# Ruta a la base de datos
DB_PATH = os.path.join(os.path.dirname(__file__), "data", "real_crime_data.db")

# Archivos locales posibles (ajustar nombres si es necesario)
ARCHIVOS = [
    os.path.join(os.path.dirname(__file__), "data", "Municipal-Delitos - Junio 2025 (2015-2025).csv"),
    os.path.join(os.path.dirname(__file__), "data", "Municipal-Delitos - Junio 2025 (2015-2025).xlsx"),
]


def cargar_dataframe():
    for archivo in ARCHIVOS:
        if os.path.exists(archivo):
            print(f"Cargando archivo: {archivo}")
            if archivo.endswith('.csv'):
                try:
                    df = pd.read_csv(archivo, encoding='utf-8')
                except UnicodeDecodeError:
                    print("Advertencia: el archivo no es UTF-8, intentando con latin1...")
                    df = pd.read_csv(archivo, encoding='latin1')
            else:
                df = pd.read_excel(archivo)
            print("Columnas detectadas:", df.columns.tolist())
            return df
    raise FileNotFoundError("No se encontró ningún archivo consolidado de delitos en la carpeta data.")




def normalizar(s):
    if not isinstance(s, str):
        return ""
    return unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('ASCII').strip().upper()

def procesar_e_insertar():
    df = cargar_dataframe()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Limpiar la tabla antes de importar
    cursor.execute('DELETE FROM crime_data;')
    conn.commit()

    # Normalizar nombres de columnas
    df = df.rename(columns={
        'Año': 'year',
        'Entidad': 'estado',
        'Municipio': 'municipio',
        'Tipo de delito': 'tipo_delito',
        'Subtipo de delito': 'subtipo_delito',
        'Modalidad': 'modalidad',
    })

    # Definir almacenes y mapeos
    almacenes = [
        {"estado": "Estado de México", "municipio": "Tultepec"},
        {"estado": "Nuevo León", "municipio": "Monterrey"},
        {"estado": "Jalisco", "municipio": "Guadalajara"},
        {"estado": "Yucatan", "municipio": "Merida"},
        {"estado": "Guanajuato", "municipio": "Leon"},
        # Para Hidalgo, incluir los municipios industriales más probables
        {"estado": "Hidalgo", "municipio": "Tepeapulco"},
        {"estado": "Hidalgo", "municipio": "Zempoala"},
        {"estado": "Hidalgo", "municipio": "Pachuca de Soto"},
    ]

    # Normalizar columnas para comparación
    df['estado_norm'] = df['estado'].apply(normalizar)
    df['municipio_norm'] = df['municipio'].apply(normalizar)

    df_filtrado = pd.DataFrame()
    for a in almacenes:
        estado_norm = normalizar(a['estado'])
        municipio_norm = normalizar(a['municipio'])
        mask = (df['estado_norm'] == estado_norm) & (df['municipio_norm'] == municipio_norm)
        encontrados = df[mask]
        if encontrados.empty:
            print(f"ADVERTENCIA: No se encontraron datos para {a['municipio']}, {a['estado']}")
        else:
            print(f"OK: {a['municipio']}, {a['estado']} - {len(encontrados)} registros")
            df_filtrado = pd.concat([df_filtrado, encontrados])
    df = df_filtrado.copy()


    meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

    if df.empty:
        print("No se encontraron datos para los almacenes definidos. Revisa los nombres o el archivo fuente.")
        conn.close()
        return
    grupos = list(df.groupby(['estado','municipio','year','tipo_delito']))
    total_grupos = len(grupos)
    print(f"Procesando {total_grupos} combinaciones de municipio/año/tipo de delito SOLO PARA ALMACENES...")
    start_time = time.time()
    for idx, ((estado, municipio, year, tipo_delito), grupo) in enumerate(grupos, 1):
        total_anual = grupo[meses].sum().sum()
        for i, mes in enumerate(meses, 1):
            total_mes = grupo[mes].sum()
            cursor.execute('''
                INSERT OR REPLACE INTO crime_data 
                (estado, municipio, year, month, tipo_delito, total_delitos, fuente)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                estado, municipio, int(year), i, tipo_delito, int(total_mes), "SESNSP Oficial"
            ))
        cursor.execute('''
            INSERT OR REPLACE INTO crime_data 
            (estado, municipio, year, month, tipo_delito, total_delitos, fuente)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            estado, municipio, int(year), 0, tipo_delito, int(total_anual), "SESNSP Oficial"
        ))
        if idx % 500 == 0 or idx == total_grupos:
            elapsed = time.time() - start_time
            print(f"Progreso: {idx}/{total_grupos} ({(idx/total_grupos)*100:.1f}%) - Tiempo transcurrido: {elapsed:.1f} s")
    conn.commit()
    conn.close()
    print("Actualización completada SOLO para municipios y estados de almacenes.")

if __name__ == "__main__":
    procesar_e_insertar()
