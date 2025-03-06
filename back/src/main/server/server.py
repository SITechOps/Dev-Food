from flask import Flask
from flask_cors import CORS
from src.main.routes.user import user_route_bp

app = Flask(__name__)
CORS(app)
app.register_blueprint(user_route_bp)