import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.ml_service import predict_cardiolens

BASE = Path(__file__).resolve().parents[1]
RAW_PATH = BASE / "cardiolens_ml" / "data" / "sample_raw_patient.json"

raw = json.load(open(RAW_PATH))["raw_patient_input"]
result = predict_cardiolens(raw)

print(json.dumps(result, indent=2))