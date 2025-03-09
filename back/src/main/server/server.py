from flask import Flask
from flask_cors import CORS
from src.main.routes.user import user_route_bp
from src.main.routes.send_email import email_route_bp

app = Flask(__name__, template_folder='../../services/templates')
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'devfoodsender@gmail.com'
app.config['MAIL_PASSWORD'] = 'hmmw mwim ofij jvnd'

app.register_blueprint(user_route_bp)
app.register_blueprint(email_route_bp)