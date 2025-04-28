from app import create_app
from app.utils.env_utils import get_required_env_var

required_vars = ["DEBUG", "PORT", "CUSTOM_REFERRER_URLS"]
for var in required_vars:
    get_required_env_var(var)

DEBUG = get_required_env_var("DEBUG").lower() == "true"
PORT = int(get_required_env_var("PORT"))

app = create_app()

if __name__ == '__main__':
    app.run(debug=DEBUG, host='0.0.0.0', port=PORT)