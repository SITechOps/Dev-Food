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
    """
    Criação de um novo pedido
    ---
    tags:
      - Pedidos
    description: Endpoint para criar um novo pedido com os detalhes fornecidos.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              pedido:
                type: object
                properties:
                  id_usuario:
                    type: string
                    format: uuid
                    description: ID do usuário que está fazendo o pedido.
                    example: "4b2867ee-8c88-41ed-ac05-8df6bd5d0bce"
                  id_endereco:
                    type: string
                    format: uuid
                    description: ID do endereço de entrega.
                    example: "7ab64fbd-c3c5-4cc8-9ff3-4906dbba226b"
                  id_restaurante:
                    type: string
                    format: uuid
                    description: ID do restaurante.
                    example: "648168e4-3896-4b47-9df8-bd35d5f05a1c"
                  forma_pagamento:
                    type: string
                    description: Forma de pagamento escolhida.
                    example: "Pix"
                  tipo_entrega:
                    type: string
                    description: Tipo de entrega (Rápida / Padrão)
                    example: "Rápida"
                  sub_total:
                    type: number
                    format: float
                    description: Subtotal do pedido.
                    example: 40.00
                  taxa_entrega:
                    type: number
                    format: float
                    description: Taxa de entrega.
                    example: 8.00
                  valor_total:
                    type: number
                    format: float
                    description: Valor total do pedido.
                    example: 48.00
                  itens:
                    type: array
                    items:
                      type: object
                      properties:
                        id_produto:
                          type: string
                          format: uuid
                          description: ID do produto.
                          example: "043786b1-d405-4967-8362-058c630d73a2"
                        qtd_itens:
                          type: integer
                          description: Quantidade de itens.
                          example: 1
                        valor_calculado:
                          type: number
                          format: float
                          description: Valor calculado para o item.
                          example: 20.00
    responses:
      201:
        description: Pedido criado com sucesso.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Pedido criado com sucesso!"
    """
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


@pedido_route_bp.get('/pedidos')
def get_all_pedidos():
    """
    Listar todos os pedidos
    ---
    tags:
      - Pedidos
    summary: Retorna todos os pedidos cadastrados no sistema
    description: Lista completa de pedidos com os detalhes do cliente, restaurante, itens e status.
    responses:
      200:
        description: Lista de pedidos retornada com sucesso.
        content:
          application/json:
            schema:
              type: object
              properties:
                pedidos:
                  type: array
                  items:
                    type: object
                    properties:
                      Id:
                        type: string
                        description: ID do pedido.
                        example: "1110"
                      atualizado_em:
                        type: string
                        format: date-time
                        example: "2025-05-06T16:45:20Z"
                      cliente:
                        type: string
                        example: "Usuário Teste"
                      codigo:
                        type: string
                        example: "4321"
                      data_pedido:
                        type: string
                        format: date-time
                        example: "2025-05-06T16:45:20Z"
                      email:
                        type: string
                        format: email
                        example: "teste@devfood.com"
                      endereco:
                        type: object
                        properties:
                          bairro:
                            type: string
                            example: "Jardim Colorado"
                          cidade:
                            type: string
                            example: "São Paulo"
                          complemento:
                            type: string
                            example: "Bloco A"
                          estado:
                            type: string
                            example: "SP"
                          logradouro:
                            type: string
                            example: "Rua Saraiva Leão"
                          numero:
                            type: integer
                            example: 38
                      forma_pagamento:
                        type: string
                        example: "Cartão"
                      itens:
                        type: array
                        items:
                          type: object
                          properties:
                            produto:
                              type: string
                              example: "Guacamole com Nachos"
                            qtd_itens:
                              type: integer
                              example: 3
                            valor_calculado:
                              type: number
                              format: float
                              example: 150.00
                      restaurante:
                        type: object
                        properties:
                          cnpj:
                            type: string
                            example: "78945612398765"
                          endereco:
                            type: object
                            properties:
                              bairro:
                                type: string
                                example: "Vila Mariana"
                              cidade:
                                type: string
                                example: "São Paulo"
                              complemento:
                                type: string
                                example: "Loja 2"
                              estado:
                                type: string
                                example: "SP"
                              id:
                                type: string
                                format: uuid
                                example: "16c301d6-8c87-4c1e-aa49-a37de6cf7ca5"
                              logradouro:
                                type: string
                                example: "Rua dos Três Irmãos"
                              numero:
                                type: integer
                                example: 500
                              pais:
                                type: string
                                example: "Brasil"
                          logo:
                            type: string
                            example: "/img/restaurantes/la-taqueria.webp"
                          nome:
                            type: string
                            example: "La Taquería"
                          telefone:
                            type: string
                            example: "(11) 5678-9012"
                      status:
                        type: string
                        example: "Pendente"
                      sub_total:
                        type: number
                        format: float
                        example: 150.00
                      taxa_entrega:
                        type: number
                        format: float
                        example: 10.00
                      telefone:
                        type: string
                        example: "11987654321"
                      tipo_entrega:
                        type: string
                        example: "Padrão"
                      valor_total:
                        type: number
                        format: float
                        example: 160.00
      500:
        description: Erro ao listar pedidos
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
                  example: "Erro interno ao buscar pedidos"
    """
    pedidos_repo = PedidosRepository()
    itens_repo = ItensRepository()
    usuarios_repo = UsuariosRepository()
    restaurantes_repo = RestaurantesRepository()
    enderecos_repo = EnderecosRepository()
    produtos_repo = ProdutosRepository()

    pedidos_manager = PedidosManager(
        pedidos_repo, itens_repo, usuarios_repo, restaurantes_repo, enderecos_repo, produtos_repo
    )

    http_response = pedidos_manager.get_all_pedidos()
    return jsonify(http_response.body), http_response.status_code


