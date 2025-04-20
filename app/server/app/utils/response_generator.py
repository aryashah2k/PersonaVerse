import io
import os
import pandas as pd

def generate_response_file(file_storage, questions, answers):
    filename = file_storage.filename
    base_name = os.path.splitext(filename)[0]
    output_filename = f"{base_name}.csv"
    
    df = pd.DataFrame({
        'Question': questions,
        'Answer': answers
    })
    
    output = io.BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    
    return output, output_filename