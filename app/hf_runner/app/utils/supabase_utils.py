import jwt
import os
import requests
from .env_utils import get_required_env_var

def get_supabase_config():
    return {
        "url": get_required_env_var("VITE_SUPABASE_URL"),
        "service_role_key": get_required_env_var("VITE_SUPABASE_SERVICE_ROLE_KEY"),
        "jwt_secret": get_required_env_var("VITE_SUPABASE_JWT_SECRET")
    }

def get_user_data_from_token(token: str):
    config = get_supabase_config()
    headers = {
        "Authorization": f"Bearer {config['service_role_key']}",
        "apikey": config['jwt_secret'],
    }

    try:
        payload = jwt.decode(
            token,
            key=config['jwt_secret'],
            algorithms=["HS256"],
            options={"verify_signature": True}
        )
        user_id = payload.get("sub")
    except Exception as e:
        raise ValueError(f"Invalid token: {e}")

    response = requests.get(
        f"{config['url']}/rest/v1/user_profiles?user_id=eq.{user_id}",
        headers={**headers, "Accept": "application/json"},
    )

    if response.status_code != 200 or not response.json():
        raise PermissionError("User not found or unauthorized.")

    user_info = response.json()[0]
    return {
        "user_id": user_id,
        "tier": user_info.get("subscription_tier", "Free"),
        "form_usage_count": user_info.get("form_usage_count", 0),
        "tokens_remaining": user_info.get("tokens_remaining", 2048)
    }

def can_use_model(tier: str, model: str) -> bool:
    tier_access = {
        "Free": ["gpt-4o-mini"],
        "Standard": ["gpt-4o-mini", "gpt-4o", "deepseek-chat"],
        "Premium": ["gpt-4o-mini", "gpt-4o", "deepseek-chat", "claude-3.7", "claude-3.5"],
    }
    return model in tier_access.get(tier, [])

def is_form_upload_allowed(tier: str, form_usage_count: int) -> bool:
    return form_usage_count < 5 if tier == "Free" else True

MODEL_OUTPUT_TOKENS = {
    "gpt-4o-mini": 512,
    "gpt-4o": 1024,
    "deepseek-chat": 800,
    "claude-3.5": 1024,
    "claude-3.7": 2048,
}