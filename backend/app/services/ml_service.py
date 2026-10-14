import joblib
from pathlib import Path

from app.services.raw_to_59 import raw_to_59
from app.services import shap_service

BASE = Path(__file__).resolve().parents[2] / "cardiolens_ml"

_cad = joblib.load(BASE / "models" / "cad_model.joblib")
_lad = joblib.load(BASE / "models" / "lad_model.joblib")
_lcx = joblib.load(BASE / "models" / "lcx_rf_model.joblib")
_rca = joblib.load(BASE / "models" / "rca_model.joblib")

USE_MOCK = False


def _mock_response():
    return {
        "overall_cad": 0.72,
        "lad": 0.80,
        "lcx": 0.45,
        "rca": 0.15,
        "explanations": {
            "overall_cad": [],
            "lad": [],
            "lcx": [],
            "rca": [],
        },
    }


def predict_cardiolens(raw_patient: dict) -> dict:
    if USE_MOCK:
        return _mock_response()

    X = raw_to_59(raw_patient)

    predictions = {
        "overall_cad": float(_cad.predict_proba(X)[0][1]),
        "lad": float(_lad.predict_proba(X)[0][1]),
        "lcx": float(_lcx.predict_proba(X)[0][1]),
        "rca": float(_rca.predict_proba(X)[0][1]),
    }

    try:
        explanations = {
            "overall_cad": shap_service.explain("overall_cad", X, raw_patient),
            "lad": shap_service.explain("lad", X, raw_patient),
            "lcx": shap_service.explain("lcx", X, raw_patient),
            "rca": shap_service.explain("rca", X, raw_patient),
        }
    except Exception as e:
        print(f"[ml_service] SHAP failed: {e}")
        explanations = {
            "overall_cad": [], "lad": [], "lcx": [], "rca": [],
        }

    return {**predictions, "explanations": explanations}