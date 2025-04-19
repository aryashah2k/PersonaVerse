import os
from flask import Blueprint, jsonify, request, send_file
from werkzeug.utils import secure_filename
from app.utils.ai_caller import build_prompt, call_ai_model, estimate_tokens
from app.utils.file_parser import parse_file
from app.utils.response_generator import generate_response_file
from app.utils.supabase_utils import (
    MODEL_OUTPUT_TOKENS,
    can_use_model,
    get_user_data_from_token,
    is_form_upload_allowed,
)

api = Blueprint("api", __name__)

HEALTH_CHECK_ROUTE = os.getenv("HEALTH_CHECK_ROUTE")
FILL_SURVEY_ROUTE = os.getenv("FILL_SURVEY_ROUTE")
DEMO_ROUTE = os.getenv("DEMO_ROUTE")

@api.route(HEALTH_CHECK_ROUTE, methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@api.route(DEMO_ROUTE, methods=['POST'])
def demo_fill_survey():
    data = request.get_json()
    questions = data.get("questions", [])
    model_name = data.get("model_name")
    instructions = data.get("instructions", "")
    personas = data.get("personas", [])

    if not isinstance(questions, list) or len(questions) != 10:
        return jsonify({"error": "Exactly 10 questions must be provided as a list."}), 400

    if not model_name:
        return jsonify({"error": "Model name is required."}), 400

    try:
        answers = call_ai_model(
            model_name=model_name,
            questions=questions,
            personas=personas,
            instructions=instructions
        )
    except Exception as e:
        return jsonify({"error": f"AI model call failed: {e}"}), 500

    return jsonify({
        "model": model_name,
        "instructions": instructions,
        "personas": personas,
        "qa_pairs": [{"question": q, "answer": a} for q, a in zip(questions, answers)]
    })

@api.route(FILL_SURVEY_ROUTE, methods=['POST'])
def fill_survey_form():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"error": "Missing Authorization token"}), 401

    try:
        user_info = get_user_data_from_token(token)
    except Exception as e:
        return jsonify({"error": f"Token validation failed: {e}"}), 403

    form_file = request.files.get("form_file")
    model_name = request.form.get("model_name")
    personas = request.form.get("personas", "")
    instructions = request.form.get("instructions", "")

    if not form_file:
        return jsonify({"error": "No survey form uploaded."}), 400
    if not model_name:
        return jsonify({"error": "Model name is required."}), 400

    if not can_use_model(user_info["tier"], model_name):
        return jsonify({"error": f"Model '{model_name}' not allowed for your tier '{user_info['tier']}'."}), 403

    if not is_form_upload_allowed(user_info["tier"], user_info["form_usage_count"]):
        return jsonify({"error": "Form upload limit exceeded for Free tier users."}), 403

    try:
        form_file.stream.seek(0)
        questions = parse_file(form_file)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Error parsing survey form: {e}"}), 500

    prompt = build_prompt(questions, personas.split(",") if personas else [], instructions)
    tokens_used_for_prompt = estimate_tokens(prompt, model_name)
    expected_output_tokens = MODEL_OUTPUT_TOKENS.get(model_name, 512)
    total_tokens_required = tokens_used_for_prompt + expected_output_tokens
    tokens_available = user_info.get("tokens_remaining", 2048)

    if total_tokens_required > tokens_available:
        return jsonify({
            "error": (
                f"Your prompt uses {tokens_used_for_prompt} tokens. "
                f"Expected model output ~{expected_output_tokens} tokens. "
                f"You have {tokens_available} tokens remaining. "
                f"Total required: {total_tokens_required}."
            )
        }), 403

    try:
        answers = call_ai_model(
            model_name=model_name,
            questions=questions,
            personas=personas.split(",") if personas else [],
            instructions=instructions
        )
    except Exception as e:
        return jsonify({"error": f"AI model call failed: {e}"}), 500

    try:
        form_file.stream.seek(0)
        filled_file, file_ext = generate_response_file(form_file, questions, answers)
    except Exception as e:
        return jsonify({"error": f"Failed to generate completed form: {e}"}), 500

    return send_file(
        filled_file,
        mimetype={
            ".csv": "text/csv",
            ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".xls": "application/vnd.ms-excel",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".txt": "text/plain",
            ".rtf": "application/rtf"
        }.get(file_ext, "application/octet-stream"),
        as_attachment=True,
        download_name=f"filled_survey{file_ext}"
    )