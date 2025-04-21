import io
import os
import pandas as pd
import json

def generate_response_file(file_storage, questions, answers, responseInJson):
    filename = file_storage.filename
    base_name = os.path.splitext(filename)[0]
    output_filename = f"{base_name}.{'json' if responseInJson else 'csv'}"
    
    df = pd.DataFrame({
        'Question': questions,
        'Answer': answers
    })
    output = io.BytesIO()
    
    if responseInJson:
        json_data = df.to_dict(orient='records')
        output.write(json.dumps(json_data).encode())
    else:
        df.to_csv(output, index=False)
    
    output.seek(0)
    return output, output_filename