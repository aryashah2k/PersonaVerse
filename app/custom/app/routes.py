from flask import Blueprint, request, jsonify
from app.utils.model_utils import generate_response_from_model
from app.utils.env_utils import get_required_env_var
from werkzeug.serving import WSGIRequestHandler

WSGIRequestHandler.protocol_version = "HTTP/1.1"

api_blueprint = Blueprint('api', __name__)

CUSTOM_ROUTE = get_required_env_var("CUSTOM_API_ROUTE")

@api_blueprint.route(CUSTOM_ROUTE, methods=['POST'])
def generate_response():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        max_tokens = data.get('max_tokens')

        if not prompt or not max_tokens:
            return jsonify({"error": "Missing prompt or max tokens."}), 400

        generated_response = generate_response_from_model(prompt, max_tokens)

        return jsonify({
            "text": generated_response,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500