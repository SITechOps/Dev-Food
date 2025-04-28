from src.model.entities.pedido import Pedido
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import NotFound
from src.main.utils.response_formatter import ResponseFormatter

class PedidosManager:
    def __init__(self, pedidos_repo, itens_repo = None, restaurantes_repo = None, enderecos_repo = None, produtos_repo = None) -> None:
        self.__pedidos_repo = pedidos_repo
        self.__itens_repo = itens_repo
        self.__restaurantes_repo = restaurantes_repo
        self.__enderecos_repo = enderecos_repo
        self.__produtos_repo = produtos_repo


    def create_new_pedido(self, http_request: HttpRequest) -> HttpResponse:
        info_pedido = http_request.body.get("pedido")
        itens = info_pedido.pop("itens")

        id_pedido = self.__pedidos_repo.insert_pedido(info_pedido)

        for info_item in itens:
            self.__itens_repo.insert_item_pedido(id_pedido, info_item)

        return ResponseFormatter.display_operation("Pedido", "criado")
    

    def get_pedidos(self, http_request: HttpRequest):
        id_usuario = http_request.params.get("id_usuario")
        id_restaurante = http_request.params.get("id_restaurante")

        if id_usuario:
            pedidos = self.__pedidos_repo.list_pedidos_by_usuario(id_usuario)
        elif id_restaurante:
            pedidos = self.__pedidos_repo.list_pedidos_by_restaurante(id_restaurante)
        else:
            return ResponseFormatter.format_error("Id não informado", 400)
                
        pedidos_formatados = self.__format_response(pedidos)
        return HttpResponse(body=pedidos_formatados, status_code=200)


    def update_pedido_status(self, http_request: HttpRequest):
        id_pedido = http_request.params.get('id_pedido')
        novo_status = http_request.body.get('status')

        if not id_pedido or not novo_status:
            return HttpResponse(body={"error": "id_pedido e status são obrigatórios"}, status_code=400)

        if not self.__pedidos_repo.get_by_id(id_pedido):
            raise NotFound("Pedido")

        self.__pedidos_repo.update_status(id_pedido, novo_status)
        return ResponseFormatter.display_operation("Status do pedido", "alterado")
        

    def __format_response(self, pedidos: list[Pedido]) -> dict[list]:
        pedidos_formatados = []
        
        for pedido in pedidos:
            restaurante = self.__restaurantes_repo.find_by_id(pedido.id_restaurante)
            endereco = self.__enderecos_repo.find_by_id(pedido.id_endereco)
            itens = self.__itens_repo.list_items_by_pedido(pedido.id)

            itens_formatados = []
            for item in itens:
                produto = self.__produtos_repo.find_by_id(item.id_produto)
                itens_formatados.append({
                    "produto": produto.nome or "",
                    "qtd_itens": item.qtd_itens,
                    "valor_calculado": item.valor_calculado,
                })

            pedidos_formatados.append({
                "Id": pedido.id,
                "valor_total": pedido.valor_total,
                "data_pedido": pedido.created_at,
                "forma_pagamento": pedido.forma_pagamento,
                "status": pedido.status,
                "restaurante": {
                    "nome": restaurante.nome or "",
                    "logo": restaurante.logo or "",
                },
                "endereco": {
                    "logradouro": endereco.logradouro or "",
                    "bairro": endereco.bairro or "",
                    "cidade": endereco.cidade or "",
                    "estado": endereco.estado or "",
                    "numero": endereco.numero or "",
                    "complemento": endereco.complemento or "",
                },
                "itens": itens_formatados,
            })

        return {"pedidos": pedidos_formatados}
