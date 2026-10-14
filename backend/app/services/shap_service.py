import joblib
import pandas as pd
import shap
from pathlib import Path

BASE = Path(__file__).resolve().parents[2] / "cardiolens_ml"

_cad = joblib.load(BASE / "models" / "cad_model.joblib")
_lad = joblib.load(BASE / "models" / "lad_model.joblib")
_lcx = joblib.load(BASE / "models" / "lcx_rf_model.joblib")
_rca = joblib.load(BASE / "models" / "rca_model.joblib")

_bg = pd.read_csv(BASE / "data" / "shap_background_50.csv")

_explainers = {
    "overall_cad": shap.LinearExplainer(_cad, _bg),
    "lad": shap.LinearExplainer(_lad, _bg),
    "lcx": shap.TreeExplainer(_lcx, _bg),
    "rca": shap.LinearExplainer(_rca, _bg),
}


def _lookup_raw(feature_name: str, raw_patient: dict):
    """Map a 59-feature column back to its raw patient value."""
    if raw_patient is None:
        return None
    if feature_name in raw_patient:
        return raw_patient[feature_name]
    # One-hot derived features
    if feature_name.startswith("BBB_"):
        return raw_patient.get("BBB", "N/A")
    if feature_name.startswith("VHD_"):
        return raw_patient.get("VHD", "N/A")
    return None


def explain(
    model_name: str,
    X: pd.DataFrame,
    raw_patient: dict = None,
    top_n: int = 5,
) -> list:
    """
    Return top-N features by absolute SHAP contribution.
    Uses RAW patient values (not scaled) for the `value` field
    so the doctor sees meaningful numbers.
    """
    explainer = _explainers[model_name]
    sv = explainer.shap_values(X)

    if isinstance(sv, list):
        sv = sv[1] if len(sv) > 1 else sv[0]
    if sv.ndim == 3:
        sv = sv[:, :, 1]

    row = sv[0]
    feature_names = list(X.columns)
    scaled_values = X.iloc[0].tolist()

    pairs = []
    for i, feature in enumerate(feature_names):
        raw_val = _lookup_raw(feature, raw_patient)
        # Fallback to scaled value only if raw not found
        value = raw_val if raw_val is not None else float(scaled_values[i])
        pairs.append({
            "feature": feature,
            "value": value,
            "shap_value": float(row[i]),
        })

    pairs.sort(key=lambda p: abs(p["shap_value"]), reverse=True)
    return pairs[:top_n]