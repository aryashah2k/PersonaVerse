import jwt
import os
import requests
from .env_utils import get_required_env_var

SUPABASE_PROJECT_ID = get_required_env_var("VITE_SUPABASE_PROJECT_ID")
SUPABASE_JWKS_URL = f"https://{SUPABASE_PROJECT_ID}.supabase.co/auth/v1/keys"
SUPABASE_ISSUER = f"https://{SUPABASE_PROJECT_ID}.supabase.co/auth/v1"
SUPABASE_AUDIENCE = SUPABASE_PROJECT_ID

jwks = requests.get(SUPABASE_JWKS_URL).json()

def get_supabase_config():
    return {
        "url": get_required_env_var("VITE_SUPABASE_URL"),
        "service_role_key": get_required_env_var("VITE_SUPABASE_SERVICE_ROLE_KEY"),
        "jwt_secret": get_required_env_var("VITE_SUPABASE_JWT_SECRET")
    }

def get_user_data_from_token(token: str) -> dict:
    unverified_header = jwt.get_unverified_header(token)
    key = next((k for k in jwks["keys"] if k["kid"] == unverified_header["kid"]), None)
    if not key:
        raise Exception("Public key not found for token")

    payload = jwt.decode(
        token,
        key,
        algorithms=["RS256"],
        audience=SUPABASE_AUDIENCE,
        issuer=SUPABASE_ISSUER
    )

    return {
        "user_id": payload.get("sub"),
        "email": payload.get("email"),
        "tier": payload.get("app_metadata", {}).get("tier", "Free"),
        "tokens_remaining": payload.get("user_metadata", {}).get("tokens_remaining", 2048),
        "form_usage_count": payload.get("user_metadata", {}).get("form_usage_count", 0)
    }

def can_use_model(tier: str, model: str) -> bool:
    tier_access = {
        "Free": ["gpt-4o-mini"],
        "Standard": ["gpt-4o-mini", "gpt-4o", "deepseek-chat"],
        "Premium": ["gpt-4o-mini", "gpt-4o", "deepseek-chat", "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20240620", "gemini-2.0-flash-lite", "gemini-2.0-flash"],
    }
    return model in tier_access.get(tier, [])

def is_form_upload_allowed(tier: str, form_usage_count: int) -> bool:
    return form_usage_count < 5 if tier == "Free" else True

MODEL_OUTPUT_TOKENS = {
    "gpt-4o-mini": 512,
    "gpt-4o": 1024,
    "deepseek-chat": 800,
    "claude-3-5-sonnet-20240620": 1024,
    "claude-3-7-sonnet-20250219": 1024,
    "gemini-2.0-flash-lite": 512,
    "gemini-2.0-flash": 1024,
}