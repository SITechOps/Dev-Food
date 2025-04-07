from flask import Flask
from flask_cors import CORS
from src.main.utils.initialize_restaurants import inicializar_restaurantes_exemplo
from src.main.routes.user_route import user_route_bp
from src.main.routes.email_route import email_route_bp
from src.main.routes.endereco_route import endereco_route_bp
from src.main.routes.restaurante_route import restaurante_route_bp
from src.main.routes.sms_route import sms_route_bp
from src.main.handlers.error_handlers import handlers_bp
from src.main.server.configs import *

def create_app():
    app = Flask(__name__, static_url_path="/")
    CORS(app)

    configure_jwt(app)
    configure_mail(app)
    configure_swagger(app)
    configure_twilio(app)

    app.register_blueprint(user_route_bp)
    app.register_blueprint(endereco_route_bp)
    app.register_blueprint(restaurante_route_bp)
    app.register_blueprint(email_route_bp)
    app.register_blueprint(sms_route_bp)
    app.register_blueprint(handlers_bp)

    inicializar_restaurantes_exemplo()
    return app

app = create_app()