from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

# ─── Model paths ─────────────────────────────────────────────────────────────
# Resolve models relative to this file so the API works regardless of cwd.
_HERE = Path(__file__).parent
_MODEL_DIR = _HERE.parent / "models"

_model = None
_imputer = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models once at startup; release at shutdown."""
    global _model, _imputer
    model_path = _MODEL_DIR / "aqi_model.pkl"
    imputer_path = _MODEL_DIR / "imputer.pkl"

    if not model_path.exists() or not imputer_path.exists():
        raise RuntimeError(
            f"Model artifacts not found in {_MODEL_DIR}. "
            "Run scripts/model/train_model.py first."
        )

    _model = joblib.load(model_path)
    _imputer = joblib.load(imputer_path)
    yield
    # Nothing to release, but could add cleanup here


app = FastAPI(title="SmartAQI ML API", lifespan=lifespan)


# ─── Request schema ───────────────────────────────────────────────────────────
class AQIInput(BaseModel):
    PM25: float
    PM10: float
    NO: float
    NO2: float
    NOx: float
    NH3: float
    CO: float
    SO2: float
    O3: float
    Benzene: float
    Toluene: float
    Xylene: float


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _aqi_category(aqi: float) -> str:
    """Return the CPCB AQI bucket for a predicted AQI value."""
    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Satisfactory"
    elif aqi <= 200:
        return "Moderate"
    elif aqi <= 300:
        return "Poor"
    elif aqi <= 400:
        return "Very Poor"
    else:
        return "Severe"


# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/")
def home():
    return {"status": "SmartAQI API Running"}


@app.post("/predict")
def predict(data: AQIInput):
    if _model is None or _imputer is None:
        raise HTTPException(status_code=503, detail="Models not loaded")

    values = np.array([[
        data.PM25, data.PM10,
        data.NO, data.NO2, data.NOx,
        data.NH3, data.CO, data.SO2,
        data.O3, data.Benzene, data.Toluene, data.Xylene,
    ]])

    values = _imputer.transform(values)
    prediction = round(float(_model.predict(values)[0]), 2)
    category = _aqi_category(prediction)

    return {
        "predictedAQI": prediction,
        "category": category,
    }