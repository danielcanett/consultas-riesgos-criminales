from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class History(Base):
    __tablename__ = "historial"

    id = Column(Integer, primary_key=True, index=True)
    tipo_evento = Column(String, index=True)
    parametros = Column(JSON)
    probabilidad = Column(Float)
    perdida_esperada = Column(Float)
    fecha = Column(DateTime, default=datetime.utcnow)

    @staticmethod
    def create_from_request(request, prob, loss):
        return History(
            tipo_evento=request.tipo_evento,
            parametros=request.parametros,
            probabilidad=prob,
            perdida_esperada=loss
        )