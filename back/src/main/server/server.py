from flask import Flask
from src.main.routes.user import user_route_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(user_route_bp)