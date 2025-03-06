from flask import Flask
from src.main.routes.user import user_route_bp

app = Flask(__name__)

app.register_blueprint(user_route_bp)