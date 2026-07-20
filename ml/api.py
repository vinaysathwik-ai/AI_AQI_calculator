from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="SmartAQI ML API")

model = joblib.load("models/aqi_model.pkl")
imputer = joblib.load("models/imputer.pkl")

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

@app.get("/")
def home():
    return {"status": "SmartAQI API Running"}

@app.post("/predict")
def predict(data: AQIInput):
    values = np.array([[
        data.PM25,
        data.PM10,
        data.NO,
        data.NO2,
        data.NOx,
        data.NH3,
        data.CO,
        data.SO2,
        data.O3,
        data.Benzene,
        data.Toluene,
        data.Xylene
    ]])

    values = imputer.transform(values)
    prediction = round(float(model.predict(values)[0]), 2)

    if prediction <= 50:
        category = "Good"
    elif prediction <= 100:
        category = "Satisfactory"
    elif prediction <= 200:
        category = "Moderate"
    elif prediction <= 300:
        category = "Poor"
    elif prediction <= 400:
        category = "Very Poor"
    else:
        category = "Severe"

    return {
        "predictedAQI": prediction,
        "category": category
    }