import requests
import json

# Crear un endpoint temporal para explorar datos
url = "http://localhost:8001"

# Verificar que el servidor esté funcionando
try:
    response = requests.get(f"{url}/docs")
    print("✅ Servidor backend está funcionando en localhost:8001")
except:
    print("❌ Servidor backend no está accesible")

# Vamos a crear una consulta directa a través del backend
