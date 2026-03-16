"""Estimate CO2 emissions based on traffic flow and vehicle counts."""

from typing import Dict, Any


EMISSION_FACTORS = {
    "car": 0.192,  # kg CO2 per km (approx)
    "bus": 0.102,
    "truck": 0.27,
}


def estimate_co2(traffic_counts: Dict[str, int], avg_speed_kmh: float) -> float:
    """Estimate CO2 emissions (kg) for a time interval."""
    total_co2 = 0.0
    for vehicle_type, count in traffic_counts.items():
        factor = EMISSION_FACTORS.get(vehicle_type, 0.2)
        total_co2 += count * factor * (avg_speed_kmh / 60)  # per minute estimate
    return total_co2


if __name__ == "__main__":
    example = {"car": 20, "bus": 2, "truck": 4}
    print(estimate_co2(example, avg_speed_kmh=30))
