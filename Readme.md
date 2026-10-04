# 🫀 CardioLens

### AI-Powered Cardiovascular Risk Prediction & Interactive 3D Heart Visualization

CardioLens is a web-based prototype that combines **clinical data, explainable machine learning, and interactive 3D heart visualization** to help users understand cardiovascular risk.

## ✨ Features

* 🧠 Overall CAD risk prediction

* ❤️ LAD, LCX & RCA vessel-level predictions

* 🔍 SHAP-based explainability

* 🫀 Interactive 3D heart visualization

* 👨‍⚕️ Doctor Mode & 👤 Patient Mode

* 📊 Clinical risk dashboard

## 🏗️ Architecture

React + Vite

     ↓
  
   FastAPI
     
     ↓

ML Models + SHAP

     ↓

Dashboard + 3D Heart

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Recharts

**Backend:** Python, FastAPI, Pydantic

**ML:** Pandas, NumPy, scikit-learn, SHAP, Joblib

**3D:** Three.js, React Three Fiber

**Collaboration:** Git, GitHub

## 🧠 ML Models

| Prediction  | Model               |

| ----------- | ------------------- |

| Overall CAD | Logistic Regression |

| LAD         | Logistic Regression |

| LCX         | Random Forest       |

| RCA         | Logistic Regression |

## 📁 Project Structure

cardiolens/

├── frontend/

├── backend/

├── ml/

├── 3d/

├── docs/

└── README.md

## ⚠️ Disclaimer

CardioLens is an **educational/hackathon prototype**, not a clinical diagnostic system. Model probabilities are predictive outputs and do not represent actual blockage percentages or patient-specific anatomical locations.

**See the Risk. Understand the Heart.**
