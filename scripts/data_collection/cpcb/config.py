"""
Configuration for CPCB Data Collector
"""

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[3]

RAW_DATA_DIR = PROJECT_ROOT / "datasets" / "raw" / "cpcb"

RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)

REQUEST_TIMEOUT = 30