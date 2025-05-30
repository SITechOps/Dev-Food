from flask import Blueprint, jsonify, request, current_app, send_from_directory
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.controllers.produtos_manager import ProdutosManager
from src.model.repositories.produtos_repository import ProdutosRepository
from src.http_types.http_request import HttpRequest
import os

produto_route_bp = Blueprint('produto_route', __name__)

@produto_route_bp.post('/produto')
def create_new_produto():
    """
    Criar novo produto
    ---
    tags:
      - Produtos
    summary: Criar novo produto
    description: Adiciona um novo produto ao banco de dados.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              data:
                type: object
                properties:
                  nome:
                    type: string
                  valor_unitario:
                    type: number
                    format: float
                  qtd_estoque:
                    type: integer
            required:
              - nome
              - valor_unitario
              - qtd_estoque
          example:
            data:
              nome: "Pizza de Mussarela"
              valor_unitario: 52.00
              qtd_estoque: 100
    responses:
      "201":
        description: Produto criado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Produto criado com sucesso!"
      "404":
        description: Restaurante não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Restaurante não encontrado!"
      "409":
        description: Produto já existe
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Produto já existe!"
    """
    http_request = HttpRequest(body=request.json)
    
    produtos_repo = ProdutosRepository()
    restaurantes_repo = RestaurantesRepository()
    produtos_manager = ProdutosManager(produtos_repo, restaurantes_repo)

    http_response = produtos_manager.create_new_produto(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.get('/restaurante/<id>/produtos')
def get_products_by_restaurant(id: str):
    """
    Listar produtos por restaurante
    ---
    tags:
      - Produtos
    summary: Listar produtos por restaurante
    description: Retorna a lista de produtos de um restaurante específico.
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
        description: ID do restaurante
    responses:
      "200":
        description: Lista de produtos do restaurante
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: string
                      nome:
                        type: string
                      qtd_estoque:
                        type: integer
                      valor_unitario:
                        type: number
                        format: float
      "404":
        description: Restaurante não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Restaurante não encontrado!"
    """
    http_request = HttpRequest(params={"id_restaurante": id})

    produtos_repo = ProdutosRepository()
    restaurantes_repo = RestaurantesRepository()
    produtos_manager = ProdutosManager(produtos_repo, restaurantes_repo)

    http_response = produtos_manager.get_products_by_restaurante(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.get('/produtos')
def get_all_products():
    """
    Listar todos os produtos
    ---
    tags:
      - Produtos
    summary: Retorna a lista de produtos disponíveis
    description: Retorna todos os produtos cadastrados, com informações como nome, descrição, valor, quantidade em estoque e URL da imagem.
    responses:
      "200":
        description: Lista de produtos retornada com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: array
                  items:
                    type: object
                    properties:
                      id:
                        type: string
                      nome:
                        type: string
                      descricao:
                        type: string
                      valor_unitario:
                        type: number
                        format: float
                      qtd_estoque:
                        type: integer
                      image_url:
                        type: string
    """
    produtos_repo = ProdutosRepository()
    produtos_manager = ProdutosManager(produtos_repo)

    http_response = produtos_manager.get_all_products()
    
    return jsonify(http_response.body), http_response.status_code


@produto_route_bp.put('/produto/<id>')
def update_produto(id: str):
    """
    Atualizar produto
    ---
    tags:
      - Produtos
    summary: Atualizar produto
    description: Atualiza os dados de um produto existente.
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
        description: ID do produto
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              data:
                type: object
                properties:
                  nome:
                    type: string
                  valor_unitario:
                    type: number
                    format: float
                  qtd_estoque:
                    type: integer
            required:
              - nome
              - valor_unitario
              - qtd_estoque
          example:
            data:
              nome: "Sushimi de Salmão - Atualizado"
              valor_unitario: 50.00
              qtd_estoque: 45
    responses:
      "200":
        description: Produto alterado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Produto alterado com sucesso."
      "404":
        description: Produto não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Produto não encontrado!"
      "409":
        description: Produto já existe
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Produto já existe!"
    """
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
    """
    Excluir produto
    ---
    tags:
      - Produtos
    summary: Excluir produto
    description: Deleta um produto existente.
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
        description: ID do produto
    responses:
      "200":
        description: Produto deletado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Produto deletado com sucesso."
      "404":
        description: Produto não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Produto não encontrado!"
    """
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


@produto_route_bp.get('/produto/<path:filename>')
def serve_produto_image(filename):
    image_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'produto')
    return send_from_directory(image_folder, filename)