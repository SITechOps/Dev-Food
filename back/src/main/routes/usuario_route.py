from flask import Blueprint, jsonify, request
from src.model.repositories.usuarios_repository import UsuariosRepository
from src.controllers.usuarios_manager import UsuariosManager
from src.http_types.http_request import HttpRequest

usuario_route_bp = Blueprint('user_route', __name__)

@usuario_route_bp.post('/auth/create')
def create_new_user():
    http_request = HttpRequest(body=request.json)
    
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.create_new_user(http_request)
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.post('/auth/login')
def login_user():
    http_request = HttpRequest(body=request.json)
    
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.login_user(http_request)
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.get('/users')
def get_all_users():
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.get_all_users()
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.get('/user/<id>')
def get_user_by_id(id: str):
    http_request = HttpRequest(params={"id": id})
    
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.get_user_by_id(http_request)
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.put('/user/<id>')
def update_user(id: str):
    http_request = HttpRequest(params={"id": id}, body=request.json)
    
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.update(http_request)
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.delete('/user/<id>')
def delete_user(id: str):
    http_request = HttpRequest(params={"id": id})

    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.delete(http_request)
    return jsonify(http_response.body), http_response.status_code