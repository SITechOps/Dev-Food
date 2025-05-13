from flask import Blueprint, jsonify, request
from src.model.repositories.usuarios_repository import UsuariosRepository
from src.controllers.usuarios_manager import UsuariosManager
from src.http_types.http_request import HttpRequest

usuario_route_bp = Blueprint('user_route', __name__)

@usuario_route_bp.post('/auth/create')
def create_new_user():
    """
    Cria um novo usuário
    ---
    tags:
      - Usuários
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
                    example: Ana Souza
                  email:
                    type: string
                    example: ana.souza@gmail.com
                  telefone:
                    type: string
                    example: "11912345678"
    responses:
      "201":
        description: Usuário criado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: Usuário criado com sucesso!
                properties:
                  type: object
                  properties:
                    token:
                      type: string
                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      "409":
        description: Usuário já existe
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: Este e-mail já existe!
    """
    http_request = HttpRequest(body=request.json)
    
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.create_new_user(http_request)
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.post('/auth/login')
def login_user():
    """
    Login de usuário ou restaurante
    ---
    tags:
      - Login
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              email:
                type: string
                example: ana.souza@gmail.com
            required:
              - email
    responses:
      "200":
        description: Login realizado com sucesso (usuário ou restaurante)
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                properties:
                  type: object
                  properties:
                    token:
                      type: string
              examples:
                usuario:
                  summary: Login como usuário
                  value:
                    message: Usuário logado com sucesso!
                    properties:
                      token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                restaurante:
                  summary: Login como restaurante
                  value:
                    message: Restaurante logado com sucesso!
                    properties:
                      token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      "404":
        description: Usuário ou restaurante não encontrado
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: Usuário ou restaurante não encontrado!
              examples:
                usuario:
                  summary: Erro ao tentar logar como usuário
                  value:
                    error_message: Usuário não encontrado!
                restaurante:
                  summary: Erro ao tentar logar como restaurante
                  value:
                    error_message: Restaurante não encontrado!
    """
    http_request = HttpRequest(body=request.json)
    
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.login_user(http_request)
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.get('/users')
def get_all_users():
    """
    Listar todos os usuários
    ---
    tags:
      - Usuários
    description: Retorna uma lista de todos os usuários cadastrados
    responses:
      "200":
        description: Lista de usuários
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
                        example: "550e8400-e29b-41d4-a716-446655440000"
                      nome:
                        type: string
                        example: "Nome Exemplo"
                      email:
                        type: string
                        format: email
                        example: "exemplo@email.com"
                      telefone:
                        type: string
                        format: phone
                        example: "11948307497"
      "500":
        description: Erro no servidor
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Não foi possível conectar com o banco de dados!"
    """
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.get_all_users()
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.get('/user/<id>')
def get_user_by_id(id: str):
    http_request = HttpRequest(params={"id": id})
    
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.get_user_by_id(http_request)
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.put('/user/<id>')
def update_user(id: str):
    """
    Alterar dados de um usuário
    ---
    tags:
      - Usuários
    description: Atualiza os dados de um usuário específico
    parameters:
      - name: id
        in: path
        required: true
        description: ID do usuário
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
                properties:
                  nome:
                    type: string
                    example: "Novo Nome"
                  email:
                    type: string
                    format: email
                    example: "novo@email.com"
                  senha:
                    type: string
                    example: "nova_senha"
                  telefone:
                    type: string
                    format: phone
                    example: "11948307497"
    responses:
      "200":
        description: Usuário atualizado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                  properties:
                    id:
                      type: string
                      format: uuid
                      example: "550e8400-e29b-41d4-a716-446655440000"
                    nome:
                      type: string
                      example: "Novo Nome"
                    email:
                      type: string
                      format: email
                      example: "novo@email.com"
                    telefone:
                      type: string
                      format: phone
                      example: "11948307497"
      "400":
        description: Dados inválidos
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Ocorreu um erro ao processar seus dados!"
      "403":
        description: Alteração não permitida
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Este e-mail não pode ser alterado!"
      "404":
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
    http_request = HttpRequest(params={"id": id}, body=request.json)
    
    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.update(http_request)
    return jsonify(http_response.body), http_response.status_code


@usuario_route_bp.delete('/user/<id>')
def delete_user(id: str):
    """
    Deletar um usuário
    ---
    tags:
      - Usuários
    description: Remove um usuário do sistema
    parameters:
      - name: id
        in: path
        required: true
        description: ID do usuário
        schema:
          type: string
          format: uuid
    responses:
      "200":
        description: Usuário deletado com sucesso
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
                      example: "Usuário deletado com sucesso"
      "404":
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
    http_request = HttpRequest(params={"id": id})

    usuarios_repo = UsuariosRepository()
    usuarios_manager = UsuariosManager(usuarios_repo)

    http_response = usuarios_manager.delete(http_request)
    return jsonify(http_response.body), http_response.status_code