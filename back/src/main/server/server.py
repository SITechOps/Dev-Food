from flask import Flask
from flask_cors import CORS
from src.main.routes.user_route import user_route_bp
from src.main.routes.email_route import email_route_bp
from src.main.routes.endereco_route import endereco_route_bp
from src.main.routes.restaurant_route import restaurant_route_bp
from src.main.routes.login_route import login_bp
from src.main.handlers.error_handlers import handlers_bp
from src.main.server.configs import configure_bcrypt, configure_jwt, configure_mail, configure_swagger

def create_app():
    app = Flask(__name__, static_url_path="/")
    CORS(app)

    configure_bcrypt(app)
    configure_jwt(app)
    configure_mail(app)
    configure_swagger(app)

    app.register_blueprint(user_route_bp)
    app.register_blueprint(email_route_bp)
    app.register_blueprint(endereco_route_bp)
    app.register_blueprint(handlers_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(restaurant_route_bp)
    return app

app = create_app()