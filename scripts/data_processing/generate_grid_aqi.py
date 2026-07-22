"""
Generate All-India AQI grid from GeoTIFF satellite data and ML model.
"""
import os
import json
import numpy as np
import rasterio
import joblib
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = PROJECT_ROOT / "models/aqi_model.pkl"
IMPUTER_PATH = PROJECT_ROOT / "models/imputer.pkl"
OUTPUT_PATH_DATASETS = PROJECT_ROOT / "datasets/processed/grid_aqi.json"
OUTPUT_PATH_ML = PROJECT_ROOT / "ml/grid_aqi.json"

TIF_FILES = {
    "CO": PROJECT_ROOT / "India_CO_Jan2024.tif",
    "NO2": PROJECT_ROOT / "India_NO2_Jan2024.tif",
    "O3": PROJECT_ROOT / "India_O3_Jan2024.tif",
    "SO2": PROJECT_ROOT / "India_SO2_Jan2024.tif",
    "HCHO": PROJECT_ROOT / "India_HCHO_Jan2024.tif",
}

def get_aqi_category(aqi: float) -> str:
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

def scale_satellite_to_ground(gas: str, val: float) -> float:
    """
    Scale Sentinel-5P column density (mol/m²) to ground concentration range
    expected by the CPCB trained AQI model.
    """
    if val is None or np.isnan(val) or val <= 0:
        return np.nan

    if gas == "CO":
        # Sentinel-5P CO ~ 0.01 to 0.07 mol/m² -> Ground ~ 0.5 - 4.0 mg/m³
        # Model median is 25.0 in raw dataset or ~0.8-2.5 mg/m³
        scaled = val * 50.0
        return max(0.1, min(10.0, scaled))
    elif gas == "NO2":
        # Sentinel-5P NO2 ~ 1e-5 to 5e-4 mol/m² -> Ground ~ 10 - 150 µg/m³
        scaled = val * 600000.0
        return max(1.0, min(300.0, scaled))
    elif gas == "SO2":
        # Sentinel-5P SO2 ~ 1e-4 to 7e-3 mol/m² -> Ground ~ 5 - 100 µg/m³
        scaled = val * 20000.0
        return max(1.0, min(200.0, scaled))
    elif gas == "O3":
        # Sentinel-5P O3 ~ 0.10 to 0.15 mol/m² -> Ground ~ 15 - 90 µg/m³
        scaled = (val - 0.10) * 1200.0 + 15.0
        return max(5.0, min(200.0, scaled))
    elif gas == "HCHO":
        return val
    return np.nan

def generate_grid_aqi():
    print("Loading ML model and imputer...")
    if not MODEL_PATH.exists() or not IMPUTER_PATH.exists():
        raise FileNotFoundError("Model or Imputer not found! Run train_model.py first.")
    
    model = joblib.load(MODEL_PATH)
    imputer = joblib.load(IMPUTER_PATH)

    # Open all tif handles
    tif_handles = {}
    for gas, path in TIF_FILES.items():
        if path.exists():
            tif_handles[gas] = rasterio.open(path)
            print(f"Opened {gas} dataset from {path.name}")
        else:
            print(f"Warning: {path.name} not found!")

    # Define India bounding box grid
    lat_min, lat_max = 8.0, 37.0
    lon_min, lon_max = 68.5, 97.0
    step = 0.35  # ~38km resolution (~5,000 grid points)

    lats = np.arange(lat_min, lat_max, step)
    lons = np.arange(lon_min, lon_max, step)

    grid_data = []

    print(f"Sampling grid across India (Lat: {lat_min}°-{lat_max}°, Lon: {lon_min}°-{lon_max}°, Step: {step}°)...")

    for lat in lats:
        for lon in lons:
            point = [(lon, lat)]  # rasterio expects (lon, lat) tuple
            
            sampled_raw = {}
            for gas, handle in tif_handles.items():
                try:
                    vals = list(handle.sample(point))
                    val = float(vals[0][0])
                    nodata = handle.nodata
                    if (nodata is not None and val == nodata) or np.isnan(val):
                        sampled_raw[gas] = np.nan
                    else:
                        sampled_raw[gas] = val
                except Exception:
                    sampled_raw[gas] = np.nan

            # Check if we have at least one valid pollutant reading
            valid_gases = [v for v in sampled_raw.values() if not np.isnan(v)]
            if not valid_gases:
                continue  # Skip points with no valid satellite data (e.g. ocean / outside swath)

            co_scaled = scale_satellite_to_ground("CO", sampled_raw.get("CO"))
            no2_scaled = scale_satellite_to_ground("NO2", sampled_raw.get("NO2"))
            so2_scaled = scale_satellite_to_ground("SO2", sampled_raw.get("SO2"))
            o3_scaled = scale_satellite_to_ground("O3", sampled_raw.get("O3"))

            # Features: ['PM25', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene']
            raw_input = np.array([[
                np.nan,     # PM25
                np.nan,     # PM10
                np.nan,     # NO
                no2_scaled, # NO2
                np.nan,     # NOx
                np.nan,     # NH3
                co_scaled,  # CO
                so2_scaled, # SO2
                o3_scaled,  # O3
                np.nan,     # Benzene
                np.nan,     # Toluene
                np.nan      # Xylene
            ]])

            imputed_input = imputer.transform(raw_input)
            predicted_aqi = float(model.predict(imputed_input)[0])
            predicted_aqi = max(10.0, round(predicted_aqi, 1))
            category = get_aqi_category(predicted_aqi)

            grid_data.append({
                "lat": round(float(lat), 3),
                "lon": round(float(lon), 3),
                "aqi": predicted_aqi,
                "category": category,
                "co": None if np.isnan(co_scaled) else round(float(co_scaled), 2),
                "no2": None if np.isnan(no2_scaled) else round(float(no2_scaled), 2),
                "o3": None if np.isnan(o3_scaled) else round(float(o3_scaled), 2),
                "so2": None if np.isnan(so2_scaled) else round(float(so2_scaled), 2)
            })

    # Close tif handles
    for handle in tif_handles.values():
        handle.close()

    print(f"\nGenerated {len(grid_data)} valid grid points for India.")

    OUTPUT_PATH_DATASETS.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH_ML.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_PATH_DATASETS, "w") as f:
        json.dump(grid_data, f, indent=2)

    with open(OUTPUT_PATH_ML, "w") as f:
        json.dump(grid_data, f, indent=2)

    print(f"Saved precomputed grid JSON to {OUTPUT_PATH_DATASETS} and {OUTPUT_PATH_ML}")

if __name__ == "__main__":
    generate_grid_aqi()
