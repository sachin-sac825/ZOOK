"""Vehicle detection module using YOLOv8 or similar object detection models."""

from typing import List, Dict, Any


def load_model(model_path: str):
    """Load a YOLOv8 model from disk."""
    try:
        from ultralytics import YOLO
    except ImportError:
        raise ImportError("ultralytics is required for vehicle detection. Install via pip install ultralytics")

    return YOLO(model_path)


def detect_vehicles(frame: Any, model: Any) -> List[Dict[str, Any]]:
    """Detect vehicles in a frame and return bounding boxes + class info."""
    preds = model(frame)
    detections = []
    for det in preds.xyxy[0].tolist():
        x1, y1, x2, y2, conf, cls = det
        detections.append({
            "bbox": [x1, y1, x2, y2],
            "confidence": float(conf),
            "class_id": int(cls),
        })
    return detections


if __name__ == "__main__":
    print("This module provides vehicle detection utilities.")
