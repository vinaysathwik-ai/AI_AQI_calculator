import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

INPUT = PROJECT_ROOT / "datasets" / "processed" / "cpcb_processed.parquet"
OUTPUT = PROJECT_ROOT / "datasets" / "processed" / "cpcb_cleaned.parquet"

df = pd.read_parquet(INPUT)

df = df.drop_duplicates()

pollutants = [
    "PM2.5",
    "PM10",
    "NO2",
    "SO2",
    "CO",
    "OZONE",
    "NH3"
]

for col in pollutants:
    if col in df.columns:
        df[col] = df[col].fillna(0)
        df = df[df[col] >= 0]

df = df[(df["latitude"] >= -90) & (df["latitude"] <= 90)]
df = df[(df["longitude"] >= -180) & (df["longitude"] <= 180)]

df.to_parquet(OUTPUT, index=False)

print(df.head())
print("Saved:", OUTPUT)