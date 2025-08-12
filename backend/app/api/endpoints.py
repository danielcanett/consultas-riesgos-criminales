from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, db, risk_engine

router = APIRouter()

@router.get("/hello")
def hello_world():
    return {"message": "Hello, world!"}

@router.post("/consultar-riesgo", response_model=schemas.RiskResponse)
def consultar_riesgo(request: schemas.RiskRequest, db_sess: Session = Depends(db.get_db)):
    # Llama al motor de riesgos
    prob, loss = risk_engine.calcular_probabilidad_y_perdida(request)
    # Guarda consulta en historial
    hist = models.History.create_from_request(request, prob, loss)
    db_sess.add(hist)
    db_sess.commit()
    db_sess.refresh(hist)
    return schemas.RiskResponse(
        probabilidad=prob,
        perdida_esperada=loss,
        historico=[]
    )

@router.get("/historial", response_model=list[schemas.HistoryResponse])
def get_historial(db_sess: Session = Depends(db.get_db)):
    records = db_sess.query(models.History).all()
    return [schemas.HistoryResponse.from_orm(r) for r in records]