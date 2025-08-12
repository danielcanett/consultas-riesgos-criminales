import sqlite3
import pandas as pd
import os

print("=== ANÁLISIS DE DATOS REALES DISPONIBLES ===\n")

# 1. Explorar base de datos SQLite
db_path = 'data/real_crime_data.db'
if os.path.exists(db_path):
    print("📊 EXPLORANDO BASE DE DATOS SQLite")
    conn = sqlite3.connect(db_path)
    
    # Ver todos los municipios de Hidalgo
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT estado, municipio, fuente FROM crime_data WHERE estado LIKE '%Hidalgo%' ORDER BY municipio;")
    hidalgo_data = cursor.fetchall()
    print("\n🏛️ MUNICIPIOS DE HIDALGO EN BASE DE DATOS:")
    for row in hidalgo_data:
        print(f"   Estado: {row[0]}, Municipio: {row[1]}, Fuente: {row[2]}")
    
    # Ver todos los estados disponibles
    cursor.execute("SELECT DISTINCT estado FROM crime_data ORDER BY estado;")
    estados = cursor.fetchall()
    print("\n🗺️ TODOS LOS ESTADOS EN BASE DE DATOS:")
    for estado in estados:
        print(f"   - {estado[0]}")
    
    # Contar registros por fuente
    cursor.execute("SELECT fuente, COUNT(*) as cantidad FROM crime_data GROUP BY fuente;")
    fuentes = cursor.fetchall()
    print("\n📈 REGISTROS POR FUENTE:")
    for fuente in fuentes:
        print(f"   {fuente[0]}: {fuente[1]} registros")
    
    # Ver algunos registros de ejemplo para Hidalgo
    cursor.execute("SELECT * FROM crime_data WHERE estado LIKE '%Hidalgo%' LIMIT 5;")
    ejemplos = cursor.fetchall()
    print("\n📋 EJEMPLOS DE REGISTROS DE HIDALGO:")
    for ejemplo in ejemplos:
        print(f"   {ejemplo[1]} - {ejemplo[2]} ({ejemplo[3]}/{ejemplo[4]})")
    
    conn.close()
else:
    print("❌ No se encontró la base de datos SQLite")

# 2. Explorar archivo CSV
csv_path = 'data/municipal_delitos_2015_2025.csv'
if os.path.exists(csv_path):
    print("\n📄 EXPLORANDO ARCHIVO CSV")
    try:
        # Leer solo las primeras filas
        df = pd.read_csv(csv_path, nrows=20)
        print(f"\n📊 Estructura del CSV:")
        print(f"   Filas de muestra: {len(df)}")
        print(f"   Columnas: {len(df.columns)}")
        print("\n🏷️ Columnas disponibles:")
        for i, col in enumerate(df.columns.tolist(), 1):
            print(f"   {i:2d}. {col}")
        
        # Buscar datos de Hidalgo en el CSV
        if 'estado' in df.columns or 'Estado' in df.columns:
            estado_col = 'estado' if 'estado' in df.columns else 'Estado'
            hidalgo_csv = df[df[estado_col].str.contains('Hidalgo', case=False, na=False)]
            print(f"\n🏛️ REGISTROS DE HIDALGO EN CSV: {len(hidalgo_csv)}")
            if len(hidalgo_csv) > 0:
                if 'municipio' in df.columns:
                    municipios_hidalgo = hidalgo_csv['municipio'].unique()
                    print("   Municipios encontrados:")
                    for municipio in sorted(municipios_hidalgo):
                        print(f"     - {municipio}")
                        
                # Buscar específicamente Tezontepec
                tezontepec = hidalgo_csv[hidalgo_csv['municipio'].str.contains('Tezontepec', case=False, na=False)]
                print(f"\n🎯 REGISTROS DE TEZONTEPEC: {len(tezontepec)}")
                if len(tezontepec) > 0:
                    print("   ✅ ¡Encontrados datos reales de Tezontepec!")
                else:
                    print("   ❌ No se encontraron datos de Tezontepec")
        
    except Exception as e:
        print(f"❌ Error leyendo CSV: {e}")
else:
    print("❌ No se encontró el archivo CSV")

print("\n" + "="*60)
print("RESUMEN: Análisis completado")
