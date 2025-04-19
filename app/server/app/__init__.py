from flask import Flask
from flask_cors import CORS
from routes import api
import instance.config as config

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    CORS(app, origins=config.FRONTEND_URLS)
    app.register_blueprint(api)
    return app