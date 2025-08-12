import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "real_crime_data.db")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

print("\nTablas disponibles:")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
for row in cursor.fetchall():
    print("-", row[0])

print("\nEstados, municipios y años disponibles:")
cursor.execute("SELECT DISTINCT estado, municipio, year FROM crime_data ORDER BY estado, municipio, year;")
for row in cursor.fetchall():
    print(f"Estado: {row[0]}, Municipio: {row[1]}, Año: {row[2]}")

print("\nEjemplo de registros reales:")
cursor.execute("SELECT * FROM crime_data LIMIT 10;")
columns = [desc[0] for desc in cursor.description]
for row in cursor.fetchall():
    print(dict(zip(columns, row)))

conn.close()
print("\nConsulta finalizada. Solo datos reales mostrados.")
