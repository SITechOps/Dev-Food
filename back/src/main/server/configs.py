import os
import secrets
from flask_jwt_extended import JWTManager
from flask_swagger_ui import get_swaggerui_blueprint
from dotenv import load_dotenv
from flask_socketio import SocketIO

load_dotenv()

socketio = SocketIO(cors_allowed_origins="*")
BASE_URL = "/docs"
FILE_URL = "/swagger.yaml"

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
    app.static_folder = "../../../"
    swagger_bp = get_swaggerui_blueprint(BASE_URL, FILE_URL)
    app.register_blueprint(swagger_bp)


def configure_twilio(app):
    app.config['TWILIO_ACCOUNT_SID'] = os.getenv("TWILIO_ACCOUNT_SID")
    app.config['TWILIO_AUTH_TOKEN'] = os.getenv("TWILIO_AUTH_TOKEN")
    app.config['TWILIO_PHONE_NUMBER'] = os.getenv("TWILIO_PHONE_NUMBER")