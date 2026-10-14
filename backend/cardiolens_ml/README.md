
# CardioLens ML Package v1.0

AI-powered cardiovascular risk prediction models.

## Models

1. cad_model.joblib
   - Overall CAD prediction
   - Logistic Regression

2. lad_model.joblib
   - LAD stenosis prediction
   - Logistic Regression

3. lcx_rf_model.joblib
   - LCX stenosis prediction
   - Random Forest

4. rca_model.joblib
   - RCA stenosis prediction
   - Logistic Regression

## Preprocessing

preprocessing/preprocessing_bundle.joblib

Contains:
- StandardScaler
- Continuous feature list
- Exact 59-feature order
- Encoding metadata

## Backend

metadata/backend_loader.py

The loader provides:

predict_cardiolens(input_data)

Output:

{
    "overall_cad": 0.72,
    "lad": 0.80,
    "lcx": 0.45,
    "rca": 0.15
}

## Metadata

metadata/model_metadata.json

Contains:
- Dataset information
- Selected models
- Evaluation metrics
- Environment versions
- Important project notes

## Validation

metadata/test_loader.py

Loader validation has passed successfully.

## Important

- Cath, LAD, LCX and RCA are NOT model input features.
- Probabilities are model outputs, not actual blockage percentages.
- 3D visualization represents vessel-level prediction on reference anatomy.
- SHAP contribution does not mean causation.
- This is an educational/decision-support prototype, not a clinical diagnosis.
