from flask import Blueprint, jsonify, request
from src.model.repositories.usuarios_repository import UsuariosRepository
from src.controllers.enderecos_manager import EnderecosManager
from src.model.repositories.enderecos_repository import EnderecosRepository
from src.http_types.http_request import HttpRequest

endereco_route_bp = Blueprint('endereco_route', __name__)

@endereco_route_bp.post('/endereco')
def create_new_endereco():
    """
    Cadastrar novo endereço
    ---
    tags:
      - Endereços
    summary: Cadastrar novo endereço
    description: Adiciona um novo endereço para um usuário
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              data:
                type: object
                required:
                  - id_usuario
                  - attributes
                properties:
                  id_usuario:
                    type: string
                    format: uuid
                    example: "550e8400-e29b-41d4-a716-446655440000"
                  attributes:
                    type: object
                    required:
                      - logradouro
                      - bairro
                      - cidade
                      - estado
                      - pais
                      - numero
                      - tipo
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
                        example: "UF"
                      pais:
                        type: string
                        example: "País Exemplo"
                      numero:
                        type: integer
                        example: 123
                      complemento:
                        type: string
                        example: "Apto 123"
                      tipo:
                        type: string
                        enum: ["casa", "trabalho", "outro"]
                        example: "casa"
    responses:
      201:
        description: Endereço criado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Endereço criado com sucesso!"
      400:
        description: Dados inválidos
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Dados inválidos para criação de endereço"
      404:
        description: Usuário não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Usuário não encontrado!"
      409:
        description: Tipo de endereço já existe
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Esse tipo de endereço já existe!"
    """
    http_request = HttpRequest(body=request.json)

    endereco_repo = EnderecosRepository()
    users_repo = UsuariosRepository()
    endereco_manager = EnderecosManager(endereco_repo, users_repo)

    http_response = endereco_manager.create_new_endereco(http_request)

    return jsonify(http_response.body), http_response.status_code


@endereco_route_bp.get('/user/<id_usuario>/enderecos')
def get_all_enderecos(id_usuario):
    """
    Listar endereços de um usuário
    ---
    tags:
      - Endereços
    summary: Listar endereços de um usuário
    description: Retorna todos os endereços de um usuário específico
    parameters:
      - name: id_usuario
        in: path
        required: true
        description: ID do usuário
        schema:
          type: string
          format: uuid
    responses:
      200:
        description: Lista de endereços
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
                        format: uuid
                        example: "450e8400-e29b-41d4-a716-446655440000"
                      id_usuario:
                        type: string
                        format: uuid
                        example: "550e8400-e29b-41d4-a716-446655440000"
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
                        example: "UF"
                      pais:
                        type: string
                        example: "País Exemplo"
                      numero:
                        type: integer
                        example: 123
                      complemento:
                        type: string
                        example: "Apto 123"
                      tipo:
                        type: string
                        example: "casa"
      404:
        description: Usuário não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Usuário não encontrado!"
    """
    http_request = HttpRequest(params={"id_usuario": id_usuario})
    endereco_repo = EnderecosRepository()
    users_repo = UsuariosRepository()
    endereco_manager = EnderecosManager(endereco_repo, users_repo)

    http_response = endereco_manager.get_all_enderecos_by_user(http_request)
    return jsonify(http_response.body), http_response.status_code


@endereco_route_bp.put('/endereco/<id_endereco>')
def update_endereco(id_endereco):
    """
    Alterar um endereço
    ---
    tags:
      - Endereços
    summary: Alterar um endereço
    description: Atualiza os dados de um endereço específico
    parameters:
      - name: id_endereco
        in: path
        required: true
        description: ID do endereço
        schema:
          type: string
          format: uuid
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              data:
                type: object
                required:
                  - id_usuario
                  - attributes
                properties:
                  id_usuario:
                    type: string
                    format: uuid
                    example: "550e8400-e29b-41d4-a716-446655440000"
                  attributes:
                    type: object
                    properties:
                      logradouro:
                        type: string
                        example: "Nova Rua"
                      bairro:
                        type: string
                        example: "Novo Bairro"
                      cidade:
                        type: string
                        example: "Nova Cidade"
                      estado:
                        type: string
                        example: "NE"
                      pais:
                        type: string
                        example: "Novo País"
                      numero:
                        type: integer
                        example: 456
                      complemento:
                        type: string
                        example: "Bloco B"
                      tipo:
                        type: string
                        enum: ["casa", "trabalho", "outro"]
                        example: "trabalho"
    responses:
      200:
        description: Endereço atualizado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Endereço atualizado com sucesso!"
      400:
        description: Dados inválidos
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Dados inválidos para atualização de endereço"
      404:
        description: Endereço não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Endereço não encontrado!"
      409:
        description: Tipo de endereço já existe
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Esse tipo de endereço já existe!"
    """
    http_request = HttpRequest(params={"id_endereco": id_endereco}, body=request.json)

    endereco_repo = EnderecosRepository()
    endereco_manager = EnderecosManager(endereco_repo)

    http_response = endereco_manager.update(http_request)
    return jsonify(http_response.body), http_response.status_code


@endereco_route_bp.delete('/endereco/<id_endereco>')
def delete_endereco(id_endereco):
    """
    Deletar um endereço
    ---
    tags:
      - Endereços
    summary: Deletar um endereço
    description: Remove um endereço do sistema
    parameters:
      - name: id_endereco
        in: path
        required: true
        description: ID do endereço
        schema:
          type: string
          format: uuid
      - name: idUsuario
        in: query
        required: true
        description: ID do usuário
        schema:
          type: string
          format: uuid
    responses:
      200:
        description: Endereço deletado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Endereço deletado com sucesso!"
      404:
        description: Endereço não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Endereço não encontrado!"
    """
    id_usuario = request.args.get("idUsuario")
    http_request = HttpRequest(
        params={
            "id_endereco": id_endereco,
            "id_usuario": id_usuario
        }
    )

    endereco_repo = EnderecosRepository()
    users_repo = UsuariosRepository()
    endereco_manager = EnderecosManager(endereco_repo, users_repo)

    http_response = endereco_manager.delete(http_request)
    return jsonify(http_response.body), http_response.status_code