from flask import Blueprint, jsonify, request
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.controllers.produtos_manager import ProdutosManager
from src.model.repositories.produtos_repository import ProdutosRepository
from src.http_types.http_request import HttpRequest

produto_route_bp = Blueprint('produto_route', __name__)

@produto_route_bp.post('/produto')
def create_new_produto():
    http_request = HttpRequest(body=request.json)
    
    produtos_repo = ProdutosRepository()
    restaurantes_repo = RestaurantesRepository()
    produtos_manager = ProdutosManager(produtos_repo, restaurantes_repo)

    http_response = produtos_manager.create_new_produto(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.get('/restaurante/<id>/produtos')
def get_products_by_restaurant(id: str):
    http_request = HttpRequest(params={"id_restaurante": id})

    produtos_repo = ProdutosRepository()
    restaurantes_repo = RestaurantesRepository()
    produtos_manager = ProdutosManager(produtos_repo, restaurantes_repo)

    http_response = produtos_manager.get_products_by_restaurante(http_request)
    
    return jsonify(http_response.body), http_response.status_code



@produto_route_bp.get('/produtos')
def get_all_products():
    produtos_repo = ProdutosRepository()
    produtos_manager = ProdutosManager(produtos_repo)

    http_response = produtos_manager.get_all_products()
    
    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.put('/produto/<id>')
def update_produto(id: str):
    http_request = HttpRequest(params={"id_produto": id}, body=request.json)
    
    produtos_repo = ProdutosRepository()
    produtos_manager = ProdutosManager(produtos_repo)

    http_response = produtos_manager.update(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.delete('/produto/<id>')
def delete_produto(id: str):
    http_request = HttpRequest(params={"id_produto": id})

    produtos_repo = ProdutosRepository()
    produtos_manager = ProdutosManager(produtos_repo)

    http_response = produtos_manager.delete(http_request)
    
    return jsonify(http_response.body), http_response.status_code