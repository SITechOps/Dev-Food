from flask import Blueprint, jsonify, request

from src.model.repositories.users_repository import UsersRepository
from src.controllers.enderecos_manager import EnderecosManager
from src.model.repositories.enderecos_repository import EnderecosRepository
from src.http_types.http_request import HttpRequest

endereco_route_bp = Blueprint('endereco_route', __name__)

@app.route('/restaurants', methods=['GET'])
def get_restaurants():
    restaurants = Restaurant.query.all()
    result = []
    
    for restaurant in restaurants:
        result.append({
            'id': restaurant.id,
            'nome': restaurant.nome,
            'rating': float(restaurant.rating),
            'category': restaurant.category,
            'imageUrl': restaurant.image_url
        })
    
    return jsonify(result)

# Endpoint para obter detalhes de um restaurante específico
@app.route('/restaurants/<int:id>', methods=['GET'])
def get_restaurant(id):
    restaurant = Restaurant.query.get_or_404(id)
    
    return jsonify({
        'id': restaurant.id,
        'name': restaurant.name,
        'rating': float(restaurant.rating),
        'category': restaurant.category,
        'imageUrl': restaurant.image_url,
        'bannerUrl': restaurant.banner_url,
        'description': restaurant.description,
        'address': restaurant.address,
        'hours': restaurant.opening_hours,
    })