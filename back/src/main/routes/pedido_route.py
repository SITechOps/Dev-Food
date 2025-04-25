from flask import Blueprint, jsonify, request
from src.model.repositories.produtos_repository import ProdutosRepository
from src.model.repositories.enderecos_repository import EnderecosRepository
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.http_types.http_request import HttpRequest
from src.controllers.pedidos_manager import PedidosManager
from src.model.repositories.pedidos_repository import PedidosRepository
from src.model.repositories.itens_repository import ItensRepository

pedido_route_bp = Blueprint('pedido_route', __name__)

@pedido_route_bp.post('/pedido')
def create_new_pedido():
    http_request = HttpRequest(body=request.json)
    
    pedidos_repo = PedidosRepository()
    itens_repo = ItensRepository()
    pedidos_manager = PedidosManager(pedidos_repo, itens_repo)

    http_response = pedidos_manager.create_new_pedido(http_request)
    return jsonify(http_response.body), http_response.status_code


@pedido_route_bp.get('/usuario/<id_usuario>/pedidos')
def get_pedidos_by_user(id_usuario):
    http_request = HttpRequest(params={"id_usuario": id_usuario})
    
    pedidos_repo = PedidosRepository()
    itens_repo = ItensRepository()
    restaurantes_repo = RestaurantesRepository()
    enderecos_repo = EnderecosRepository()
    produtos_repo = ProdutosRepository()
    pedidos_manager = PedidosManager(pedidos_repo, itens_repo, restaurantes_repo, enderecos_repo, produtos_repo)

    http_response = pedidos_manager.get_pedidos_by_user(http_request)
    return jsonify(http_response.body), http_response.status_code