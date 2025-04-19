import io
import os
import pandas as pd
from docx import Document

def generate_response_file(file_storage, questions, answers):
    filename = file_storage.filename
    ext = os.path.splitext(filename)[1].lower()
    file_bytes = file_storage.read()

    if ext in ['.csv', '.xls', '.xlsx']:
        df = pd.read_excel(io.BytesIO(file_bytes)) if ext != '.csv' else pd.read_csv(io.BytesIO(file_bytes))
        df = df.iloc[:len(questions), :1]
        df.columns = ['Question']
        df['Answer'] = answers
        output = io.BytesIO()
        if ext == '.csv':
            df.to_csv(output, index=False)
        else:
            df.to_excel(output, index=False)
        output.seek(0)
        return output, ext

    elif ext == '.docx':
        doc = Document(io.BytesIO(file_bytes))
        new_doc = Document()
        q_index = 0
        for para in doc.paragraphs:
            text = para.text.strip()
            if text and q_index < len(questions) and text == questions[q_index]:
                new_doc.add_paragraph(f"Q{q_index+1}: {text}")
                new_doc.add_paragraph(f"A{q_index+1}: {answers[q_index]}")
                q_index += 1
        output = io.BytesIO()
        new_doc.save(output)
        output.seek(0)
        return output, ext

    elif ext == '.txt':
        output = io.StringIO()
        for q, a in zip(questions, answers):
            output.write(f"Q: {q}\nA: {a}\n\n")
        return io.BytesIO(output.getvalue().encode()), ext

    elif ext == '.rtf':
        plain_text = ""
        for q, a in zip(questions, answers):
            plain_text += f"Q: {q}\nA: {a}\n\n"
        return io.BytesIO(plain_text.encode('utf-8')), ext

    else:
        raise ValueError("Unsupported file type for response generation.")