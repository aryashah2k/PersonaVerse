import os
from flask import Flask
from flask_cors import CORS
from .routes import api
from .utils.env_utils import get_required_env_var
from .utils.supabase_utils import init_supabase_client

def create_app():
    app = Flask(__name__)

    frontend_urls = get_required_env_var("FRONTEND_URLS")
    frontend_urls = frontend_urls.split(",")
    CORS(app, origins=frontend_urls)

    init_supabase_client()

    app.register_blueprint(api)

    return app