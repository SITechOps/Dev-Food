from flask import Blueprint, jsonify, request, current_app, send_from_directory
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.controllers.restaurantes_manager import RestaurantesManager
from src.http_types.http_request import HttpRequest
import os
import json

restaurante_route_bp = Blueprint('restaurante_route', __name__)

@restaurante_route_bp.post('/restaurante')
def create_new_restaurant():
    """
    Criar um novo restaurante
    ---
    tags:
      - Restaurantes
    summary: Criar um novo restaurante
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
                  descricao:
                    type: string
                  email:
                    type: string
                    format: email
                  cnpj:
                    type: string
                  razao_social:
                    type: string
                  especialidade:
                    type: string
                  telefone:
                    type: string
                  horario_funcionamento:
                    type: string
                  banco:
                    type: string
                  agencia:
                    type: string
                  nro_conta:
                    type: string
                  tipo_conta:
                    type: string
                  endereco:
                    type: object
                    properties:
                      logradouro:
                        type: string
                      bairro:
                        type: string
                      cidade:
                        type: string
                      estado:
                        type: string
                      pais:
                        type: string
                      numero:
                        type: integer
                      complemento:
                        type: string
    responses:
      "201":
        description: Restaurante criado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Restaurante criado com sucesso!"
                properties:
                  type: object
                  properties:
                    token:
                      type: string
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      "400":
        description: Requisição inválida
    """
    http_request = HttpRequest(body=request.json)

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.create_new_restaurant(http_request)
    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.get('/restaurantes')
def get_all_restaurants():
    """
    Listar todos os restaurantes
    ---
    tags:
      - Restaurantes
    summary: Listar todos os restaurantes
    responses:
      "200":
        description: Lista de restaurantes
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
                        example: "550e8400-e29b-41d4-a716-446655440000"
                      nome:
                        type: string
                        example: "Restaurante Exemplo"
                      descricao:
                        type: string
                        example: "Descrição do restaurante"
                      email:
                        type: string
                        example: "restaurante@email.com"
                      cnpj:
                        type: string
                        example: "12.345.678/0001-99"
                      razao_social:
                        type: string
                        example: "Razão Social Exemplo"
                      especialidade:
                        type: string
                        example: "Comida Japonesa"
                      telefone:
                        type: string
                        example: "11987654321"
                      horario_funcionamento:
                        type: string
                        example: "10:00 - 22:00"
                      banco:
                        type: string
                        example: "Banco Exemplo"
                      agencia:
                        type: string
                        example: "1234"
                      nro_conta:
                        type: string
                        example: "12345-6"
                      tipo_conta:
                        type: string
                        example: "corrente"
                      endereco:
                        type: object
                        properties:
                          logradouro:
                            type: string
                            example: "Rua Exemplo"
                          bairro:
                            type: string
                            example: "Bairro Exemplo"
                          cidade:
                            type: string
                            example: "Cidade Exemplo"
                          estado:
                            type: string
                            example: "SP"
                          pais:
                            type: string
                            example: "Brasil"
                          numero:
                            type: integer
                            example: 123
                          complemento:
                            type: string
                            example: "Apto 45"
    """
    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.get_all_restaurants()
    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.get('/restaurante/<id>')
