import json
import sys
from pathlib import Path

# Allow importing app.* from scripts/
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.raw_to_59 import raw_to_59

BASE = Path(__file__).resolve().parents[1]
RAW_PATH = BASE / "cardiolens_ml" / "data" / "sample_raw_patient.json"
EXPECTED_PATH = BASE / "cardiolens_ml" / "data" / "sample_59_features.json"

raw = json.load(open(RAW_PATH))["raw_patient_input"]
expected = json.load(open(EXPECTED_PATH))["features"]

actual_df = raw_to_59(raw).iloc[0]

mismatches = 0
for k, v_expected in expected.items():
    v_actual = float(actual_df[k])
    if abs(v_actual - v_expected) > 1e-6:
        print(f"MISMATCH: {k}: expected {v_expected}, got {v_actual}")
        mismatches += 1

if mismatches == 0:
    print("✅ All 59 features match. Preprocessing is correct.")
else:
    print(f"❌ {mismatches} mismatches found.")
    sys.exit(1)