from flask import Blueprint, jsonify, request

from src.validators.users_creator_validator import users_creator_validator

from src.http_types.http_request import HttpRequest

from src.controllers.users.users_creator import UsersCreator
from src.controllers.users.users_reader import UsersReader
from src.controllers.users.users_filter import UsersFilter
from src.controllers.users.users_editor import UsersEditor
from src.controllers.users.users_remover import UsersRemover
from src.model.repositories.users_repository import UsersRepository

user_route_bp = Blueprint('user_route', __name__)


@user_route_bp.route('/user', methods=['POST'])
def create_new_user():
    users_creator_validator(request)
    http_request = HttpRequest(body=request.json)

    users_repo = UsersRepository()
    users_creator = UsersCreator(users_repo)

    http_response = users_creator.create_user(http_request)

    return jsonify(http_response.body), http_response.status_code


@user_route_bp.route('/user', methods=['GET'])
def get_all_users():
    users_repo = UsersRepository()
    users_reader = UsersReader(users_repo)

    http_response = users_reader.get_all_users()

    return jsonify(http_response.body), http_response.status_code


@user_route_bp.route('/user/<int:id>', methods=['GET'])
def get_user_by_id(id):
    http_request = HttpRequest(params={"id": id})
    
    users_repo = UsersRepository()
    users_filter = UsersFilter(users_repo)

    http_response = users_filter.get_user_by_id(http_request)

    return jsonify(http_response.body), http_response.status_code


@user_route_bp.route('/user/<int:id>', methods=['PUT'])
def update_user(id):
    http_request = HttpRequest(params={"id": id}, body=request.json)

    users_repo = UsersRepository()
    users_editor = UsersEditor(users_repo)

    http_response = users_editor.update_user(http_request)

    return jsonify(http_response.body), http_response.status_code


@user_route_bp.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    http_request = HttpRequest(params={"id": id})

    users_repo = UsersRepository()
    users_remover = UsersRemover(users_repo)

    http_response = users_remover.delete_user(http_request)

    return jsonify(http_response.body), http_response.status_code