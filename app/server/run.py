import os
from dotenv import load_dotenv
from app.utils.env_utils import get_required_env_var

load_dotenv()

required_vars = ["DEBUG", "PORT", "FRONTEND_URLS"]
for var in required_vars:
    get_required_env_var(var)

from app import create_app

DEBUG = get_required_env_var("DEBUG").lower() == "true"
PORT = int(get_required_env_var("PORT"))

app = create_app()

if __name__ == '__main__':
    app.run(debug=DEBUG, host='0.0.0.0', port=PORT)