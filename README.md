# CardioLens
### ML-Powered Cardiac Intelligence
**Your Heart Through a Smarter Lens**

CardioLens is a cardiac intelligence project that brings together machine learning, cardiac data analysis, and interactive 3D heart visualization. It aims to make cardiac information easier to explore and understand through a clear interface and data-driven insights.

> **Project status:** Completed. This project is for educational and research purposes and is not a substitute for professional medical advice, diagnosis, or treatment.

## Overview

CardioLens explores how machine learning and interactive visualization can support the understanding of cardiac data. The project includes two machine learning models for comparison and a 3D heart visualization experience.

## Key Features

- **Machine Learning:** Logistic Regression and Random Forest models for cardiac data analysis.
- **Model Evaluation:** Comparison using accuracy, precision, recall, F1-score, and ROC-AUC.
- **Vessel-Specific Analysis:** Focus on the LAD, LCX, and RCA coronary vessels, where supported by the implementation.
- **3D Heart Visualization:** An interactive 3D heart model for exploring cardiac anatomy.
- **Guided 3D Anatomy Tour:** A structured anatomy exploration experience, where implemented.
- **Explainability:** SHAP-based feature importance where available.
- **User Interface:** Sections for Welcome, Doctor Mode, Patient Data, Compare Patients, Report, and About, according to the current frontend implementation.

## Machine Learning Evaluation

The following are the reported evaluation results for the project models:

| Metric | Logistic Regression | Random Forest |
|---|---:|---:|
| Accuracy | 85.25% | 81.97% |
| Precision | 86.96% | 80.77% |
| Recall | 93.02% | 97.67% |
| F1-Score | 89.89% | 88.42% |
| ROC-AUC | 88.89% | 87.08% |

### Brief interpretation

- Logistic Regression achieved higher accuracy, precision, F1-score, and ROC-AUC in the reported evaluation.
- Random Forest achieved higher recall in the reported evaluation.

These metrics reflect the project's reported evaluation and should be interpreted in the context of the dataset, split strategy, preprocessing, and evaluation methodology used. They do not establish clinical validity.

## Technology Stack

The project references the following technologies; exact usage may vary by component:

- **Machine Learning:** Python, scikit-learn
- **Explainable AI:** SHAP
- **Frontend:** React
- **Backend/API:** FastAPI
- **3D Visualization:** Three.js

## Project Structure

The exact repository layout may differ. A possible organization is:

CardioLens/

├── frontend/          # User interface

├── backend/           # API and application logic

  ├── ml/                # Model training and evaluation

└── README.md

Only retain folders that exist in your actual repository.

## Getting Started

Setup commands depend on the current repository structure and the dependencies used by each component. Check the relevant folder for its dependency file and run instructions.

### Frontend
If the frontend is a React project:
1. Open a terminal in the frontend directory.
2. Install dependencies using the package manager and lockfile used by the project.
3. Start the development server using the script defined in `package.json`.

### Backend
If the backend uses FastAPI:
1. Open a terminal in the backend directory.
2. Set up the project's Python environment.
3. Install dependencies from the project's requirements or dependency file.
4. Start the FastAPI application using the module and command specified by the project.

### Machine Learning
Use the training/evaluation scripts and data-preparation steps included in the repository. Confirm dataset access, preprocessing, and model files before running inference.

### 3D Visualization
Follow the setup instructions and dependency files in the visualization or frontend directory where the 3D model is implemented.

> Exact commands are intentionally not specified here because the repository's filenames, entry points, and dependency files have not bee
