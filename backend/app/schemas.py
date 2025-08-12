from pydantic import BaseModel
from typing import List, Optional, Any

class RiskAssessmentRequest(BaseModel):
    address: str
    ambito: Optional[str]
    scenarios: List[str]
    security_measures: List[str]
    comments: Optional[str]

class RiskAssessmentResponse(BaseModel):
    results: Any  # Cambiado de list a Any para aceptar diccionarios también