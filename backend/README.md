# CardioLens Backend

FastAPI backend connecting the CardioLens frontend to four trained ML models
(CAD, LAD, LCX, RCA) with SHAP explainability.

## Status — Oct 7

✅ Real ML models integrated
✅ raw → 59 preprocessing verified (59/59 match)
✅ SHAP explainers live with raw patient values
✅ End-to-end tested with sample patient (row 149)
✅ Target leakage blocked at schema level
✅ CORS configured for localhost:5173 and :3000

## Run

```powershell
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

Swagger UI: http://127.0.0.1:8000/docs

Environment
Python 3.13.15

scikit-learn 1.6.1, pandas 2.2.3, numpy 2.1.3

shap 0.52.0, joblib 1.6.0

fastapi, uvicorn, pydantic

Test
powershell
python scripts\verify_sample.py    # preprocessing verification
python scripts\test_predict.py     # real prediction + SHAP
Structure
app/main.py — FastAPI app + CORS

app/routes/health.py — GET /health

app/routes/predict.py — POST /predict

app/schemas/prediction.py — Pydantic request/response

app/services/raw_to_59.py — preprocessing

app/services/ml_service.py — ML orchestration

app/services/shap_service.py — SHAP explainers

cardiolens_ml/ — ML teammate's package

scripts/ — verification + test scripts

API Contract (FROZEN)
Request: raw patient dict (53 fields, spaces in names)
Response:

json
{
  "overall_cad": 0.9987,
  "lad": 0.9637,
  "lcx": 0.8233,
  "rca": 0.9204,
  "explanations": {
    "overall_cad": [{"feature": "FH", "value": 1, "shap_value": 1.12}, ...],
    "lad": [...],
    "lcx": [...],
    "rca": [...]
  }
}
Safety
Decision-support prototype. Not a diagnosis.
3D heart is a reference model, not the patient's scan.