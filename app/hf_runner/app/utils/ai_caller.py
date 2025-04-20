import random
import tiktoken
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

CUSTOM_MODELS = ["aryashah00/survey-finetuned-TinyLlama-1.1B-Chat-v1.0"]

def get_torch_device():
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")

def call_ai_model(model_name, questions, personas, instructions):
    if model_name in CUSTOM_MODELS:
        return call_custom_model(model_name, questions, personas, instructions)
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

def call_custom_model(model_name, questions, personas, instructions):
    device = get_torch_device()
    model = AutoModelForCausalLM.from_pretrained(model_name, trust_remote_code=True)
    tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
    
    model.to(device)
    tokenizer.to(device)

    prompt = build_prompt(questions, personas, instructions)
    messages = [
        {"role": "system", "content": get_system_prompt()},
        {"role": "user", "content": prompt}
    ]

    input_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    input_ids = tokenizer(input_text, return_tensors="pt").input_ids.to(device)

    with torch.no_grad():
        output_ids = model.generate(
            input_ids=input_ids,
            max_new_tokens=1024,
            temperature=get_randomized_temperature(),
            top_p=0.9,
            do_sample=True
        )

    output = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    response_start = output.find(input_text) + len(input_text)
    generated_response = output[response_start:].strip()

    return extract_answers(generated_response, len(questions))

def extract_answers(response_text, expected_count):
    answers = []
    for line in response_text.splitlines():
        line = line.strip()
        if any(line.startswith(f"{i+1}.") for i in range(expected_count)):
            answers.append(line.split('.', 1)[1].strip())
    return answers if len(answers) >= expected_count else response_text.strip().split("\n")[:expected_count]