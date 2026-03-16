"""Common helper functions used across the project."""

from typing import Any, Dict


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def safe_get(d: Dict[str, Any], key: str, default: Any = None) -> Any:
    return d.get(key, default)
