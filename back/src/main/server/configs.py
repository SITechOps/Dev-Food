import os, secrets, sys
from dotenv import load_dotenv
from flasgger import Swagger
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from io import StringIO
    
load_dotenv()
socketio = SocketIO(cors_allowed_origins="*")

def configure_jwt(app):
    app.config["JWT_SECRET_KEY"] = secrets.token_hex(32)
    JWTManager(app)


def configure_mail(app):
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'devfoodsender@gmail.com'
    app.config['MAIL_PASSWORD'] = 'hmmw mwim ofij jvnd'
    app.template_folder = '../../services/templates'


def configure_swagger(app):
    app.config['SWAGGER'] = {
        "title": "DevFood API",
        "description": "API para o sistema Dev-Food",
        "version": "1.0.0",
        "specs_route": "/docs/",
        "specs": [{
            "endpoint": "swagger",
            "route": "/swagger.json",
        }],
        "servers":[{
            "url": "http://localhost:5000",
            "description": "Servidor de desenvolvimento local"
        }],  
        "openapi": "3.0.1",
        "headers": [],
        "termsOfService": "",
        "swagger_ui_theme": "github",
        "use_latest_resources": True,
        "ui_params": {
            "syntaxHighlight.theme": "github",
            "operationsSorter": "alpha"
        },
        "swagger_ui_bundle_js": "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
        "swagger_ui_standalone_preset_js": "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
        "swagger_ui_css": "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
    }
    template={
        "tags": [
            {"name": "Usuários", "description": "Operações relacionadas a usuários"},
            {"name": "Login", "description": "Operações relacionadas ao login"},
            {"name": "Endereços", "description": "Operações relacionadas a endereços"},
            {"name": "Email", "description": "Operações relacionadas a envio de emails"},
            {"name": "Restaurantes", "description": "Operações relacionadas a restaurantes"},
            {"name": "Produtos", "description": "Operações relacionadas a produtos"},
            {"name": "Pedidos", "description": "Operações relacionadas a pedidos"},
            {"name": "Pagamentos", "description": "Operações relacionadas a pagamentos"},
            {"name": "Nota Fiscal", "description": "Operações relacionadas a envio de nota fiscal"}
        ]
    }
    Swagger(app, template=template)


def configure_twilio(app):
    app.config['TWILIO_ACCOUNT_SID'] = os.getenv("TWILIO_ACCOUNT_SID")
    app.config['TWILIO_AUTH_TOKEN'] = os.getenv("TWILIO_AUTH_TOKEN")
    app.config['TWILIO_PHONE_NUMBER'] = os.getenv("TWILIO_PHONE_NUMBER")


def hide_socketio_logs():
    def filter_stderr(message):
        if not ("/socket.io/" in message or "accepted" in message):
            sys.__stderr__.write(message)

    sys.stderr = StringIO()
    sys.stderr.write = filter_stderr