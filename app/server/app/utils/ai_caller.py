import random
import tiktoken
from flask import jsonify
from openai import OpenAI
from anthropic import Anthropic
from google.genai import types, Client
from .env_utils import get_required_env_var
from .supabase_utils import get_model_specs, update_user_tokens, save_to_supabase, get_models_by_provider
from app.utils.response_generator import generate_response_file
from app.utils.api_caller import call_custom_api

OPENAI_MODELS = "openai"
CLAUDE_MODELS = "anthropic"
GEMINI_MODELS = "gemini"
DEEPSEEK_MODELS = "deepseek"
CUSTOM_MODELS = "custom"

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

def call_ai_model(model_name: str, questions: list, personas: list, instructions: str) -> tuple[list, dict]:
    model_and_providers = get_models_by_provider()
    all_answers = []
    total_token_usage = {
        "prompt_tokens": 0,
        "completion_tokens": 0,
        "total_tokens": 0
    }

    for persona in personas:
        if model_name in model_and_providers[CUSTOM_MODELS]:
            answers, token_usage = call_custom(model_name, questions, persona, instructions)
        elif model_name in model_and_providers[OPENAI_MODELS]:
            answers, token_usage = call_openai(model_name, questions, persona, instructions)
        elif model_name in model_and_providers[CLAUDE_MODELS]:
            answers, token_usage = call_claude(model_name, questions, persona, instructions)
        elif model_name in model_and_providers[GEMINI_MODELS]:
            answers, token_usage = call_gemini(model_name, questions, persona, instructions)
        elif model_name in model_and_providers[DEEPSEEK_MODELS]:
            answers, token_usage = call_deepseek(model_name, questions, persona, instructions)
        else:
            raise ValueError(f"Unsupported model: {model_name}")
        
        all_answers.append({
            "persona": persona,
            "answers": answers
        })
        
        total_token_usage["prompt_tokens"] += token_usage["prompt_tokens"]
        total_token_usage["completion_tokens"] += token_usage["completion_tokens"]
        total_token_usage["total_tokens"] += token_usage["total_tokens"]

    return all_answers, total_token_usage

def get_randomized_temperature() -> float:
    return random.uniform(0.8, 1.0)

def build_prompt(questions: list, persona: str, instructions: str) -> str:
    persona_text = f"The following response should reflect the persona: {persona}.\n" if persona else ""
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
    
    message_format_tokens = 1
    
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
    system_prompt = """You are a helpful assistant that answers questions based on the provided persona and instructions. 
    Answer only in the way you are instructed to. Do not add any additional commentary or explanations."""
    return system_prompt

def call_openai(model_name: str, questions: list, persona: str, instructions: str) -> tuple[list, dict]:
    prompt = build_prompt(questions, persona, instructions)
    max_tokens = estimate_tokens(prompt, model_name)
    context_window = get_model_specs(model_name)["context_window"]
    max_tokens = min(max_tokens, context_window)

    response = openai_client.chat.completions.create(
        model=model_name,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    )
    token_usage = {
        "prompt_tokens": response.usage.prompt_tokens,
        "completion_tokens": response.usage.completion_tokens,
        "total_tokens": response.usage.total_tokens
    }
    return extract_answers(response.choices[0].message.content, len(questions)), token_usage

def call_claude(model_name: str, questions: list, persona: str, instructions: str) -> tuple[list, dict]:
    prompt = build_prompt(questions, persona, instructions)
    max_tokens = estimate_tokens(prompt, model_name)
    context_window = get_model_specs(model_name)["context_window"]
    max_tokens = min(max_tokens, context_window)
    
    full_response_text = ""
    input_tokens = 0
    output_tokens = 0
    
    with anthropic_client.messages.stream(
        model=model_name,
        max_tokens=max_tokens,
        system=get_system_prompt(),
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    ) as stream:
        for chunk in stream:
            if chunk.type == "message_start":
                input_tokens = chunk.message.usage.input_tokens
            elif chunk.type == "content_block_delta":
                full_response_text += chunk.delta.text
            elif chunk.type == "message_delta":
                output_tokens = chunk.usage.output_tokens
    
    token_usage = {
        "prompt_tokens": input_tokens,
        "completion_tokens": output_tokens,
        "total_tokens": input_tokens + output_tokens
    }
    return extract_answers(full_response_text, len(questions)), token_usage

