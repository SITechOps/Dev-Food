from flask import Blueprint, jsonify, request
from src.controllers import restaurant_controller
from src.http_types.http_request import HttpRequest
from src.controllers.restaurant_controller import RestaurantesController
from src.model.repositories.restaurants_repository import RestaurantesRepository

restaurant_route_bp = Blueprint('restaurant_route', __name__)


@restaurant_route_bp.get('/restaurants')
def get_restaurants():
    restaurantes_repository = RestaurantesRepository()
    restaurantes_controller = RestaurantesController(restaurantes_repository)
    
    http_response = restaurantes_controller.get_restaurants()
    return jsonify(http_response.body), http_response.status_code

@restaurant_route_bp.get('/restaurants/<id>')
def get_restaurant(id):
    http_request = HttpRequest(params={"id_restaurante": id})
    
    http_response = restaurant_controller.get_restaurant_by_id(http_request)
    
    return jsonify(http_response.body), http_response.status_code

@restaurant_route_bp.post('/restaurants')
def create_restaurant():
    http_request = HttpRequest(body=request.json)
    restaurant_repo = RestaurantesRepository()
    restaurant_controller = RestaurantesController(restaurant_repo)
    http_response = restaurant_controller.create_restaurant(http_request)
    return jsonify(http_response.body), http_response.status_code

@restaurant_route_bp.put('/restaurants/<int:id>')
def update_restaurant(id):
    http_request = HttpRequest(params={"id_restaurante": id}, body=request.get_json())
    http_response = restaurant_controller.update_restaurant(http_request)
    return jsonify(http_response.body), http_response.status_code

@restaurant_route_bp.delete('/restaurants/<int:id>')
def delete_restaurant(id):
    http_request = HttpRequest(params={"id_restaurante": id})
    http_response = restaurant_controller.delete_restaurant(http_request)
    return '', http_response.status_code