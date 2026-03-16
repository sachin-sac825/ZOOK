# Smart Traffic AI

An end-to-end prototype for smart city traffic management using computer vision, simulation, and dashboard visualization.

## Project Structure

- `data/` — input videos and sample images for testing
- `models/` — trained models (YOLOv8) for vehicle detection
- `backend/` — traffic control logic, signal optimization, emergency detection, CO₂ estimation
- `vision/` — computer vision models for vehicles, pedestrians, and bus priority
- `dashboard/` — web dashboard to visualize traffic state and emissions
- `simulation/` — intersection and traffic flow simulation tools
- `utils/` — shared configuration and utility helpers
- `docs/` — architecture diagrams and methodology documentation

## Getting Started

1. Create a Python virtual environment:

```bash
python -m venv .venv
```

2. Activate the environment:

- Windows (PowerShell): `.
venv\Scripts\Activate.ps1`
- Windows (cmd): `.
venv\Scripts\activate.bat`

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the dashboard:

```bash
python dashboard/app.py
```

## Notes

- The `models/yolov8_model.pt` file is a placeholder. Replace with a trained YOLOv8 model for accurate object detection.
- Sample data is provided in `data/sample_images/` for quick experimentation.
