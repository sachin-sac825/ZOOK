"""Configuration helpers and constants."""

from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

DEFAULTS = {
    "model_path": str(MODELS_DIR / "yolov8_model.pt"),
    "video_source": str(DATA_DIR / "traffic_videos"),
}


def get_default_config() -> dict:
    return DEFAULTS.copy()
