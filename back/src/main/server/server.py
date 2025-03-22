from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.services.email_config import configure_mail
from src.main.routes.user_route import user_route_bp
from src.main.routes.email_route import email_route_bp
from src.main.routes.endereco_route import endereco_route_bp
from src.main.handlers.error_handlers import handlers_bp
from src.main.server.swagger_config import register_swagger
import secrets

def create_app():
    app = Flask(__name__, static_url_path="/")
    CORS(app)

    app.config["JWT_SECRET_KEY"] = secrets.token_hex(32)
    JWTManager(app)

    configure_mail(app)
    app.register_blueprint(user_route_bp)
    app.register_blueprint(email_route_bp)
    app.register_blueprint(endereco_route_bp)
    app.register_blueprint(handlers_bp)
    
    register_swagger(app)
    return app

app = create_app()