@pedido_route_bp.get('/pedidos/usuario/<id>')
@pedido_route_bp.get('/pedidos/restaurante/<id>')
def get_pedidos(id):
    """
    Listar pedidos por usuário ou restaurante
    ---
    tags:
      - Pedidos
    description: Retorna uma lista de pedidos com detalhes do cliente, restaurante e itens.
    responses:
      200:
        description: Lista de pedidos retornada com sucesso.
        content:
          application/json:
            schema:
              type: object
              properties:
                pedidos:
                  type: array
                  items:
                    type: object
                    properties:
                      Id:
                        type: string
                        description: ID do pedido.
                        example: "1110"
                      atualizado_em:
                        type: string
                        format: date-time
                        description: "Data de atualização do pedido."
                        example: "2025-05-06T16:45:20Z"
                      cliente:
                        type: string
                        description: "Nome do cliente."
                        example: "Usuário Teste"
                      codigo:
                        type: string
                        description: "Código do pedido."
                        example: "4321"
                      data_pedido:
                        type: string
                        format: date-time
                        description: "Data do pedido."
                        example: "2025-05-06T16:45:20Z"
                      email:
                        type: string
                        format: email
                        description: "Email do cliente."
                        example: "teste@devfood.com"
                      endereco:
                        type: object
                        properties:
                          bairro:
                            type: string
                            example: "Jardim Colorado"
                          cidade:
                            type: string
                            example: "São Paulo"
                          complemento:
                            type: string
                            example: "Bloco A"
                          estado:
                            type: string
                            example: "SP"
                          logradouro:
                            type: string
                            example: "Rua Saraiva Leão"
                          numero:
                            type: integer
                            example: 38
                      forma_pagamento:
                        type: string
                        description: "Forma de pagamento."
                        example: "Cartão"
                      itens:
                        type: array
                        items:
                          type: object
                          properties:
                            produto:
                              type: string
                              description: "Nome do produto."
                              example: "Guacamole com Nachos"
                            qtd_itens:
                              type: integer
                              description: "Quantidade de itens."
                              example: 3
                            valor_calculado:
                              type: number
                              format: float
                              description: "Valor calculado."
                              example: 150.00
                      restaurante:
                        type: object
                        properties:
                          cnpj:
                            type: string
                            example: "78945612398765"
                          endereco:
                            type: object
                            properties:
                              bairro:
                                type: string
                                example: "Vila Mariana"
                              cidade:
                                type: string
                                example: "São Paulo"
                              complemento:
                                type: string
                                example: "Loja 2"
                              estado:
                                type: string
                                example: "SP"
                              id:
                                type: string
                                format: uuid
                                example: "16c301d6-8c87-4c1e-aa49-a37de6cf7ca5"
                              logradouro:
                                type: string
                                example: "Rua dos Três Irmãos"
                              numero:
                                type: integer
                                example: 500
                              pais:
                                type: string
                                example: "Brasil"
                          logo:
                            type: string
                            example: "/img/restaurantes/la-taqueria.webp"
                          nome:
                            type: string
                            example: "La Taquería"
                          telefone:
                            type: string
                            example: "(11) 5678-9012"
                      status:
                        type: string
                        description: "Status do pedido."
                        example: "Pendente"
                      sub_total:
                        type: number
                        format: float
                        example: 150.00
                      taxa_entrega:
                        type: number
                        format: float
                        example: 10.00
                      telefone:
                        type: string
                        example: "11987654321"
                      tipo_entrega:
                        type: string
                        example: "Padrão"
                      valor_total:
                        type: number
                        format: float
                        example: 160.00
    """
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
    """
    Atualizar status do pedido
    ---
    tags:
      - Pedidos
    description: Atualiza o status de um pedido existente.
    parameters:
      - in: path
        name: id
        required: true
        description: ID do pedido a ser atualizado.
        example: "1110"
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
              status:
                type: string
                description: Novo status do pedido.
                example: "Pendente"
    responses:
      200:
        description: Status do pedido atualizado com sucesso.
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Status do pedido alterado com sucesso!"
      404:
        description: Pedido não encontrado.
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Pedido não encontrado!"
    """
    http_request = HttpRequest(body=request.json, params={"id_pedido":id})
    
    pedidos_repo = PedidosRepository()
    pedidos_manager = PedidosManager(pedidos_repo)
    
    http_response = pedidos_manager.update_pedido_status(http_request)
    return jsonify(http_response.body), http_response.status_code