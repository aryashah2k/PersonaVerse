import os
from dotenv import load_dotenv
from app import create_app

load_dotenv()

DEBUG = os.getenv("DEBUG").lower() == "true"
PORT = int(os.getenv("PORT"))

app = create_app()

if __name__ == '__main__':
    app.run(debug=DEBUG, host='0.0.0.0', port=PORT)