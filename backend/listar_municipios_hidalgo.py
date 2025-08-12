#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import os

def obtener_municipios_hidalgo():
    """Obtener la lista completa de municipios de Hidalgo disponibles"""
    
    DB_PATH = 'data/real_crime_data.db'
    
    print("📋 MUNICIPIOS DE HIDALGO EN BASE DE DATOS SESNSP")
    print("="*60)
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Error: No se encuentra la base de datos en {DB_PATH}")
        return []
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Obtener todos los municipios de Hidalgo
        cursor.execute("""
            SELECT DISTINCT municipio, COUNT(*) as registros
            FROM crime_data 
            WHERE UPPER(estado) LIKE '%HIDALGO%'
            GROUP BY municipio
            ORDER BY municipio
        """)
        municipios = cursor.fetchall()
        
        print(f"🏛️ Total de municipios encontrados: {len(municipios)}")
        print()
        
        # Buscar específicamente municipios con "TEZONTEPEC"
        tezontepec_municipios = []
        municipios_cercanos = []
        
        for i, (municipio, registros) in enumerate(municipios, 1):
            # Marcar municipios con Tezontepec
            if 'TEZONTEPEC' in municipio.upper():
                tezontepec_municipios.append(municipio)
                print(f"🎯 {i:2d}. {municipio} ({registros:,} registros) <- ¡CONTIENE TEZONTEPEC!")
            # Marcar municipios que ya usamos
            elif municipio in ['ACTOPAN', 'ZEMPOALA', 'TEPEAPULCO']:
                print(f"✅ {i:2d}. {municipio} ({registros:,} registros) <- YA EN USO")
            # Buscar municipios que podrían estar cerca geográficamente
            elif any(palabra in municipio.upper() for palabra in ['PACHUCA', 'MINERAL', 'TULANCINGO', 'TULA']):
                municipios_cercanos.append(municipio)
                print(f"🗺️ {i:2d}. {municipio} ({registros:,} registros) <- POSIBLEMENTE CERCANO")
            else:
                print(f"   {i:2d}. {municipio} ({registros:,} registros)")
        
        # Resumen
        print(f"\n" + "="*60)
        print("📊 RESUMEN:")
        print(f"   Total municipios Hidalgo: {len(municipios)}")
        print(f"   Municipios con 'Tezontepec': {len(tezontepec_municipios)}")
        print(f"   Municipios posiblemente cercanos: {len(municipios_cercanos)}")
        
        if tezontepec_municipios:
            print(f"\n🎯 MUNICIPIOS CON 'TEZONTEPEC':")
            for municipio in tezontepec_municipios:
                print(f"   - {municipio}")
        
        if municipios_cercanos:
            print(f"\n🗺️ MUNICIPIOS POSIBLEMENTE CERCANOS:")
            for municipio in municipios_cercanos:
                print(f"   - {municipio}")
        
        # Verificar datos de muestra para municipios con Tezontepec
        if tezontepec_municipios:
            print(f"\n📊 DATOS DE MUESTRA PARA MUNICIPIOS CON 'TEZONTEPEC':")
            for municipio in tezontepec_municipios:
                cursor.execute("""
                    SELECT year, month, total_delitos, fuente
                    FROM crime_data 
                    WHERE municipio = ? AND UPPER(estado) LIKE '%HIDALGO%'
                    ORDER BY year DESC, month DESC
                    LIMIT 3
                """, (municipio,))
                datos = cursor.fetchall()
                
                print(f"\n   🏛️ {municipio}:")
                for dato in datos:
                    print(f"      📅 {dato[0]}/{dato[1]:02d} - Total: {dato[2]} - Fuente: {dato[3]}")
        
        conn.close()
        return municipios
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

if __name__ == "__main__":
    municipios = obtener_municipios_hidalgo()
    
    print(f"\n" + "="*60)
    print("✅ ANÁLISIS COMPLETADO")
    
    if municipios:
        print("💡 RECOMENDACIONES:")
        print("   1. Si hay municipios con 'TEZONTEPEC', usar esos")
        print("   2. Si no, usar ACTOPAN (ya confirmado con datos reales)")
        print("   3. Alternativamente, usar municipios cercanos geográficamente")
