
import sys
from pathlib import Path

METADATA_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(METADATA_DIR))

from backend_loader import predict_cardiolens

print("Backend loader imported successfully!")
print("CAD model loaded:", type(__import__("backend_loader").cad_model).__name__)
print("LAD model loaded:", type(__import__("backend_loader").lad_model).__name__)
print("LCX model loaded:", type(__import__("backend_loader").lcx_model).__name__)
print("RCA model loaded:", type(__import__("backend_loader").rca_model).__name__)
print("Preprocessing bundle loaded successfully!")
print("Feature count:", len(__import__("backend_loader").feature_order))

print("Loader validation PASSED!")
