import os
import openai
import tiktoken
from anthropic import Anthropic
from deepseek import DeepSeek

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

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
    openai.api_key = OPENAI_API_KEY
    prompt = build_prompt(questions, personas, instructions)

    response = openai.ChatCompletion.create(
        model=model_name,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    raw_output = response['choices'][0]['message']['content']
    return extract_answers(raw_output, len(questions))

def call_claude(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    client = Anthropic(api_key=CLAUDE_API_KEY)
    response = client.messages.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}]
    )
    return extract_answers(response.content[0].text, len(questions))

def call_deepseek(model_name, questions, personas, instructions):
    prompt = build_prompt(questions, personas, instructions)
    client = DeepSeek(api_key=DEEPSEEK_API_KEY)
    response = client.chat.completions.create(
        model=model_name,
        messages=[{"role": "user", "content": prompt}]
    )
    return extract_answers(response.choices[0].message.content, len(questions))

def extract_answers(response_text, expected_count):
    answers = []
    lines = response_text.splitlines()
    for line in lines:
        line = line.strip()
        if line and any(line.startswith(f"{i+1}.") for i in range(expected_count)):
            answers.append(line.split('.', 1)[1].strip())
    if len(answers) < expected_count:
        return response_text.strip().split("\n")[:expected_count]
    return answers