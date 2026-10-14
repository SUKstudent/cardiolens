
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models"
PREPROCESSING_FILE = BASE_DIR / "preprocessing" / "preprocessing_bundle.joblib"

# Load models
cad_model = joblib.load(MODEL_DIR / "cad_model.joblib")
lad_model = joblib.load(MODEL_DIR / "lad_model.joblib")
lcx_model = joblib.load(MODEL_DIR / "lcx_rf_model.joblib")
rca_model = joblib.load(MODEL_DIR / "rca_model.joblib")

# Load preprocessing information
preprocessing = joblib.load(PREPROCESSING_FILE)

scaler = preprocessing["scaler"]
continuous_features = preprocessing["continuous_features"]
feature_order = preprocessing["feature_order"]


def prepare_features(input_data):
    """
    Convert incoming patient data into the exact
    feature order expected by the trained models.
    """

    import pandas as pd

    df = pd.DataFrame([input_data])

    # Scale continuous features
    df[continuous_features] = scaler.transform(
        df[continuous_features]
    )

    # Ensure exact training feature order
    df = df.reindex(columns=feature_order)

    return df


def predict_cardiolens(input_data):
    """
    Return CAD, LAD, LCX and RCA probabilities.
    """

    X = prepare_features(input_data)

    return {
        "overall_cad": float(
            cad_model.predict_proba(X)[0][1]
        ),
        "lad": float(
            lad_model.predict_proba(X)[0][1]
        ),
        "lcx": float(
            lcx_model.predict_proba(X)[0][1]
        ),
        "rca": float(
            rca_model.predict_proba(X)[0][1]
        )
    }
