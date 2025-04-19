import os
import openai
import tiktoken
from anthropic import Anthropic
from deepseek import DeepSeekAPI
from .env_utils import get_required_env_var

def get_api_config():
    return {
        "openai": get_required_env_var("OPENAI_API_KEY"),
        "anthropic": get_required_env_var("ANTHROPIC_API_KEY"),
        "deepseek": get_required_env_var("DEEPSEEK_API_KEY")
    }

try:
    config = get_api_config()
    openai.api_key = config["openai"]
    anthropic_client = Anthropic(api_key=config["anthropic"])
    deepseek_client = DeepSeekAPI(api_key=config["deepseek"])
except Exception as e:
    raise EnvironmentError(f"Failed to initialize API clients: {str(e)}")

OPENAI_MODELS = ["gpt-4o-mini", "gpt-4o"]
CLAUDE_MODELS = ["claude-3.5", "claude-3.7"]
DEEPSEEK_MODELS = ["deepseek-chat"]

def call_ai_model(model_name, questions, personas, instructions):
    if model_name in OPENAI_MODELS:
        return call_openai(model_name, questions, personas, instructions)
    elif model_name in CLAUDE_MODELS:
        return call_claude(model_name, questions, personas, instructions)
    elif model_name in DEEPSEEK_MODELS:
        return call_deepseek(model_name, questions, personas, instructions)
    else:
        raise ValueError(f"Unsupported model: {model_name}")

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

def call_openai(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    response = openai.ChatCompletion.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    return extract_answers(response['choices'][0]['message']['content'], len(questions))

def call_claude(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    response = anthropic_client.messages.create(
        model=model_name,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    return extract_answers(response.content[0].text, len(questions))

def call_deepseek(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    response = deepseek_client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}]
    )
    return extract_answers(response.choices[0].message.content, len(questions))

def extract_answers(response_text, expected_count):
    answers = []
    for line in response_text.splitlines():
        line = line.strip()
        if any(line.startswith(f"{i+1}.") for i in range(expected_count)):
            answers.append(line.split('.', 1)[1].strip())
    return answers if len(answers) >= expected_count else response_text.strip().split("\n")[:expected_count]