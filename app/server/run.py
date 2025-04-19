import os
from dotenv import load_dotenv
from app import create_app
from instance import config

load_dotenv()

PORT = config.PORT
app = create_app()

if __name__ == '__main__':
    port = int(PORT)  
    app.run(debug=True, host='0.0.0.0', port=port)