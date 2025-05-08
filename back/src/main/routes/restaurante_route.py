from flask import Blueprint, jsonify, request
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.controllers.restaurantes_manager import RestaurantesManager
from src.http_types.http_request import HttpRequest

restaurante_route_bp = Blueprint('restaurante_route', __name__)

@restaurante_route_bp.post('/restaurante')
def create_new_restaurant():
    http_request = HttpRequest(body=request.json)

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.create_new_restaurant(http_request)
    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.get('/restaurantes')
def get_all_restaurants():
    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.get_all_restaurants()
    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.get('/restaurante/<id>')
def get_restaurant_by_id(id):
    http_request = HttpRequest(params={"id": id})

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.get_restaurant_by_id(http_request)

    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.patch('/restaurante/<id>')
def update_restaurant(id):
    http_request = HttpRequest(params={"id": id}, body=request.json)

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.update(http_request)

    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.patch('/restaurante/<id>/financeiro')
def update_dados_bancarios(id):
    http_request = HttpRequest(params={"id": id}, body=request.json)

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.update_financeiro(http_request)

    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.put('/restaurante/endereco/<id>')
def update_endereco(id):
    http_request = HttpRequest(params={"id": id}, body=request.json)

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.update_endereco(http_request)

    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.delete('/restaurante/<id>')
def delete_restaurant(id):
    http_request = HttpRequest(params={"id": id})

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.delete(http_request)
    
    return jsonify(http_response.body), http_response.status_code