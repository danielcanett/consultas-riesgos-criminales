#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import csv
import os
from datetime import datetime

def normalize(s):
    import unicodedata
    if not isinstance(s, str):
        return ""
    return unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('ASCII').strip().upper()

def importar_datos_csv():
    """Importar datos del CSV a la base de datos y buscar específicamente datos de Hidalgo"""
    
    DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
    CSV_PATH = os.path.join(DATA_DIR, 'municipal_delitos_2015_2025.csv')
    DB_PATH = os.path.join(DATA_DIR, 'real_crime_data.db')
    
    print("🔄 IMPORTANDO DATOS REALES DEL CSV")
    print("="*50)
    
    # Verificar que el CSV existe
    if not os.path.exists(CSV_PATH):
        print(f"❌ Error: No se encuentra el archivo CSV en {CSV_PATH}")
        return
    
    # Conectar a la base de datos
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Crear tabla si no existe
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS crime_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estado TEXT NOT NULL,
            municipio TEXT NOT NULL,
            year INTEGER NOT NULL,
            month INTEGER NOT NULL,
            tipo_delito TEXT DEFAULT '',
            robo_comun REAL DEFAULT 0,
            robo_casa_habitacion REAL DEFAULT 0,
            robo_negocio REAL DEFAULT 0,
            robo_vehiculo REAL DEFAULT 0,
            homicidio_doloso REAL DEFAULT 0,
            homicidio_culposo REAL DEFAULT 0,
            extorsion REAL DEFAULT 0,
            secuestro REAL DEFAULT 0,
            total_delitos REAL DEFAULT 0,
            poblacion INTEGER DEFAULT 0,
            tasa_criminalidad REAL DEFAULT 0,
            fuente TEXT DEFAULT 'SESNSP',
            fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(estado, municipio, year, month, tipo_delito)
        )
    ''')
    
    total_insertados = 0
    registros_hidalgo = 0
    municipios_hidalgo = set()
    tezontepec_encontrado = False
    
    try:
        print(f"📖 Leyendo archivo CSV: {CSV_PATH}")
        
        with open(CSV_PATH, encoding='latin1') as f:
            reader = csv.DictReader(f)
            
            # Mostrar headers para debug
            headers = reader.fieldnames
            print(f"📋 Columnas encontradas: {len(headers)}")
            for i, header in enumerate(headers[:10], 1):  # Solo mostrar las primeras 10
                print(f"   {i}. {header}")
            if len(headers) > 10:
                print(f"   ... y {len(headers)-10} más")
            
            print(f"\n🔄 Procesando datos...")
            
            for row_num, row in enumerate(reader):
                if row_num % 10000 == 0:
                    print(f"   Procesadas {row_num} filas...")
                
                # Normalizar campos principales
                estado = normalize(row.get('Entidad', ''))
                municipio = normalize(row.get('Municipio', ''))
                
                # Verificar si es de Hidalgo
                if 'HIDALGO' in estado:
                    registros_hidalgo += 1
                    municipios_hidalgo.add(municipio)
                    
                    if 'TEZONTEPEC' in municipio:
                        tezontepec_encontrado = True
                        print(f"🎯 ¡ENCONTRADO TEZONTEPEC! Fila {row_num}")
                        print(f"   Estado: {estado}")
                        print(f"   Municipio: {municipio}")
                        print(f"   Año: {row.get('Año', 'N/A')}")
                        print(f"   Tipo delito: {row.get('Tipo de delito', 'N/A')}")
                
                try:
                    year = int(row.get('Año', 0))
                    if year < 2020:  # Solo importar datos recientes
                        continue
                        
                    # Insertar registro para cada mes (solo para datos recientes y de Hidalgo)
                    if 'HIDALGO' in estado:
                        for mes_idx, mes in enumerate(['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                                                     'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'], 1):
                            try:
                                tipo_delito = row.get('Tipo de delito', '')
                                subtipo_delito = row.get('Subtipo de delito', '')
                                
                                # Manejar valores vacíos como cero
                                def safe_float(val):
                                    try:
                                        return float(val) if val not in [None, '', ' ', 'ND'] else 0.0
                                    except:
                                        return 0.0
                                
                                valor_mes = safe_float(row.get(mes, 0))
                                if valor_mes <= 0:
                                    continue
                                
                                # Clasificar el tipo de delito
                                homicidio_doloso = valor_mes if 'HOMICIDIO DOLOSO' in subtipo_delito.upper() else 0
                                homicidio_culposo = valor_mes if 'HOMICIDIO CULPOSO' in subtipo_delito.upper() else 0
                                extorsion = valor_mes if 'EXTORSION' in tipo_delito.upper() else 0
                                secuestro = valor_mes if 'SECUESTRO' in tipo_delito.upper() else 0
                                robo_comun = valor_mes if 'ROBO' in tipo_delito.upper() and 'COMUN' in subtipo_delito.upper() else 0
                                robo_casa = valor_mes if 'ROBO' in tipo_delito.upper() and 'CASA' in subtipo_delito.upper() else 0
                                robo_negocio = valor_mes if 'ROBO' in tipo_delito.upper() and 'NEGOCIO' in subtipo_delito.upper() else 0
                                robo_vehiculo = valor_mes if 'ROBO' in tipo_delito.upper() and 'VEHICULO' in subtipo_delito.upper() else 0
                                
                                cursor.execute('''
                                    INSERT OR REPLACE INTO crime_data 
                                    (estado, municipio, year, month, tipo_delito, robo_comun, robo_casa_habitacion, 
                                     robo_negocio, robo_vehiculo, homicidio_doloso, homicidio_culposo, 
                                     extorsion, secuestro, total_delitos, poblacion, tasa_criminalidad, fuente, fecha_actualizacion)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                ''', (
                                    estado, municipio, year, mes_idx, f"{tipo_delito} - {subtipo_delito}", 
                                    robo_comun, robo_casa, robo_negocio, robo_vehiculo,
                                    homicidio_doloso, homicidio_culposo, extorsion, secuestro, valor_mes, 
                                    0, 0, 'SESNSP Real Data', datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                                ))
                                total_insertados += 1
                                
                            except Exception as e:
                                print(f"⚠️ Error en mes {mes}: {e}")
                                continue
                                
                except Exception as e:
                    print(f"⚠️ Error en fila {row_num}: {e}")
                    continue
                    
                # Limitar para no saturar (quitar este break para importación completa)
                if row_num > 100000:  # Importar solo una muestra para verificar
                    break
    
    except Exception as e:
        print(f"❌ Error general: {e}")
    
    # Commit y cerrar
    conn.commit()
    conn.close()
    
    # Mostrar resultados
    print(f"\n📊 RESULTADOS DE IMPORTACIÓN:")
    print(f"   ✅ Registros insertados: {total_insertados}")
    print(f"   🏛️ Registros de Hidalgo procesados: {registros_hidalgo}")
    print(f"   🗺️ Municipios de Hidalgo encontrados: {len(municipios_hidalgo)}")
    print(f"   🎯 Tezontepec encontrado: {'✅ SÍ' if tezontepec_encontrado else '❌ NO'}")
    
    if municipios_hidalgo:
        print(f"\n🏛️ MUNICIPIOS DE HIDALGO:")
        for municipio in sorted(municipios_hidalgo):
            if 'TEZONTEPEC' in municipio:
                print(f"   🎯 {municipio} <- ¡ESTE ES EL QUE NECESITAMOS!")
            else:
                print(f"   - {municipio}")

if __name__ == "__main__":
    importar_datos_csv()
