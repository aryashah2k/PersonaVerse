import os
from flask import Flask
from flask_cors import CORS
from .routes import api

def create_app():
    app = Flask(__name__)

    frontend_urls = os.getenv("FRONTEND_URLS").split(",")

    CORS(app, origins=frontend_urls)

    app.register_blueprint(api)

    return app