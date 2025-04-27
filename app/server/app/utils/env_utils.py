import os
from typing import Any
from dotenv import load_dotenv

load_dotenv()

def get_required_env_var(name: str, default: Any = None) -> str:
    value = os.getenv(name, default)
    if value is None:
        raise EnvironmentError(f"{name} environment variable is required")
    return str(value)

def get_delete_token() -> str:
    return get_required_env_var("VITE_DELETE_TOKEN") 