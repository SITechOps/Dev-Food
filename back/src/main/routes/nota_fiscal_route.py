from flask import Blueprint, current_app, request, jsonify
from src.services.pdf_generator import PdfGenerator
from src.controllers.nota_fiscal_manager import NotaFiscalManager
from src.controllers.pedidos_manager import PedidosManager
from src.http_types.http_request import HttpRequest
from src.model.repositories.enderecos_repository import EnderecosRepository
from src.model.repositories.itens_repository import ItensRepository
from src.model.repositories.pedidos_repository import PedidosRepository
from src.model.repositories.produtos_repository import ProdutosRepository
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.model.repositories.usuarios_repository import UsuariosRepository
from src.services.email_sender import EmailSender

nota_fiscal_bp = Blueprint('nota_fiscal', __name__)

@nota_fiscal_bp.post('/nota-fiscal')
def processar_nota_fiscal():
    http_request = HttpRequest(body=request.json)

    pedidos_manager = estruturar_pedido()
    gerador_pdf = PdfGenerator()
    email_sender = EmailSender(current_app)
    nf_manager = NotaFiscalManager(pedidos_manager, gerador_pdf, email_sender)
    http_response =  nf_manager.processar_nota_fiscal(http_request)
    return jsonify(http_response.body), http_response.status_code


def estruturar_pedido():
    pedidos_repo = PedidosRepository()
    itens_repo = ItensRepository()
    usuarios_repo = UsuariosRepository()
    restaurantes_repo = RestaurantesRepository()
    enderecos_repo = EnderecosRepository()
    produtos_repo = ProdutosRepository()
    return PedidosManager(pedidos_repo, itens_repo, usuarios_repo, restaurantes_repo, enderecos_repo, produtos_repo)

