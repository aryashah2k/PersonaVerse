import os
from datetime import datetime
import mimetypes
from supabase import create_client, Client
from .env_utils import get_required_env_var

_supabase_client = None

def get_supabase_config():
    return {
        "url": get_required_env_var("VITE_SUPABASE_URL"),
        "service_role_key": get_required_env_var("VITE_SUPABASE_SERVICE_ROLE_KEY")
    }

def init_supabase_client():
    global _supabase_client
    if _supabase_client is None:
        config = get_supabase_config()
        _supabase_client = create_client(config["url"], config["service_role_key"])
    return _supabase_client

def get_supabase_client() -> Client:
    if _supabase_client is None:
        return init_supabase_client()
    return _supabase_client

def get_user_data_from_token(token: str) -> dict:
    try:
        supabase = get_supabase_client()
        user_id = supabase.auth.get_user(token).user.id
    except Exception as e:
        raise ValueError(f"Invalid user or token: {e}")

    return supabase.table("Profiles").select("*").eq("id", user_id).execute().data[0]

def get_models() -> dict:
    try:
        supabase = get_supabase_client()
        models = supabase.table("Models").select("*").execute().data
    except Exception as e:
        raise ValueError(f"Error fetching models: {e}")

    return models

def can_use_model(tier: str, model: str) -> bool:
    models = get_models()
    for model in models:
        if model["model_name"] == model:
            return tier in model["usage_type"]
    return False

def get_models_by_provider() -> dict:
    models = get_models()
    provider_models = {}
    for model in models:
        provider = model["provider"]
        if provider not in provider_models:
            provider_models[provider] = []
        provider_models[provider].append(model["model_name"])
    return provider_models

def get_model_name(model_id: int) -> str:
    models = get_models()
    model_name = {model["id"]: model["model_name"] for model in models}
    return model_name.get(model_id, None)

def get_model_params(model_name: str) -> dict:
    models = get_models()
    model_specs = {model["model_name"]: model["model_params"] for model in models}
    return model_specs.get(model_name, None)

def get_model_specs(model_name: str) -> dict:
    model_params = get_model_params(model_name)
    return model_params

def update_user_tokens(user_id: str, tokens_used: int):
    try:
        supabase = get_supabase_client()
        remaining_tokens = supabase.table("Profiles").select("tokens").eq("id", user_id).execute().data[0]["tokens"] - tokens_used
        supabase.table("Profiles").update({"tokens": remaining_tokens}).eq("id", user_id).execute()
    except Exception as e:
        raise ValueError(f"Error updating user tokens: {e}")

def save_to_supabase(user_id: str, file_path: str, response_file_path: str, model_id: int, tokens_used: int):
    try:
        supabase = get_supabase_client()
    
        response_file_name = f"{user_id}_{os.path.basename(response_file_path)}"
        response_file_extension = os.path.splitext(response_file_path)[1]
        storage_path = f"survey_responses/{response_file_name}.{response_file_extension}"
        content_type, _ = mimetypes.guess_type(response_file_extension)

        with open(file_path, "rb") as f:
            _ = supabase.storage.from_("files").upload(
                path=storage_path,
                file=f,
                file_options={"content-type": content_type} 
            )

        signedUrl = supabase.storage.from_("files").create_signed_url(
            path=storage_path,
            expires_in=3600
        ).get("signedURL")

        data = {
            "profile_id": user_id,
            "file_name": file_path,
            "bucket_storage_path": storage_path,
            "tokens_used": tokens_used,
            "model_used": model_id,
            "signed_url": signedUrl
        }
        supabase.table('SurveyHistory').insert(data).execute()
        
        return data
    except Exception as e:
        raise ValueError(f"Error saving file to supabase: {e}")