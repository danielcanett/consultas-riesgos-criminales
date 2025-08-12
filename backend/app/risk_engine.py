# Motor simplificado de riesgos: puedes mejorar con modelos reales
def calcular_probabilidad_y_perdida(request):
    # Ejemplo básico: Poisson para sismos, aleatorio para otros
    tipo = request.tipo_evento
    params = request.parametros
    if tipo == "sismo":
        import numpy as np
        lam = params.get("frecuencia", 1)
        prob = 1 - np.exp(-lam)
        perdida = params.get("valor_ubicacion", 100000) * prob * 0.1
    elif tipo == "intrusión":
        prob = 0.15
        perdida = params.get("valor_ubicacion", 100000) * 0.2
    else:
        prob = 0.05
        perdida = 5000
    return round(prob, 2), round(perdida, 2)