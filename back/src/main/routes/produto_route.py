from flask import Blueprint, jsonify, request, current_app, send_from_directory
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
    image_file = request.files.get('image')

    produto_info = {
        "nome": request.form.get("nome"),
        "valor_unitario": float(request.form.get("valor_unitario")),
        "qtd_estoque": int(request.form.get("qtd_estoque")),
        "descricao": request.form.get("descricao"),
    }

    http_request = HttpRequest(
        params={"id_produto": id},
        body={"data": produto_info}
    )

    produtos_repo = ProdutosRepository()
    produtos_manager = ProdutosManager(produtos_repo)

    http_response = produtos_manager.update(http_request, image_file)

    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.delete('/produto/<id>')
def delete_produto(id: str):
    http_request = HttpRequest(params={"id_produto": id})

    produtos_repo = ProdutosRepository()
    produtos_manager = ProdutosManager(produtos_repo)

    http_response = produtos_manager.delete(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.post('/produto/upload-image/<id>')
def upload_produto_image(id):
    if 'image' not in request.files:
        return jsonify({'error': 'Arquivo não enviado'}), 400

    file = request.files['image']
    
    http_request = HttpRequest(params={"id_produto": id})

    produtos_repo = ProdutosRepository()
    produtos_manager = ProdutosManager(produtos_repo)

    http_response = produtos_manager.update_image(http_request, file)
    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.get('/produto/images/<path:filename>')
def serve_produto_image(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_folder, filename)
