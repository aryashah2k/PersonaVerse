import os
from typing import Any

def get_required_env_var(name: str, default: Any = None) -> str:
    value = os.getenv(name, default)
    if value is None:
        raise EnvironmentError(f"{name} environment variable is required")
    return str(value) 