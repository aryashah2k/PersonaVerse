from flask import Flask
from flask_cors import CORS
from routes import api

def create_app():
    app = Flask(__name__)

    try:
        app.config.from_pyfile('../instance/config.py')
    except Exception as e:
        print(f"[WARN] Could not load config.py: {e}")

    CORS(app, origins=app.config.get("FRONTEND_URLS", []))

    app.register_blueprint(api)

    return app