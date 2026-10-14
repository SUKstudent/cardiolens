import joblib
import pandas as pd
from pathlib import Path

BUNDLE_PATH = (
    Path(__file__).resolve().parents[2]
    / "cardiolens_ml"
    / "preprocessing"
    / "preprocessing_bundle.joblib"
)

BUNDLE = joblib.load(BUNDLE_PATH)

SEX_MAP = BUNDLE["sex_mapping"]
BINARY_YN = BUNDLE["binary_yn"]
CONTINUOUS = BUNDLE["continuous_features"]
FEATURE_ORDER = BUNDLE["feature_order"]
SCALER = BUNDLE["scaler"]

BBB_MAP = {"LBBB": "BBB_LBBB", "N": "BBB_N", "RBBB": "BBB_RBBB"}
VHD_MAP = {
    "Moderate": "VHD_Moderate",
    "N": "VHD_N",
    "Severe": "VHD_Severe",
    "mild": "VHD_mild",
}


def _to_binary(val):
    """Accept 'Y'/'N' or 0/1."""
    if isinstance(val, str):
        v = val.strip().upper()
        if v == "Y":
            return 1.0
        if v == "N":
            return 0.0
    return float(val)


def raw_to_59(raw: dict) -> pd.DataFrame:
    """
    Transform a raw patient dict into the exact 59-feature DataFrame
    expected by the four ML models.
    """
    df = pd.DataFrame([raw])

    # 1. Sex
    df["Sex"] = df["Sex"].map(SEX_MAP).astype(float)

    # 2. Binary Y/N
    for col in BINARY_YN:
        if col in df.columns:
            df[col] = df[col].apply(_to_binary).astype(float)

    # 3. One-hot BBB
    bbb_val = str(df["BBB"].iloc[0]).strip()
    for col in BBB_MAP.values():
        df[col] = 0.0
    df[BBB_MAP[bbb_val]] = 1.0

    # 4. One-hot VHD
    vhd_val = str(df["VHD"].iloc[0]).strip()
    for col in VHD_MAP.values():
        df[col] = 0.0
    df[VHD_MAP[vhd_val]] = 1.0

    # 5. Drop raw BBB and VHD columns
    df = df.drop(columns=["BBB", "VHD"])

    # 6. Scale continuous
    df[CONTINUOUS] = SCALER.transform(df[CONTINUOUS])

    # 7. Reorder to exact feature order
    df = df.reindex(columns=FEATURE_ORDER)

    return df