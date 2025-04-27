from flask import Flask
from flask_cors import CORS
from app.routes import api_blueprint
from app.utils.model_utils import initialize_model
from app.utils.env_utils import get_required_env_var

def create_app():
    app = Flask(__name__)
    
    referrer_urls = get_required_env_var("CUSTOM_REFERRER_URLS")
    referrer_urls = referrer_urls.split(",")
    CORS(app)

    initialize_model()
    
    app.register_blueprint(api_blueprint)
    return app