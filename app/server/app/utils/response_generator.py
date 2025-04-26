import io
import os
import pandas as pd
import json
from datetime import datetime, timezone

def generate_response_file(response_data, isResponseInJson):
    df = pd.DataFrame(response_data)
    
    timestamp = datetime.now(timezone.utc).isoformat()
    file_extension = "json" if isResponseInJson else "csv"
    file_name = f"{timestamp}.{file_extension}"
    
    os.makedirs("responses", exist_ok=True)
    file_path = os.path.join("responses", file_name)
    
    if isResponseInJson:
        with open(file_path, 'w') as f:
            json.dump(df.to_dict(orient='records'), f)
    else:
        df.to_csv(file_path, index=False)
    
    return file_path