def call_gemini(model_name: str, questions: list, persona: str, instructions: str) -> tuple[list, dict]:
    prompt = build_prompt(questions, persona, instructions)
    max_tokens = estimate_tokens(prompt, model_name)
    context_window = get_model_specs(model_name)["context_window"]
    max_tokens = min(max_tokens, context_window)

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
    
    token_usage = {
        "prompt_tokens": estimate_tokens(prompt, model_name),
        "completion_tokens": estimate_tokens(response.text, model_name),
        "total_tokens": estimate_tokens(prompt, model_name) + estimate_tokens(response.text, model_name)
    }
    return extract_answers(response.text, len(questions)), token_usage

def call_deepseek(model_name: str, questions: list, persona: str, instructions: str) -> tuple[list, dict]:
    prompt = build_prompt(questions, persona, instructions)
    max_tokens = estimate_tokens(prompt, model_name)
    context_window = get_model_specs(model_name)["context_window"]
    max_tokens = min(max_tokens, context_window)
    
    response = deepseek_client.chat.completions.create(
        model=model_name,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    )
    token_usage = {
        "prompt_tokens": response.usage.prompt_tokens,
        "completion_tokens": response.usage.completion_tokens,
        "total_tokens": response.usage.total_tokens
    }
    return extract_answers(response.choices[0].message.content, len(questions)), token_usage

def call_custom(model_name: str, questions: list, persona: str, instructions: str) -> tuple[list, dict]:
    prompt = build_prompt(questions, persona, instructions)
    max_tokens = estimate_tokens(prompt, model_name)
    context_window = get_model_specs(model_name)["context_window"]
    max_tokens = min(max_tokens, context_window)

    response = call_custom_api(prompt, max_tokens)

    token_usage = {
        "prompt_tokens": estimate_tokens(prompt, model_name),
        "completion_tokens": estimate_tokens(response.text, model_name),
        "total_tokens": estimate_tokens(prompt, model_name) + estimate_tokens(response.text, model_name)
    }
    return extract_answers(response.text, len(questions)), token_usage

def extract_answers(response_text: str, expected_count: int) -> list:
    answers = []
    for line in response_text.splitlines():
        line = line.strip()
        if any(line.startswith(f"{i+1}.") for i in range(expected_count)):
            answers.append(line.split('.', 1)[1].strip())
    return answers if len(answers) >= expected_count else response_text.strip().split("\n")[:expected_count]

def perform_ai_call(questions: list, model_name: str, model_id: int, personas: list, instructions: str, user_info: dict, file_name: str = None, 
                    response_in_json: bool = False, is_from_survey: bool = False) -> dict:    
    total_tokens_used = 0

    persona_names = []
    persona_descriptions = []
    for persona in personas:
        if ',' in persona:
            name, description = persona.split(',', 1)
            persona_names.append(name.strip())
            persona_descriptions.append(description.strip())
        else:
            persona_names.append(persona.strip())
            persona_descriptions.append("")

    for persona in persona_descriptions:
        prompt = build_prompt(questions, persona, instructions)
        tokens_used_for_prompt = estimate_tokens(prompt, model_name)
        total_tokens_used += tokens_used_for_prompt

    tokens_available = user_info.get("tokens", 0)

    if total_tokens_used > tokens_available:
        return jsonify({
            "error": (
                f"Your prompts use {total_tokens_used} tokens. "
                f"You have {tokens_available} tokens remaining. "
                f"Total required: {total_tokens_used}."
            )
        }), 403

    try:
        all_answers, token_usage = call_ai_model(
            model_name=model_name,
            questions=questions,
            personas=persona_descriptions,
            instructions=instructions
        )
    except Exception as e:
        return jsonify({"error": f"AI model call failed: {e}"}), 500
        
    update_user_tokens(user_info.get("id"), token_usage["total_tokens"])

    if not is_from_survey:
        return jsonify({
            "model_id": model_id,
            "instructions": instructions,
            "persona_names": persona_names,
            "persona_descriptions": persona_descriptions,
            "token_usage": token_usage,
            "responses": [
                {
                    "persona": persona_names[i],
                    "qa_pairs": [{"question": q, "answer": a} for q, a in zip(questions, response["answers"])]
                }
                for i, response in enumerate(all_answers)
            ]
        })
    
    response_data = []
    for i, response in enumerate(all_answers):
        for question, answer in zip(questions, response["answers"]):
            response_data.append({
                "Persona": persona_names[i],
                "Question": question,
                "Answer": answer
            })
    
    response_file_name = generate_response_file(response_data, response_in_json)
    return save_to_supabase(user_info["id"], file_name, response_file_name, model_id, token_usage["total_tokens"])