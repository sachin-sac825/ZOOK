"""Bus priority logic for adapting signals when public transit is approaching."""

from typing import Dict, Any


def is_bus_approaching(detections: Dict[str, Any]) -> bool:
    """Return True if a bus is detected approaching an intersection."""
    # TODO: implement using vision detections or connected vehicle data
    return False


def adjust_signal_for_bus(signal_plan: Dict[str, Any]) -> Dict[str, Any]:
    """Adjust an existing signal plan to prioritize buses."""
    new_plan = signal_plan.copy()
    new_plan["bus_priority"] = True
    return new_plan


if __name__ == "__main__":
    print(adjust_signal_for_bus({}))
