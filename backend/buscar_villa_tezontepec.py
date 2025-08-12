import sqlite3
import os

def buscar_villa_tezontepec():
    """Buscar datos específicos para Villa de Tezontepec en la base de datos"""
    
    DB_PATH = 'data/real_crime_data.db'
    
    print("🔍 BUSCANDO DATOS PARA VILLA DE TEZONTEPEC")
    print("="*50)
    
    if not os.path.exists(DB_PATH):
        print(f"❌ No se encuentra la base de datos en {DB_PATH}")
        return
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 1. Buscar exactamente "Villa de Tezontepec"
        print("🎯 Buscando 'Villa de Tezontepec' exacto...")
        cursor.execute("""
            SELECT estado, municipio, year, month, fuente, total_delitos 
            FROM crime_data 
            WHERE municipio LIKE '%Villa de Tezontepec%' 
            ORDER BY year DESC, month DESC
        """)
        villa_exacto = cursor.fetchall()
        
        if villa_exacto:
            print(f"✅ ENCONTRADO! {len(villa_exacto)} registros para Villa de Tezontepec:")
            for registro in villa_exacto[:5]:  # Mostrar los primeros 5
                print(f"   📊 {registro[0]} - {registro[1]} ({registro[2]}/{registro[3]}) - {registro[4]} - Total: {registro[5]}")
        else:
            print("❌ No se encontraron registros exactos para 'Villa de Tezontepec'")
        
        # 2. Buscar cualquier municipio que contenga "Tezontepec"
        print(f"\n🔍 Buscando cualquier municipio con 'Tezontepec'...")
        cursor.execute("""
            SELECT DISTINCT estado, municipio, COUNT(*) as registros
            FROM crime_data 
            WHERE municipio LIKE '%Tezontepec%' 
            GROUP BY estado, municipio
            ORDER BY municipio
        """)
        todos_tezontepec = cursor.fetchall()
        
        if todos_tezontepec:
            print(f"📋 Municipios encontrados con 'Tezontepec' ({len(todos_tezontepec)}):")
            for municipio in todos_tezontepec:
                print(f"   🏛️ {municipio[0]} - {municipio[1]} ({municipio[2]} registros)")
        else:
            print("❌ No se encontraron municipios con 'Tezontepec'")
        
        # 3. Buscar todos los municipios de Hidalgo para referencia
        print(f"\n🗺️ Todos los municipios de Hidalgo disponibles:")
        cursor.execute("""
            SELECT DISTINCT municipio, COUNT(*) as registros
            FROM crime_data 
            WHERE estado LIKE '%Hidalgo%' 
            GROUP BY municipio
            ORDER BY municipio
        """)
        municipios_hidalgo = cursor.fetchall()
        
        for municipio in municipios_hidalgo:
            if 'TEZONTEPEC' in municipio[0].upper():
                print(f"   🎯 {municipio[0]} ({municipio[1]} registros) <- ¡Coincidencia!")
            else:
                print(f"   - {municipio[0]} ({municipio[1]} registros)")
        
        # 4. Si encontramos Villa de Tezontepec, mostrar datos detallados
        if villa_exacto:
            print(f"\n📊 DATOS DETALLADOS DE VILLA DE TEZONTEPEC:")
            cursor.execute("""
                SELECT year, month, robo_comun, robo_casa_habitacion, robo_negocio, 
                       robo_vehiculo, homicidio_doloso, homicidio_culposo, extorsion, 
                       secuestro, total_delitos, fuente
                FROM crime_data 
                WHERE municipio LIKE '%Villa de Tezontepec%' 
                ORDER BY year DESC, month DESC
                LIMIT 3
            """)
            detalles = cursor.fetchall()
            
            for detalle in detalles:
                print(f"   📅 {detalle[0]}/{detalle[1]:02d} - Fuente: {detalle[11]}")
                print(f"      Robos: Común={detalle[2]}, Casa={detalle[3]}, Negocio={detalle[4]}, Vehículo={detalle[5]}")
                print(f"      Homicidios: Doloso={detalle[6]}, Culposo={detalle[7]}")
                print(f"      Otros: Extorsión={detalle[8]}, Secuestro={detalle[9]}")
                print(f"      Total delitos: {detalle[10]}")
                print()
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    buscar_villa_tezontepec()
