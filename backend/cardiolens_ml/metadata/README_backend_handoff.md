# CardioLens Backend ML Handoff

Generated directly from the CardioLens ML notebook and the original dataset.

## Dataset
- Rows: 303
- Original columns: 59
- Model feature count after preprocessing: 59
- Sample source row index: 149

## Raw -> 59 preprocessing
1. Drop `Exertional CP`.
2. Target columns are removed from model input: `Cath`, `LAD`, `LCX`, `RCA`.
3. Binary Y/N fields are mapped N=0, Y=1.
4. Sex is mapped Female=0, Male=1.
5. `BBB` is one-hot encoded into:
   - BBB_LBBB
   - BBB_N
   - BBB_RBBB
6. `VHD` is one-hot encoded into:
   - VHD_Moderate
   - VHD_N
   - VHD_Severe
   - VHD_mild
7. `Function Class` and `Region RWMA` remain numeric.
8. The 21 continuous features listed in the notebook are standardized with StandardScaler.
9. Columns are reindexed to the exact saved 59-feature order.

## SHAP
The notebook used SHAP 0.52.0.
- CAD: LinearExplainer
- LAD: LinearExplainer
- LCX: TreeExplainer
- RCA: LinearExplainer

`shap_background_50.csv` contains 50 rows from the exact scaled training matrix used for the explainers.

## Important
- `source_targets_verification_only` must not be accepted from frontend input.
- The sample is for preprocessing/integration verification.
- Model probabilities are predictions, not blockage percentages.
