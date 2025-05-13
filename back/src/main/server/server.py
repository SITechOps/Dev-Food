from flask import Flask
from flask_cors import CORS
from src.main.server.configs import socketio
from src.model.configs.connection import DBConnectionHandler
from src.main.utils.load_restaurants import load_sample_restaurants
from src.main.utils.load_pedidos import load_pedidos_exemplo
from src.main.handlers.error_handlers import handlers_bp
from src.main.server.configs import *
from src.main.routes import *

def create_app():
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))  
    PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '..')) 
    STATIC_FOLDER = os.path.join(PROJECT_ROOT, 'static')
    UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, 'static', 'uploads')

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    app = Flask(__name__,
                static_folder=STATIC_FOLDER,
                static_url_path="/static")

    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    app.register_blueprint(nota_fiscal_bp)
    app.register_blueprint(handlers_bp)

    DBConnectionHandler()
    # load_sample_restaurants()
    # load_pedidos_exemplo()

    socketio.init_app(app)
    hide_socketio_logs()
    return app

app = create_app()