from flask import Blueprint, jsonify, request
from src.controllers.login_controller import LoginController
from src.model.repositories.users_repository import UsersRepository
from src.http_types.http_request import HttpRequest

login_bp = Blueprint('login_route', __name__)

@login_bp.post('/login')
def login_user():
    http_request = HttpRequest(body=request.json)

    users_repo = UsersRepository()
    login_controller = LoginController(users_repo)

    http_response = login_controller.authenticate_user(http_request)

    return jsonify(http_response.body), http_response.status_code