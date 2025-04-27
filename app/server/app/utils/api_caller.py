import requests
from app.utils.env_utils import get_required_env_var

CUSTOM_API_URL = get_required_env_var("CUSTOM_API_BASE_URL") + get_required_env_var("CUSTOM_API_ROUTE")

def call_custom_api(prompt: str, max_tokens: int):
    url = CUSTOM_API_URL
    data = {
        "prompt": prompt,
        "max_tokens": max_tokens
    }
    try:
        response = requests.post(url, json=data)
        final_response = response.json()
        return final_response
    except Exception as e:
        raise Exception(f"Error calling custom API: {e}")
