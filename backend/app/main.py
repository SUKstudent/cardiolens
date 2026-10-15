from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import health, predict

app = FastAPI(
    title="CardioLens API",
    version="0.1.0",
    description="Backend for CardioLens — predictions are decision-support only, not a diagnosis.",
)

# CORS — allow the frontend dev server to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # CRA / generic
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://cardiolens-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/", tags=["Root"])
def root():
    return {
        "service": "CardioLens API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
        "predict": "POST /predict",
        "disclaimer": "Decision-support prototype. Not a medical diagnosis.",
    }
app.include_router(health.router, tags=["Health"])
app.include_router(predict.router, tags=["Prediction"])
