from pydantic import BaseModel, ConfigDict, Field


class PatientInput(BaseModel):
    """
    Raw patient input — matches the raw dataset columns used by the ML pipeline.
    Target columns (Cath, LAD, LCX, RCA) and Exertional CP are NOT included
    to prevent target leakage.
    """
    model_config = ConfigDict(extra="forbid")

    Age: int = Field(..., ge=0, le=120)
    Weight: float = Field(..., gt=0, le=300)
    Length: float = Field(..., gt=0, le=250)
    Sex: str = Field(..., pattern="^(Female|Male)$")
    BMI: float = Field(..., gt=0, le=100)
    DM: int = Field(..., ge=0, le=1)
    HTN: int = Field(..., ge=0, le=1)
    Current_Smoker: int = Field(..., ge=0, le=1, alias="Current Smoker")
    EX_Smoker: int = Field(..., ge=0, le=1, alias="EX-Smoker")
    FH: int = Field(..., ge=0, le=1)
    Obesity: str = Field(..., pattern="^(Y|N)$")
    CRF: str = Field(..., pattern="^(Y|N)$")
    CVA: str = Field(..., pattern="^(Y|N)$")
    Airway_disease: str = Field(..., pattern="^(Y|N)$", alias="Airway disease")
    Thyroid_Disease: str = Field(..., pattern="^(Y|N)$", alias="Thyroid Disease")
    CHF: str = Field(..., pattern="^(Y|N)$")
    DLP: str = Field(..., pattern="^(Y|N)$")
    BP: float = Field(..., gt=0, le=300)
    PR: float = Field(..., gt=0, le=300)
    Edema: int = Field(..., ge=0, le=1)
    Weak_Peripheral_Pulse: str = Field(..., pattern="^(Y|N)$", alias="Weak Peripheral Pulse")
    Lung_rales: str = Field(..., pattern="^(Y|N)$", alias="Lung rales")
    Systolic_Murmur: str = Field(..., pattern="^(Y|N)$", alias="Systolic Murmur")
    Diastolic_Murmur: str = Field(..., pattern="^(Y|N)$", alias="Diastolic Murmur")
    Typical_Chest_Pain: int = Field(..., ge=0, le=1, alias="Typical Chest Pain")
    Dyspnea: str = Field(..., pattern="^(Y|N)$")
    Function_Class: int = Field(..., ge=0, le=4, alias="Function Class")
    Atypical: str = Field(..., pattern="^(Y|N)$")
    Nonanginal: str = Field(..., pattern="^(Y|N)$")
    LowTH_Ang: str = Field(..., pattern="^(Y|N)$", alias="LowTH Ang")
    Q_Wave: int = Field(..., ge=0, le=1, alias="Q Wave")
    St_Elevation: int = Field(..., ge=0, le=1, alias="St Elevation")
    St_Depression: int = Field(..., ge=0, le=1, alias="St Depression")
    Tinversion: int = Field(..., ge=0, le=1)
    LVH: str = Field(..., pattern="^(Y|N)$")
    Poor_R_Progression: str = Field(..., pattern="^(Y|N)$", alias="Poor R Progression")
    BBB: str = Field(..., pattern="^(LBBB|N|RBBB)$")
    FBS: float = Field(..., gt=0)
    CR: float = Field(..., gt=0)
    TG: float = Field(..., gt=0)
    LDL: float = Field(..., gt=0)
    HDL: float = Field(..., gt=0)
    BUN: float = Field(..., gt=0)
    ESR: float = Field(..., gt=0)
    HB: float = Field(..., gt=0)
    K: float = Field(..., gt=0)
    Na: float = Field(..., gt=0)
    WBC: float = Field(..., gt=0)
    Lymph: float = Field(..., gt=0)
    Neut: float = Field(..., gt=0)
    PLT: float = Field(..., gt=0)
    EF_TTE: float = Field(..., gt=0, le=100, alias="EF-TTE")
    Region_RWMA: int = Field(..., ge=0, le=10, alias="Region RWMA")
    VHD: str = Field(..., pattern="^(Moderate|N|Severe|mild)$")

from typing import Union

class ShapItem(BaseModel):
    feature: str
    value: Union[float, int, str]
    shap_value: float


class Explanations(BaseModel):
    overall_cad: list[ShapItem] = []
    lad: list[ShapItem] = []
    lcx: list[ShapItem] = []
    rca: list[ShapItem] = []


class PredictionResponse(BaseModel):
    overall_cad: float
    lad: float
    lcx: float
    rca: float
    explanations: Explanations