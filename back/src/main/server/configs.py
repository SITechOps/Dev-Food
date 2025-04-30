import os
import secrets
import mercadopago
from uuid import uuid4
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_swagger_ui import get_swaggerui_blueprint
from mercadopago.config import RequestOptions

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


def configure_payment(app):
    mercado_pago_sdk = mercadopago.SDK(os.getenv("MERCADO_PAGO_ACCESS_TOKEN") or "")
    request_options = RequestOptions(
        custom_headers={
            "x-idempotency-key": str(uuid4())
        }
    )
    app.config["MERCADO_PAGO_SDK"] = mercado_pago_sdk
    app.config["REQUEST_OPTIONS"] = request_options



def configure_swagger(app):
    app.static_folder = "../../../"
    swagger_bp = get_swaggerui_blueprint(BASE_URL, FILE_URL)
    app.register_blueprint(swagger_bp)


def configure_twilio(app):
    app.config['TWILIO_ACCOUNT_SID'] = os.getenv("TWILIO_ACCOUNT_SID")
    app.config['TWILIO_AUTH_TOKEN'] = os.getenv("TWILIO_AUTH_TOKEN")
    app.config['TWILIO_PHONE_NUMBER'] = os.getenv("TWILIO_PHONE_NUMBER")