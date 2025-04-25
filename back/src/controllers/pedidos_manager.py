from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import NotFound
from src.main.utils.response_formatter import ResponseFormatter

class PedidosManager:
    def __init__(self, pedidos_repo, itens_repo, restaurantes_repo = None, enderecos_repo = None, produtos_repo = None) -> None:
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
    

    def get_pedidos_by_user(self, http_request: HttpRequest):
        id_usuario = http_request.params.get("id_usuario")
        pedidos = self.__pedidos_repo.list_products_by_user(id_usuario)
        
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

        return HttpResponse(body={"pedidos": pedidos_formatados}, status_code=200)