def get_restaurant_by_id(id):
    """
    Obter restaurante por ID
    ---
    tags:
      - Restaurantes
    summary: Obter restaurante por ID
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
        description: ID do restaurante
    responses:
      "200":
        description: Dados do restaurante
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  example: "550e8400-e29b-41d4-a716-446655440000"
                nome:
                  type: string
                  example: "Restaurante Exemplo"
                descricao:
                  type: string
                  example: "Descrição do restaurante"
                email:
                  type: string
                  example: "restaurante@email.com"
                cnpj:
                  type: string
                  example: "12.345.678/0001-99"
                razao_social:
                  type: string
                  example: "Razão Social Exemplo"
                especialidade:
                  type: string
                  example: "Comida Japonesa"
                telefone:
                  type: string
                  example: "11987654321"
                horario_funcionamento:
                  type: string
                  example: "10:00 - 22:00"
                banco:
                  type: string
                  example: "Banco Exemplo"
                agencia:
                  type: string
                  example: "1234"
                nro_conta:
                  type: string
                  example: "12345-6"
                tipo_conta:
                  type: string
                  example: "corrente"
                endereco:
                  type: object
                  properties:
                    logradouro:
                      type: string
                      example: "Rua Exemplo"
                    bairro:
                      type: string
                      example: "Bairro Exemplo"
                    cidade:
                      type: string
                      example: "Cidade Exemplo"
                    estado:
                      type: string
                      example: "SP"
                    pais:
                      type: string
                      example: "Brasil"
                    numero:
                      type: integer
                      example: 123
                    complemento:
                      type: string
                      example: "Apto 45"
      "404":
        description: Restaurante não encontrado
    """
    http_request = HttpRequest(params={"id": id})

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.get_restaurant_by_id(http_request)

    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.patch('/restaurante/<id>')
def update_restaurant(id):
    """
    Atualizar dados do restaurante
    ---
    tags:
      - Restaurantes
    summary: Atualizar dados do restaurante
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
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
                  agencia:
                    type: string
                  banco:
                    type: string
                  cnpj:
                    type: string
                  email:
                    type: string
                  especialidade:
                    type: string
                  horario_funcionamento:
                    type: string
                  nome:
                    type: string
                  descricao:
                    type: string
                  nro_conta:
                    type: string
                  razao_social:
                    type: string
                  telefone:
                    type: string
                  tipo_conta:
                    type: string
    responses:
      "200":
        description: Restaurante atualizado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  example: "550e8400-e29b-41d4-a716-446655440000"
                nome:
                  type: string
                  example: "Restaurante Exemplo"
                descricao:
                  type: string
                  example: "Descrição do restaurante"
                email:
                  type: string
                  example: "restaurante@email.com"
                cnpj:
                  type: string
                  example: "12.345.678/0001-99"
                razao_social:
                  type: string
                  example: "Razão Social Exemplo"
                especialidade:
                  type: string
                  example: "Comida Japonesa"
                telefone:
                  type: string
                  example: "11987654321"
                horario_funcionamento:
                  type: string
                  example: "10:00 - 22:00"
                banco:
                  type: string
                  example: "Banco Exemplo"
                agencia:
                  type: string
                  example: "1234"
                nro_conta:
                  type: string
                  example: "12345-6"
                tipo_conta:
                  type: string
                  example: "corrente"
      "404":
        description: Restaurante não encontrado
    """
    http_request = HttpRequest(params={"id": id}, body=request.json)
    image_file = request.files.get('image')
    raw_data = request.form.get("data")
    try:
        parsed_data = json.loads(raw_data) if raw_data else {}
    except json.JSONDecodeError:
        return jsonify({"error": "Formato JSON inválido no campo 'data'."}), 400

    http_request = HttpRequest(
        params={"id": id},
        body={"data": parsed_data}
    )

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)
    http_response = restaurante_manager.update(http_request, image_file)

    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.patch('/restaurante/<id>/financeiro')
def update_dados_bancarios(id):
    """
    Atualizar dados financeiros do restaurante
    ---
    tags:
      - Restaurantes
    summary: Atualizar dados financeiros do restaurante
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
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
                  banco:
                    type: string
                    example: "Banco Exemplo"
                  agencia:
                    type: string
                    example: "1234"
                  nro_conta:
                    type: string
                    example: "12345-6"
                  tipo_conta:
                    type: string
                    example: "corrente"
    responses:
      "200":
        description: Dados financeiros atualizados com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                banco:
                  type: string
                  example: "Banco Exemplo"
                agencia:
                  type: string
                  example: "1234"
                nro_conta:
                  type: string
                  example: "12345-6"
                tipo_conta:
                  type: string
                  example: "corrente"
      "404":
        description: Restaurante não encontrado
    """
    http_request = HttpRequest(params={"id": id}, body=request.json)

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.update_financeiro(http_request)

    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.put('/restaurante/endereco/<id>')
