import pandas as pd
from striprtf.striprtf import rtf_to_text
from docx import Document
import pdfplumber
import os
import io

ALLOWED_EXTENSIONS = ['.csv', '.xls', '.xlsx', '.docx', '.txt', '.rtf', '.pdf']

def parse_file(file_storage):
    filename = file_storage.filename
    ext = os.path.splitext(filename)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file format: {ext}")

    file_bytes = file_storage.read()
    questions = []

    if ext in ['.csv', '.xls', '.xlsx']:
        df = pd.read_excel(io.BytesIO(file_bytes)) if ext != '.csv' else pd.read_csv(io.BytesIO(file_bytes))
        if df.columns[0].lower() != 'question':
            raise ValueError("First column must be labeled 'Question'")
        questions = df.iloc[:, 0].dropna().astype(str).tolist()

    elif ext == '.docx':
        document = Document(io.BytesIO(file_bytes))
        questions = [para.text.strip() for para in document.paragraphs if para.text.strip()]

    elif ext == '.rtf':
        raw_text = rtf_to_text(file_bytes.decode(errors='ignore'))
        questions = [line.strip() for line in raw_text.splitlines() if line.strip()]

    elif ext == '.txt':
        text = file_bytes.decode(errors='ignore')
        questions = [line.strip() for line in text.splitlines() if line.strip()]

    elif ext == '.pdf':
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    lines = text.splitlines()
                    questions.extend([line.strip() for line in lines if line.strip()])
        questions = questions[:10]

    if not (1 <= len(questions) <= 10):
        raise ValueError(f"File must contain between 1 and 10 questions. Found: {len(questions)}")

    return questions