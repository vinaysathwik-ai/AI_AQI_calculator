"""
FastAPI unit-tests for ml/api.py
Run from the project root:
    pytest ml/test_api.py -v
"""
import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure the project root is on sys.path so `from ml.api import app` resolves.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.api import app, _aqi_category  # noqa: E402

# Use the context-manager form so the lifespan (model loading) fires.
# The module-level `client` is replaced by a pytest fixture below.
@pytest.fixture(scope="module")
def client():
    """Fixture that starts the app lifespan and yields a TestClient."""
    with TestClient(app) as c:
        yield c

# ─── Minimal valid payload ────────────────────────────────────────────────────
GOOD_PAYLOAD = {
    "PM25": 35.0,
    "PM10": 60.0,
    "NO": 10.0,
    "NO2": 15.0,
    "NOx": 20.0,
    "NH3": 5.0,
    "CO": 0.8,
    "SO2": 8.0,
    "O3": 25.0,
    "Benzene": 0.5,
    "Toluene": 0.5,
    "Xylene": 0.2,
}


# ─── Health-check ─────────────────────────────────────────────────────────────
def test_home(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "SmartAQI API Running"}


# ─── Happy-path prediction ────────────────────────────────────────────────────
def test_predict_endpoint(client):
    response = client.post("/predict", json=GOOD_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert "predictedAQI" in data
    assert "category" in data
    assert isinstance(data["predictedAQI"], (float, int))
    assert data["category"] in [
        "Good", "Satisfactory", "Moderate", "Poor", "Very Poor", "Severe"
    ]


# ─── Validation error on incomplete payload ───────────────────────────────────
def test_validation_error_on_missing_fields(client):
    incomplete_payload = {"PM25": 35.0}
    response = client.post("/predict", json=incomplete_payload)
    assert response.status_code == 422


# ─── AQI category boundary tests (pure-function, no model needed) ─────────────
@pytest.mark.parametrize("aqi,expected_category", [
    # Boundary: exactly at the top of each band
    (0.0,   "Good"),
    (50.0,  "Good"),
    (50.01, "Satisfactory"),
    (100.0, "Satisfactory"),
    (100.01,"Moderate"),
    (200.0, "Moderate"),
    (200.01,"Poor"),
    (300.0, "Poor"),
    (300.01,"Very Poor"),
    (400.0, "Very Poor"),
    (400.01,"Severe"),
    (999.0, "Severe"),
    # Mid-range sanity checks
    (25.0,  "Good"),
    (75.0,  "Satisfactory"),
    (150.0, "Moderate"),
    (250.0, "Poor"),
    (350.0, "Very Poor"),
    (500.0, "Severe"),
])
def test_aqi_category_boundaries(aqi, expected_category):
    """Verify the AQI → category mapping at every band boundary."""
    assert _aqi_category(aqi) == expected_category


# ─── Predicted category matches numeric AQI in response ──────────────────────
def test_predict_category_matches_aqi(client):
    """The category returned by /predict must match _aqi_category(predictedAQI)."""
    response = client.post("/predict", json=GOOD_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == _aqi_category(data["predictedAQI"])


# ─── Grid AQI endpoint ────────────────────────────────────────────────────────
def test_grid_aqi_endpoint(client):
    """GET /grid-aqi returns the precomputed grid array."""
    response = client.get("/grid-aqi")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first_item = data[0]
    assert "lat" in first_item
    assert "lon" in first_item
    assert "aqi" in first_item
    assert "category" in first_item

