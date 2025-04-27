import os
import random
import torch
from transformers import AutoTokenizer, LlamaForCausalLM
from app.utils.env_utils import get_required_env_var

model = None
tokenizer = None

def initialize_model():
    global model, tokenizer
    
    os.environ["CUDA_VISIBLE_DEVICES"] = get_required_env_var("CUSTOM_MODEL_CUDA_VISIBLE_DEVICES")
    model_name = get_required_env_var("CUSTOM_MODEL_NAME")
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = LlamaForCausalLM.from_pretrained(
        model_name,
        torch_dtype=torch.float32,
        device_map=get_required_env_var("CUSTOM_MODEL_DEVICE_MAP")
    )

def load_model():
    if model is None or tokenizer is None:
        initialize_model()
    return model, tokenizer

def get_system_prompt() -> str:
    system_prompt = """You are a helpful assistant that answers questions based on the provided persona and instructions. 
    Answer only in the way you are instructed to. Do not add any additional commentary or explanations."""
    return system_prompt

def get_randomized_temperature() -> float:
    return random.uniform(0.8, 1.0)

def generate_response_from_model(prompt, max_tokens):
    model, tokenizer = load_model()

    messages = [
        {"role": "system", "content": get_system_prompt()},
        {"role": "user", "content": prompt}
    ]

    input_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    input_ids = tokenizer(input_text, return_tensors="pt").input_ids

    with torch.no_grad():
        output_ids = model.generate(
            input_ids=input_ids,
            max_new_tokens=max_tokens,
            temperature=get_randomized_temperature(),
            top_p=0.9,
            do_sample=True
        )

    output = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    response_start = output.find(input_text) + len(input_text)
    generated_response = output[response_start:].strip()

    return generated_response