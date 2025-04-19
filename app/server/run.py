from dotenv import load_dotenv
from app import create_app
from instance import config

load_dotenv()
app = create_app()

if __name__ == '__main__':
    app.run(debug=config.DEBUG, host='0.0.0.0', port=config.PORT)