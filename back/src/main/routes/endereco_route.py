from flask import Blueprint, jsonify, request

from src.model.repositories.users_repository import UsersRepository
from src.controllers.enderecos_manager import EnderecosManager
from src.model.repositories.enderecos_repository import EnderecosRepository
from src.http_types.http_request import HttpRequest

endereco_route_bp = Blueprint('endereco_route', __name__)

@endereco_route_bp.post('/endereco')
def create_new_endereco():
    http_request = HttpRequest(body=request.json)

    endereco_repo = EnderecosRepository()
    users_repo = UsersRepository()
    endereco_manager = EnderecosManager(endereco_repo, users_repo)

    http_response = endereco_manager.create_new_endereco(http_request)

    return jsonify(http_response.body), http_response.status_code


@endereco_route_bp.get('/endereco/<id_usuario>')
def get_all_enderecos(id_usuario):
    http_request = HttpRequest(params={"id_usuario": id_usuario})
    endereco_repo = EnderecosRepository()
    users_repo = UsersRepository()
    endereco_manager = EnderecosManager(endereco_repo, users_repo)

    http_response = endereco_manager.get_all_enderecos_by_user(http_request)
    return jsonify(http_response.body), http_response.status_code


@endereco_route_bp.put('/endereco/<id_endereco>')
def update_endereco(id_endereco):
    http_request = HttpRequest(params={"id_endereco": id_endereco}, body=request.json)

    endereco_repo = EnderecosRepository()
    endereco_manager = EnderecosManager(endereco_repo)

    http_response = endereco_manager.update(http_request)
    return jsonify(http_response.body), http_response.status_code


@endereco_route_bp.delete('/endereco/<id_endereco>')
def delete_endereco(id_endereco):
    http_request = HttpRequest(params={"id_endereco": id_endereco})

    endereco_repo = EnderecosRepository()
    endereco_manager = EnderecosManager(endereco_repo)

    http_response = endereco_manager.delete(http_request)
    return jsonify(http_response.body), http_response.status_code