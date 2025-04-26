from flask import Blueprint, jsonify, request
from app.utils.ai_caller import perform_ai_call
from app.utils.file_parser import parse_file
from app.utils.supabase_utils import (
    can_use_model,
    get_user_data_from_token,
    get_model_name
)
from app.utils.env_utils import get_required_env_var

api = Blueprint("api", __name__)

HEALTH_CHECK_ROUTE = get_required_env_var("VITE_HEALTH_CHECK_ROUTE")
FILL_SURVEY_ROUTE = get_required_env_var("VITE_FILL_SURVEY_ROUTE")
DEMO_ROUTE = get_required_env_var("VITE_DEMO_ROUTE")

@api.route(HEALTH_CHECK_ROUTE, methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@api.route(DEMO_ROUTE, methods=['POST'])
def demo_fill_survey():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing Authorization token"}), 401

    try:
        user_info = get_user_data_from_token(token)
    except Exception as e:
        return jsonify({"error": f"Token validation failed: {e}"}), 401
    
    data = request.get_json()
    questions = data.get("questions", [])
    model_id = int(data.get("model_id"))
    instructions = data.get("instructions", "")
    personas = data.get("personas", [])

    if not isinstance(questions, list):
        return jsonify({"error": "There must be a list of questions."}), 400
    
    if not model_id:
        return jsonify({"error": "Model id is required."}), 400
    model_name = get_model_name(model_id)
    if not model_name:
        return jsonify({"error": f"Invalid model id: {model_id}"}), 400
    if not can_use_model(user_info["plan_type"], model_name):
        return jsonify({"error": f"Model '{model_id}' not allowed for your tier '{user_info['plan_type']}'."}), 403
    
    return perform_ai_call(questions, model_name, model_id, personas, instructions, user_info)

@api.route(FILL_SURVEY_ROUTE, methods=['POST'])
def fill_survey_form():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing Authorization token"}), 401

    try:
        user_info = get_user_data_from_token(token)
    except Exception as e:
        return jsonify({"error": f"Token validation failed: {e}"}), 401

    form_file = request.files.get("form_file")
    model_id = request.form.get("model_id")
    personas = request.form.get("personas", "")
    instructions = request.form.get("instructions", "")
    responseInJson = request.form.get("responseInJson", "false").lower() == "true"
    isFromSurvey = request.form.get("isFromSurvey", "false").lower() == "true"

    if not form_file:
        return jsonify({"error": "No survey form uploaded."}), 400
    if not model_id:
        return jsonify({"error": "Model id is required."}), 400
    model_name = get_model_name(model_id)
    if not model_name:
        return jsonify({"error": f"Invalid model id: {model_id}"}), 400
    if not can_use_model(user_info["plan_type"], model_name):
        return jsonify({"error": f"Model '{model_id}' not allowed for your tier '{user_info['plan_type']}'."}), 403

    try:
        form_file.stream.seek(0)
        questions = parse_file(form_file)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Error parsing survey form: {e}"}), 500

    return perform_ai_call(questions, model_name, model_id, personas, instructions, user_info, form_file.filename, responseInJson, isFromSurvey)