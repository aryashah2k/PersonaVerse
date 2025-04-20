import os
from dotenv import load_dotenv
from typing import Any

load_dotenv()

def get_required_env_var(name: str, default: Any = None) -> str:
    value = os.getenv(name, default)
    if value is None:
        raise EnvironmentError(f"{name} environment variable is required")
    return str(value) 