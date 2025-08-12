import csv
import sqlite3
import os

print("🔍 EXPLORANDO DATOS REALES DISPONIBLES PARA HIDALGO")
print("="*60)

# 1. Explorar CSV para Hidalgo
csv_path = 'data/municipal_delitos_2015_2025.csv'
print(f"\n📄 Analizando CSV: {csv_path}")

try:
    # Leer las primeras líneas para entender la estructura
    with open(csv_path, 'r', encoding='latin1') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        print(f"\n🏷️ Columnas del CSV ({len(headers)}):")
        for i, header in enumerate(headers, 1):
            print(f"   {i:2d}. {header}")
        
        # Buscar registros de Hidalgo
        hidalgo_registros = []
        municipios_hidalgo = set()
        
        for row_num, row in enumerate(reader):
            if row_num > 50000:  # Limitar para evitar que tarde mucho
                break
                
            entidad = row.get('Entidad', '').upper()
            if 'HIDALGO' in entidad:
                municipio = row.get('Municipio', '').strip()
                municipios_hidalgo.add(municipio)
                hidalgo_registros.append(row)
                
                # Si encontramos Tezontepec, mostrarlo
                if 'TEZONTEPEC' in municipio.upper():
                    print(f"\n🎯 ¡ENCONTRADO TEZONTEPEC!")
                    print(f"   Municipio: {municipio}")
                    print(f"   Año: {row.get('Año', 'N/A')}")
                    print(f"   Tipo delito: {row.get('Tipo de delito', 'N/A')}")
        
        print(f"\n🏛️ MUNICIPIOS DE HIDALGO ENCONTRADOS ({len(municipios_hidalgo)}):")
        for municipio in sorted(municipios_hidalgo):
            if 'TEZONTEPEC' in municipio.upper():
                print(f"   ✅ {municipio} <- ¡Este es el que necesitamos!")
            else:
                print(f"   - {municipio}")
        
        print(f"\n📊 Total registros de Hidalgo analizados: {len(hidalgo_registros)}")

except Exception as e:
    print(f"❌ Error leyendo CSV: {e}")

# 2. Verificar base de datos actual
db_path = 'data/real_crime_data.db'
print(f"\n💾 Verificando base de datos: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Contar registros actuales
    cursor.execute("SELECT COUNT(*) FROM crime_data")
    total_registros = cursor.fetchone()[0]
    print(f"📈 Total registros actuales en BD: {total_registros}")
    
    # Verificar registros de Hidalgo
    cursor.execute("SELECT DISTINCT municipio FROM crime_data WHERE estado LIKE '%Hidalgo%' ORDER BY municipio")
    municipios_bd = cursor.fetchall()
    print(f"\n🏛️ MUNICIPIOS DE HIDALGO EN BD ACTUAL ({len(municipios_bd)}):")
    for municipio in municipios_bd:
        print(f"   - {municipio[0]}")
    
    # Buscar específicamente Tezontepec
    cursor.execute("SELECT COUNT(*) FROM crime_data WHERE municipio LIKE '%Tezontepec%'")
    tezontepec_count = cursor.fetchone()[0]
    print(f"\n🎯 Registros de Tezontepec en BD: {tezontepec_count}")
    
    conn.close()
    
except Exception as e:
    print(f"❌ Error accediendo a BD: {e}")

print("\n" + "="*60)
print("✅ ANÁLISIS COMPLETADO")
