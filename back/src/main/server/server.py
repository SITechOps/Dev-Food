from flask import Flask
from flask_cors import CORS
from src.services.email_config import configure_mail
from src.main.routes.user_route import user_route_bp
from src.main.routes.email_route import email_route_bp
from src.main.routes.endereco_route import endereco_route_bp
from src.main.handlers.error_handlers import handlers_bp

def create_app():
    app = Flask(__name__, template_folder='../../services/templates')
    CORS(app)

    app = configure_mail(app)
    app.register_blueprint(user_route_bp)
    app.register_blueprint(email_route_bp)
    app.register_blueprint(endereco_route_bp)
    app.register_blueprint(handlers_bp)
    return app

app = create_app()