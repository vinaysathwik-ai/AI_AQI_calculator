import pandas as pd
from pathlib import Path

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[2]

RAW_FILE = PROJECT_ROOT / "datasets" / "raw" / "cpcb" / "cpcb_raw.csv"

OUTPUT_DIR = PROJECT_ROOT / "datasets" / "processed"

OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "cpcb_processed.parquet"


def process_cpcb():
    print("Reading raw dataset...")

    df = pd.read_csv(RAW_FILE)

    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    print("Checking missing values...")
    print(df.isnull().sum())

    print("Removing duplicate rows...")
    df = df.drop_duplicates()

    print("Converting timestamp...")
    df["last_update"] = pd.to_datetime(
        df["last_update"],
        format="%d-%m-%Y %H:%M:%S"
    )

    print("Pivoting pollutants...")

    pivot_df = df.pivot_table(
        index=[
            "country",
            "state",
            "city",
            "station",
            "last_update",
            "latitude",
            "longitude"
        ],
        columns="pollutant_id",
        values="pollutant_avg",
        aggfunc="mean"
    ).reset_index()

    print(pivot_df.head())

    pivot_df.to_parquet(OUTPUT_FILE, index=False)

    print(f"\nSaved to:\n{OUTPUT_FILE}")


if __name__ == "__main__":
    process_cpcb()