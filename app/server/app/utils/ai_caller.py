import random
from flask import jsonify
import tiktoken
from openai import OpenAI
from anthropic import Anthropic
from google.genai import types, Client
from .env_utils import get_required_env_var
from .supabase_utils import get_model_specs, update_user_tokens, save_to_supabase, get_models_by_provider
from app.utils.response_generator import generate_response_file

OPENAI_MODELS = "openai"
CLAUDE_MODELS = "anthropic"
GEMINI_MODELS = "gemini"
DEEPSEEK_MODELS = "deepseek"

def get_api_config() -> dict:
    return {
        "openai": get_required_env_var("OPENAI_API_KEY"),
        "anthropic": get_required_env_var("ANTHROPIC_API_KEY"),
        "gemini": get_required_env_var("GEMINI_API_KEY"),
        "deepseek": get_required_env_var("DEEPSEEK_API_KEY"),
        "deepseek_base_url": get_required_env_var("DEEPSEEK_BASE_URL")
    }

try:
    config = get_api_config()
    openai_client = OpenAI(api_key=config["openai"])
    anthropic_client = Anthropic(api_key=config["anthropic"])
    gemini_client = Client(api_key=config["gemini"])
    deepseek_client = OpenAI(api_key=config["deepseek"], base_url=config["deepseek_base_url"])
except Exception as e:
    raise EnvironmentError(f"Failed to initialize API clients: {str(e)}")

def call_ai_model(model_name: str, questions: list, personas: list, instructions: str) -> list:
    model_and_providers = get_models_by_provider()

    if model_name in model_and_providers[OPENAI_MODELS]:
        return call_openai(model_name, questions, personas, instructions)
    elif model_name in model_and_providers[CLAUDE_MODELS]:
        return call_claude(model_name, questions, personas, instructions)
    elif model_name in model_and_providers[GEMINI_MODELS]:
        return call_gemini(model_name, questions, personas, instructions)
    elif model_name in model_and_providers[DEEPSEEK_MODELS]:
        return call_deepseek(model_name, questions, personas, instructions)
    else:
        raise ValueError(f"Unsupported model: {model_name}")
    
def get_randomized_temperature() -> float:
    return random.uniform(0.5, 1.0)

def build_prompt(questions: list, personas: list, instructions: str) -> str:
    persona_text = f"You areThe following response should reflect the personas: {', '.join(personas)}.\n" if personas else ""
    instruction_text = f"{instructions}\n" if instructions else ""
    question_block = "\n".join([f"{i+1}. {q}" for i, q in enumerate(questions)])
    return f"{persona_text}{instruction_text}Please answer the following questions:\n\n{question_block}"

def estimate_tokens(prompt: str, model_name: str) -> int:
    try:
        encoding = tiktoken.encoding_for_model(model_name)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    
    system_prompt = get_system_prompt()
    system_tokens = len(encoding.encode(system_prompt))
    
    prompt_tokens = len(encoding.encode(prompt))
    
    if model_name in OPENAI_MODELS or model_name in DEEPSEEK_MODELS:
        message_format_tokens = 6 
    elif model_name in CLAUDE_MODELS:
        message_format_tokens = 4
    elif model_name in GEMINI_MODELS:
        message_format_tokens = 2 

    total_tokens = system_tokens + prompt_tokens + message_format_tokens
    total_tokens = int(total_tokens * 1.1)
    
    return total_tokens

def get_system_prompt() -> str:
    system_prompt = """You are a helpful assistant that answers questions based on the provided personas and instructions. 
    Answer only in the way you are instructed to. Do not add any additional commentary or explanations."""
    return system_prompt

def call_openai(model_name: str, questions: list, personas: list, instructions: str) -> list:
    prompt = build_prompt(questions, personas, instructions)
    max_tokens = estimate_output_tokens(model_name, questions, personas, instructions)
    response = openai_client.chat.completions.create(
        model=model_name,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    )
    return extract_answers(response.choices[0].message.content, len(questions))

def call_claude(model_name: str, questions: list, personas: list, instructions: str) -> list:
    prompt = build_prompt(questions, personas, instructions)
    max_tokens = estimate_output_tokens(model_name, questions, personas, instructions)
    response = anthropic_client.messages.create(
        model=model_name,
        max_tokens=max_tokens,
        system=get_system_prompt(),
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    )
    return extract_answers(response.content[0].text, len(questions))

def call_gemini(model_name: str, questions: list, personas: list, instructions: str) -> list:
    prompt = build_prompt(questions, personas, instructions)
    max_tokens = estimate_output_tokens(model_name, questions, personas, instructions)
    response = gemini_client.models.generate_content(
        model=model_name,
        config=types.GenerateContentConfig(
            system_instruction=get_system_prompt(),
            response_mime_type="text/plain",
            max_output_tokens=max_tokens,
            temperature=get_randomized_temperature()
        ),
        contents=prompt
    )
    return extract_answers(response.text, len(questions))

def call_deepseek(model_name: str, questions: list, personas: list, instructions: str) -> list:
    prompt = build_prompt(questions, personas, instructions)
    max_tokens = estimate_output_tokens(model_name, questions, personas, instructions)
    response = deepseek_client.chat.completions.create(
        model=model_name,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    )
    return extract_answers(response.choices[0].message.content, len(questions))

def extract_answers(response_text: str, expected_count: int) -> list:
    answers = []
    for line in response_text.splitlines():
        line = line.strip()
        if any(line.startswith(f"{i+1}.") for i in range(expected_count)):
            answers.append(line.split('.', 1)[1].strip())
    return answers if len(answers) >= expected_count else response_text.strip().split("\n")[:expected_count]

def estimate_output_tokens(model_name: str, questions: list, personas: list, instructions: str) -> int:
    model_specs = get_model_specs(model_name)
    base_tokens = model_specs["output_tokens"]
    context_window = model_specs["context_window"]
    
    avg_question_length = sum(len(q) for q in questions) / len(questions) if questions else 0
    
    question_factor = len(questions) * (1 + (avg_question_length / 100))
    persona_factor = len(personas) * 1.5
    instruction_factor = 1.5 if instructions else 1.0
    
    dynamic_tokens = int(base_tokens * question_factor * persona_factor * instruction_factor)
    
    max_tokens = min(dynamic_tokens, context_window)
    
    return max_tokens

def perform_ai_call(questions: list, model_name: str, model_id: int, personas: list, instructions: str, user_info: dict, file_name: str, response_in_json: bool, is_from_survey: bool) -> dict:    
    prompt = build_prompt(questions, personas.split(",") if personas else [], instructions)
    tokens_used_for_prompt = estimate_tokens(prompt, model_name)
    expected_output_tokens = estimate_output_tokens(model_name, questions, personas.split(",") if personas else [], instructions)
    total_tokens_required = tokens_used_for_prompt + expected_output_tokens
    tokens_available = user_info.get("tokens", 0)

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
            personas=personas,
            instructions=instructions
        )
    except Exception as e:
        return jsonify({"error": f"AI model call failed: {e}"}), 500
        
    update_user_tokens(user_info.get("id"), tokens_used_for_prompt)

    if not is_from_survey:
        return jsonify({
            "model_id": model_id,
            "instructions": instructions,
            "personas": personas,
            "tokens_used": total_tokens_required,
            "qa_pairs": [{"question": q, "answer": a} for q, a in zip(questions, answers)]
        })
    
    response_file_name = generate_response_file(questions, answers, response_in_json)
    return save_to_supabase(user_info, file_name, response_file_name, model_id, tokens_used_for_prompt)