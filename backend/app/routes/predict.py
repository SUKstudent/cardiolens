from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PatientInput, PredictionResponse
from app.services import ml_service

router = APIRouter()


@router.post("/predict", response_model=PredictionResponse)
def predict(patient: PatientInput):
    try:
        result = ml_service.predict_cardiolens(patient.model_dump(by_alias=True))
        return result
    except NotImplementedError as e:
        raise HTTPException(status_code=501, detail=str(e))
    except Exception as e:
        # Log full traceback in terminal, return safe message
        print(f"[predict] error: {e}")
        raise HTTPException(
            status_code=500, detail="Prediction failed. Check server logs."
        )