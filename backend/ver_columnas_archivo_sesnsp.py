import pandas as pd
import os

archivos = [
    os.path.join(os.path.dirname(__file__), "data", "Municipal-Delitos - Junio 2025 (2015-2025).csv"),
    os.path.join(os.path.dirname(__file__), "data", "Municipal-Delitos - Junio 2025 (2015-2025).xlsx"),
]

for archivo in archivos:
    if os.path.exists(archivo):
        print(f"\nArchivo encontrado: {archivo}")
        if archivo.endswith('.csv'):
            try:
                df = pd.read_csv(archivo, nrows=1, encoding='utf-8')
            except UnicodeDecodeError:
                print("Advertencia: el archivo no es UTF-8, intentando con latin1...")
                df = pd.read_csv(archivo, nrows=1, encoding='latin1')
        else:
            df = pd.read_excel(archivo, nrows=1)
        print("Columnas detectadas:")
        for col in df.columns:
            print(f"- {col}")
    else:
        print(f"No se encontró: {archivo}")