def update_endereco(id):
    """
    Atualizar endereço do restaurante
    ---
    tags:
      - Restaurantes
    summary: Atualizar endereço do restaurante
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
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
                  attributes:
                    type: object
                    properties:
                      logradouro:
                        type: string
                        example: "Rua Exemplo"
                      bairro:
                        type: string
                        example: "Bairro Exemplo"
                      cidade:
                        type: string
                        example: "Cidade Exemplo"
                      estado:
                        type: string
                        example: "SP"
                      pais:
                        type: string
                        example: "Brasil"
                      numero:
                        type: integer
                        example: 123
                      complemento:
                        type: string
                        example: "Apto 45"
                      tipo:
                        type: string
                        example: "comercial"
    responses:
      "200":
        description: Endereço atualizado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                endereco:
                  type: object
                  properties:
                    logradouro:
                      type: string
                      example: "Rua Exemplo"
                    bairro:
                      type: string
                      example: "Bairro Exemplo"
                    cidade:
                      type: string
                      example: "Cidade Exemplo"
                    estado:
                      type: string
                      example: "SP"
                    pais:
                      type: string
                      example: "Brasil"
                    numero:
                      type: integer
                      example: 123
                    complemento:
                      type: string
                      example: "Apto 45"
                    tipo:
                      type: string
                      example: "comercial"
      "404":
        description: Restaurante não encontrado
    """
    http_request = HttpRequest(params={"id": id}, body=request.json)

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.update_endereco(http_request)

    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.delete('/restaurante/<id>')
def delete_restaurant(id):
    """
    Deletar restaurante por ID
    ---
    tags:
      - Restaurantes
    summary: Deletar restaurante por ID
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
    responses:
      "200":
        description: Restaurante deletado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  properties:
                    message:
                      type: string
                      example: "Restaurante deletado com sucesso"
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
    http_request = HttpRequest(params={"id": id})

    restaurante_repo = RestaurantesRepository()
    restaurante_manager = RestaurantesManager(restaurante_repo)

    http_response = restaurante_manager.delete(http_request)
    
    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.post('/restaurante/upload-image/<id>')
def upload_restaurante_image(id):
    """
    Upload de imagem do restaurante
    ---
    tags:
      - Restaurantes
    summary: Upload de imagem do restaurante
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
        description: ID do restaurante
    requestBody:
      required: true
      content:
        multipart/form-data:
          schema:
            type: object
            properties:
              image:
                type: string
                format: binary
    responses:
      "200":
        description: Imagem enviada com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Imagem enviada com sucesso"
                image_url:
                  type: string
                  example: "/restaurante/images/550e8400-e29b-41d4-a716-446655440000.jpg"
      "400":
        description: Arquivo não enviado
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Arquivo não enviado"
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
    if 'image' not in request.files:
        return jsonify({'error': 'Arquivo não enviado'}), 400

    file = request.files['image']
    http_request = HttpRequest(params={"id_restaurante": id})

    restaurantes_repo = RestaurantesRepository()
    restaurantes_manager = RestaurantesManager(restaurantes_repo)

    http_response = restaurantes_manager.update_image(http_request, file)
    return jsonify(http_response.body), http_response.status_code


@restaurante_route_bp.get('/restaurante/images/<path:filename>')
def serve_restaurante_image(filename):
    """
    Servir imagem do restaurante
    ---
    tags:
      - Restaurantes
    summary: Servir imagem do restaurante
    parameters:
      - name: filename
        in: path
        required: true
        schema:
          type: string
        description: Nome do arquivo de imagem
    responses:
      "200":
        description: Imagem retornada com sucesso
        content:
          image/*:
            schema:
              type: string
              format: binary
      "404":
        description: Imagem não encontrada
    """
    upload_folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(os.path.join(upload_folder, 'restaurante/images'), filename)

