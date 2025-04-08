from flask import Blueprint, jsonify, request
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.model.repositories.users_repository import UsersRepository
from src.controllers.users_manager import UsersManager
from src.http_types.http_request import HttpRequest

user_route_bp = Blueprint('user_route', __name__)

@user_route_bp.post('/user')
def create_new_user():
    http_request = HttpRequest(body=request.json)
    
    users_repo = UsersRepository()
    restaurantes_repo = RestaurantesRepository()
    users_manager = UsersManager(users_repo, restaurantes_repo)

    http_response = users_manager.authenticate_user(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@user_route_bp.get('/users')
def get_all_users():
    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.get_all_users()
    
    return jsonify(http_response.body), http_response.status_code


@user_route_bp.get('/user/<id>')
def get_user_by_id(id):
    http_request = HttpRequest(params={"id": id})
    
    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.get_user_by_id(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@user_route_bp.put('/user/<id>')
def update_user(id):
    http_request = HttpRequest(params={"id": id}, body=request.json)
    
    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.update(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@user_route_bp.delete('/user/<id>')
def delete_user(id):
    http_request = HttpRequest(params={"id": id})

    users_repo = UsersRepository()
    users_manager = UsersManager(users_repo)

    http_response = users_manager.delete(http_request)
    
    return jsonify(http_response.body), http_response.status_code