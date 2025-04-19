import os
import random
import tiktoken
from openai import OpenAI
from anthropic import Anthropic
from google import genai
from google.genai import types, Client
from .env_utils import get_required_env_var

def get_api_config():
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

OPENAI_MODELS = ["gpt-4o-mini", "gpt-4o"]
CLAUDE_MODELS = ["claude-3-7-sonnet-20250219"]
GEMINI_MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash"]
DEEPSEEK_MODELS = ["deepseek-chat"]

def call_ai_model(model_name, questions, personas, instructions):
    if model_name in OPENAI_MODELS:
        return call_openai(model_name, questions, personas, instructions)
    elif model_name in CLAUDE_MODELS:
        return call_claude(model_name, questions, personas, instructions)
    elif model_name in GEMINI_MODELS:
        return call_gemini(model_name, questions, personas, instructions)
    elif model_name in DEEPSEEK_MODELS:
        return call_deepseek(model_name, questions, personas, instructions)
    else:
        raise ValueError(f"Unsupported model: {model_name}")
    
def get_randomized_temperature():
    return random.uniform(0.5, 1.0)

def build_prompt(questions, personas, instructions):
    persona_text = f"The following response should reflect the personas: {', '.join(personas)}.\n" if personas else ""
    instruction_text = f"{instructions}\n" if instructions else ""
    question_block = "\n".join([f"{i+1}. {q}" for i, q in enumerate(questions)])
    return f"{persona_text}{instruction_text}Please answer the following questions:\n\n{question_block}"

def estimate_tokens(prompt: str, model_name: str = "gpt-4o"):
    try:
        encoding = tiktoken.encoding_for_model(model_name)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(prompt))

def get_system_prompt():
    system_prompt = """You are a helpful assistant that answers questions based on the provided personas and instructions. 
    Answer only in the way you are instructed to. Do not add any additional commentary or explanations."""
    return system_prompt

def call_openai(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    response = openai_client.chat.completions.create(
        model=model_name,
        max_tokens=1024,
        messages=[
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    )
    return extract_answers(response.choices[0].message.content, len(questions))

def call_claude(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    response = anthropic_client.messages.create(
        model=model_name,
        max_tokens=1024,
        system=get_system_prompt(),
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    )
    return extract_answers(response.content[0].text, len(questions))

def call_gemini(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    response = gemini_client.models.generate_content(
        model=model_name,
        config=types.GenerateContentConfig(
            system_instruction=get_system_prompt(),
            response_mime_type="text/plain",
            max_output_tokens=500,
            temperature=get_randomized_temperature()
        ),
        contents=prompt
    )
    return extract_answers(response.text, len(questions))

def call_deepseek(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    response = deepseek_client.chat.completions.create(
        model=model_name,
        max_tokens=1024,
        messages=[
            {"role": "system", "content": get_system_prompt()},
            {"role": "user", "content": prompt}
        ],
        temperature=get_randomized_temperature()
    )
    return extract_answers(response.choices[0].message.content, len(questions))

def extract_answers(response_text, expected_count):
    answers = []
    for line in response_text.splitlines():
        line = line.strip()
        if any(line.startswith(f"{i+1}.") for i in range(expected_count)):
            answers.append(line.split('.', 1)[1].strip())
    return answers if len(answers) >= expected_count else response_text.strip().split("\n")[:expected_count]