from pathlib import Path

from config import RAW_DATA_DIR
from utils import logger


def main() -> None:
    logger.info("Starting CPCB data collection...")
    logger.info(f"Raw data will be stored in: {RAW_DATA_DIR}")
    logger.info("Collector initialized successfully.")


if __name__ == "__main__":
    main()