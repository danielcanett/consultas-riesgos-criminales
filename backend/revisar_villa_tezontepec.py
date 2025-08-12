#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import os

def revisar_villa_tezontepec():
    """Revisar exhaustivamente si Villa de Tezontepec existe en la base de datos"""
    
    DB_PATH = 'data/real_crime_data.db'
    
    print("🔍 REVISIÓN EXHAUSTIVA DE VILLA DE TEZONTEPEC")
    print("="*60)
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Error: No se encuentra la base de datos en {DB_PATH}")
        return False
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 1. Primero verificar el total de registros
        cursor.execute("SELECT COUNT(*) FROM crime_data")
        total = cursor.fetchone()[0]
        print(f"📊 Total de registros en base de datos: {total:,}")
        
        # 2. Buscar EXACTAMENTE "Villa de Tezontepec"
        print(f"\n🎯 Búsqueda 1: EXACTA 'Villa de Tezontepec'")
        cursor.execute("""
            SELECT COUNT(*) FROM crime_data 
            WHERE municipio = 'Villa de Tezontepec'
        """)
        exacto = cursor.fetchone()[0]
        print(f"   Resultados exactos: {exacto}")
        
        # 3. Buscar con LIKE case-sensitive
        print(f"\n🎯 Búsqueda 2: LIKE '%Villa de Tezontepec%'")
        cursor.execute("""
            SELECT COUNT(*) FROM crime_data 
            WHERE municipio LIKE '%Villa de Tezontepec%'
        """)
        like_case = cursor.fetchone()[0]
        print(f"   Resultados con LIKE: {like_case}")
        
        # 4. Buscar sin case-sensitive
        print(f"\n🎯 Búsqueda 3: LIKE case-insensitive")
        cursor.execute("""
            SELECT COUNT(*) FROM crime_data 
            WHERE UPPER(municipio) LIKE UPPER('%Villa de Tezontepec%')
        """)
        like_nocase = cursor.fetchone()[0]
        print(f"   Resultados sin case: {like_nocase}")
        
        # 5. Buscar cualquier cosa con "Tezontepec"
        print(f"\n🎯 Búsqueda 4: Cualquier 'Tezontepec'")
        cursor.execute("""
            SELECT DISTINCT estado, municipio, COUNT(*) as cantidad
            FROM crime_data 
            WHERE UPPER(municipio) LIKE UPPER('%Tezontepec%')
            GROUP BY estado, municipio
            ORDER BY municipio
        """)
        todos_tezontepec = cursor.fetchall()
        print(f"   Municipios encontrados con 'Tezontepec': {len(todos_tezontepec)}")
        
        for municipio in todos_tezontepec:
            print(f"      🏛️ {municipio[0]} - {municipio[1]} ({municipio[2]:,} registros)")
        
        # 6. Si no encontramos nada, buscar municipios similares
        if len(todos_tezontepec) == 0:
            print(f"\n🔍 Búsqueda 5: Municipios similares con 'Villa'")
            cursor.execute("""
                SELECT DISTINCT estado, municipio, COUNT(*) as cantidad
                FROM crime_data 
                WHERE UPPER(municipio) LIKE UPPER('%Villa%')
                AND estado LIKE '%Hidalgo%'
                GROUP BY estado, municipio
                ORDER BY municipio
                LIMIT 10
            """)
            villas_hidalgo = cursor.fetchall()
            
            if villas_hidalgo:
                print(f"   Municipios con 'Villa' en Hidalgo: {len(villas_hidalgo)}")
                for villa in villas_hidalgo:
                    print(f"      🏛️ {villa[0]} - {villa[1]} ({villa[2]:,} registros)")
            
            # También buscar todos los municipios de Hidalgo
            print(f"\n🗺️ Todos los municipios de Hidalgo disponibles:")
            cursor.execute("""
                SELECT DISTINCT municipio, COUNT(*) as cantidad
                FROM crime_data 
                WHERE estado LIKE '%Hidalgo%'
                GROUP BY municipio
                ORDER BY municipio
            """)
            municipios_hidalgo = cursor.fetchall()
            
            print(f"   Total municipios de Hidalgo: {len(municipios_hidalgo)}")
            for municipio in municipios_hidalgo:
                print(f"      - {municipio[0]} ({municipio[1]:,} registros)")
        
        # 7. Si encontramos Villa de Tezontepec, mostrar datos de ejemplo
        if like_nocase > 0:
            print(f"\n📋 DATOS DE EJEMPLO PARA VILLA DE TEZONTEPEC:")
            cursor.execute("""
                SELECT year, month, robo_comun, homicidio_doloso, extorsion, 
                       total_delitos, fuente, fecha_actualizacion
                FROM crime_data 
                WHERE UPPER(municipio) LIKE UPPER('%Villa de Tezontepec%')
                ORDER BY year DESC, month DESC
                LIMIT 5
            """)
            ejemplos = cursor.fetchall()
            
            for ejemplo in ejemplos:
                print(f"   📅 {ejemplo[0]}/{ejemplo[1]:02d} - Robo: {ejemplo[2]}, Homicidio: {ejemplo[3]}, Extorsión: {ejemplo[4]}")
                print(f"      Total: {ejemplo[5]}, Fuente: {ejemplo[6]}, Actualizado: {ejemplo[7]}")
            
            conn.close()
            return True
        else:
            conn.close()
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    encontrado = revisar_villa_tezontepec()
    
    print(f"\n" + "="*60)
    if encontrado:
        print("✅ RESULTADO: Villa de Tezontepec SÍ tiene datos en la base")
    else:
        print("❌ RESULTADO: Villa de Tezontepec NO tiene datos en la base")
        print("   Recomendación: Usar un municipio con datos confirmados")
