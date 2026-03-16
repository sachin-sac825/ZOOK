"""Generate synthetic traffic demand patterns for simulation and testing."""

from typing import Dict, Any


def generate_traffic_profile(duration_minutes: int, peak_volume: int) -> Dict[str, Any]:
    """Generate a simple traffic volume curve."""
    # TODO: replace with more realistic stochastic traffic model
    return {
        "duration_minutes": duration_minutes,
        "peak_volume": peak_volume,
        "profile": [peak_volume * (i / duration_minutes) for i in range(duration_minutes)],
    }


if __name__ == "__main__":
    print(generate_traffic_profile(60, 100))
