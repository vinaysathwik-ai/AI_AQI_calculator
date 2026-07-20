import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

INPUT = PROJECT_ROOT / "datasets" / "processed" / "cpcb_cleaned.parquet"
OUTPUT = PROJECT_ROOT / "datasets" / "master" / "master_dataset.parquet"

OUTPUT.parent.mkdir(exist_ok=True)

df = pd.read_parquet(INPUT)

df["hour"] = df["last_update"].dt.hour
df["day"] = df["last_update"].dt.day
df["month"] = df["last_update"].dt.month
df["weekday"] = df["last_update"].dt.weekday
df["is_weekend"] = df["weekday"].isin([5, 6]).astype(int)

def season(month):
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Summer"
    elif month in [6, 7, 8, 9]:
        return "Monsoon"
    return "PostMonsoon"

df["season"] = df["month"].apply(season)

df.to_parquet(OUTPUT, index=False)

print(df.head())
print("Saved:", OUTPUT)