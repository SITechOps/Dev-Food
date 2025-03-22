from flask import Blueprint, jsonify, request

from src.model.repositories.users_repository import UsersRepository
from src.controllers.usuario_manager import UsersManager
from src.http_types.http_request import HttpRequest

user_route_bp = Blueprint('user_route', __name__)

@user_route_bp.post('/user')
def create_new_user():
    http_request = HttpRequest(body=request.json)
    
    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.create_user(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@user_route_bp.get('/user')
def get_all_users():
    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.get_all_users()
    
    return jsonify(http_response.body), http_response.status_code


@user_route_bp.get('/user/<int:id>')
def get_user_by_id(id):
    http_request = HttpRequest(params={"id": id})
    
    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.get_user_by_id(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@user_route_bp.put('/user/<int:id>')
def update_user(id):
    http_request = HttpRequest(params={"id": id}, body=request.json)
    
    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.update_user(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@user_route_bp.delete('/user/<int:id>')
def delete_user(id):
    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.delete_user(id)
    
    return jsonify(http_response.body), http_response.status_code