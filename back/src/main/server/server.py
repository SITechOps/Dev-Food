from flask import Flask
from flask_cors import CORS
from src.main.server.configs import socketio
from src.model.configs.connection import DBConnectionHandler
from src.main.utils.load_restaurants import load_sample_restaurants
from src.main.utils.load_pedidos import load_pedidos_exemplo
from src.main.routes.usuario_route import usuario_route_bp
from src.main.routes.email_route import email_route_bp
from src.main.routes.endereco_route import endereco_route_bp
from src.main.routes.restaurante_route import restaurante_route_bp
from src.main.routes.produto_route import produto_route_bp
from src.main.routes.pedido_route import pedido_route_bp
from src.main.routes.pagamento_route import pagamento_route_bp
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

    app.register_blueprint(usuario_route_bp)
    app.register_blueprint(endereco_route_bp)
    app.register_blueprint(restaurante_route_bp)
    app.register_blueprint(produto_route_bp)
    app.register_blueprint(pedido_route_bp)
    app.register_blueprint(pagamento_route_bp)
    app.register_blueprint(email_route_bp)
    app.register_blueprint(sms_route_bp)
    app.register_blueprint(handlers_bp)

    DBConnectionHandler()
    load_sample_restaurants()

    socketio.init_app(app)
    load_pedidos_exemplo()
    return app

app = create_app()