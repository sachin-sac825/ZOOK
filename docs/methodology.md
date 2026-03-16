# Methodology

This document outlines the high-level methodology used in the Smart Traffic AI project.

## 1. Data Collection

- Use traffic camera video feeds or recorded datasets.
- Extract frames and perform object detection to generate traffic counts and classifications.

## 2. Vision Pipeline

- Use a YOLOv8 (or similar) model to detect vehicles, pedestrians, and buses.
- Filter, track, and count detected objects to derive traffic state.

## 3. Traffic Control

- Use detected traffic state to compute signal timing plans.
- Optimize signal timing for delay, throughput, and emission metrics.

## 4. Simulation

- Simulate intersection behavior under different control strategies.
- Estimate emissions and analyze performance.

## 5. Dashboard

- Visualize traffic state, signal plans, and emission estimates.
- Provide interactive controls for scenario exploration.
