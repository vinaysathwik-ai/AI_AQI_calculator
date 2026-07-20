import os
from datetime import datetime

import pandas as pd
import requests

from dotenv import load_dotenv

load_dotenv()

# -----------------------------
# CONFIGURATION
# -----------------------------

API_KEY = os.getenv("CPCB_API_KEY")

RESOURCE_ID = os.getenv("CPCB_RESOURCE_ID")

if not API_KEY:
    raise ValueError("CPCB_API_KEY not found in .env")

if not RESOURCE_ID:
    raise ValueError("CPCB_RESOURCE_ID not found in .env")

BASE_URL = "https://api.data.gov.in/resource/"

OUTPUT_DIR = "datasets/raw/cpcb"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def download_data():
    url = (
        f"{BASE_URL}{RESOURCE_ID}"
        f"?api-key={API_KEY}"
        f"&format=json"
        f"&limit=100"
    )

    print("Downloading CPCB data...")
    print(url)

    response = requests.get(url, timeout=60)

    response.raise_for_status()

    data = response.json()

    records = data.get("records", [])

    if not records:
        raise Exception("No records returned.")

    df = pd.DataFrame(records)

    filename = datetime.now().strftime("%Y%m%d_%H%M%S.csv")

    path = os.path.join(OUTPUT_DIR, filename)

    df.to_csv(path, index=False)

    print(f"Saved {len(df)} records.")

    print(path)


if __name__ == "__main__":
    download_data()