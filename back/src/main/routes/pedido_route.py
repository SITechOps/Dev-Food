from flask import Blueprint, jsonify, request
from src.model.repositories.usuarios_repository import UsuariosRepository
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
    usuarios_repo = UsuariosRepository()
    restaurantes_repo = RestaurantesRepository()
    enderecos_repo = EnderecosRepository()
    produtos_repo = ProdutosRepository()
    pedidos_manager = PedidosManager(pedidos_repo, itens_repo, usuarios_repo, restaurantes_repo, enderecos_repo, produtos_repo)

    http_response = pedidos_manager.create_new_pedido(http_request)
    return jsonify(http_response.body), http_response.status_code


@pedido_route_bp.get('/pedidos/usuario/<id>')
@pedido_route_bp.get('/pedidos/restaurante/<id>')
def get_pedidos(id):
    tipo = "id_usuario" if "usuario" in request.path else "id_restaurante"
    http_request = HttpRequest(params={tipo: id})
    
    pedidos_repo = PedidosRepository()
    itens_repo = ItensRepository()
    usuarios_repo = UsuariosRepository()
    restaurantes_repo = RestaurantesRepository()
    enderecos_repo = EnderecosRepository()
    produtos_repo = ProdutosRepository()
    pedidos_manager = PedidosManager(pedidos_repo, itens_repo, usuarios_repo, restaurantes_repo, enderecos_repo, produtos_repo)

    http_response = pedidos_manager.get_pedidos(http_request)
    return jsonify(http_response.body), http_response.status_code


@pedido_route_bp.patch('/pedido/status/<id>')
def update_pedido_status(id: str):
    http_request = HttpRequest(body=request.json, params={"id_pedido":id})
    
    pedidos_repo = PedidosRepository()
    pedidos_manager = PedidosManager(pedidos_repo)
    
    http_response = pedidos_manager.update_pedido_status(http_request)
    return jsonify(http_response.body), http_response.status_code