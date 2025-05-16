from src.main.server.configs import socketio
from src.model.entities.pedido import Pedido
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import NotFound, StockExceeded
from src.main.utils.response_formatter import ResponseFormatter

class PedidosManager:
    def __init__(self, pedidos_repo, itens_repo = None, usuarios_repo = None, restaurantes_repo = None, enderecos_repo = None, produtos_repo = None) -> None:
        self.pedidos_repo = pedidos_repo
        self.__itens_repo = itens_repo
        self.__usuarios_repo = usuarios_repo
        self.__restaurantes_repo = restaurantes_repo
        self.__enderecos_repo = enderecos_repo
        self.__produtos_repo = produtos_repo


    def create_new_pedido(self, http_request: HttpRequest) -> HttpResponse:
        info_pedido = http_request.body.get("pedido")
        self.__validate_data(info_pedido)
        itens = info_pedido.pop("itens")

        id_pedido = self.pedidos_repo.insert_pedido(info_pedido)
        for info_item in itens:
            self.__itens_repo.insert_item_pedido(id_pedido, info_item)
            self.__produtos_repo.subtrair_estoque(
                info_item.get("id_produto"), int(info_item.get("qtd_itens"))
            )

        socketio.emit("pedido_criado")
        return HttpResponse(
            body={
                "message": "Pedido criado com sucesso!",
                "id_pedido": id_pedido
            },
            status_code=201
        )


    def get_pedidos(self, http_request: HttpRequest):
        id_usuario = http_request.params.get("id_usuario")
        id_restaurante = http_request.params.get("id_restaurante")

        if id_usuario:
            self.__validate_usuario(id_usuario)
            pedidos = self.pedidos_repo.list_pedidos_by_usuario(id_usuario)
        elif id_restaurante:
            self.__validate_restaurante(id_restaurante)
            pedidos = self.pedidos_repo.list_pedidos_by_restaurante(id_restaurante)
        else:
            return ResponseFormatter.format_error("Id não informado", 400)
            
        pedidos_formatados = self.format_response(pedidos)
        return HttpResponse(body=pedidos_formatados, status_code=200)


    def update_pedido_status(self, http_request: HttpRequest):
        id_pedido = http_request.params.get('id_pedido')
        novo_status = http_request.body.get('status')

        if not id_pedido or not novo_status:
            return HttpResponse(body={"error": "id_pedido e status são obrigatórios"}, status_code=400)

        if not self.pedidos_repo.find_by_id(id_pedido):
            raise NotFound("Pedido")

        self.pedidos_repo.update_status(id_pedido, novo_status)
        socketio.emit("atualizar_status")
        return ResponseFormatter.display_operation("Status do pedido", "alterado")
    

    def __validate_data(self, info_pedido: dict) -> None:
        id_usuario = info_pedido.get("id_usuario")
        id_restaurante = info_pedido.get("id_restaurante")
        id_endereco = info_pedido.get("id_endereco")
        itens = info_pedido.get("itens")

        self.__validate_usuario(id_usuario)
        self.__validate_endereco(id_usuario, id_endereco)
        self.__validate_restaurante(id_restaurante)
        self.__validate_produto(id_restaurante, itens)


    def __validate_usuario(self, id_usuario: str) -> None:
        if not self.__usuarios_repo.find_by_id(id_usuario):
            raise NotFound("Usuário")


    def __validate_endereco(self, id_usuario: str, id_endereco: str) -> None:
        if not self.__enderecos_repo.find_by_id(id_endereco):
            raise NotFound("Endereço")
        
        enderecos_ids = {
            endereco.id for endereco in self.__enderecos_repo.find_all_enderecos_by_user(id_usuario)
        }
        if id_endereco not in enderecos_ids:
            raise PermissionError("O endereço não pertence a esse usuário!")
        

    def __validate_restaurante(self, id_restaurante: str) -> None:
        if not self.__restaurantes_repo.find_by_id(id_restaurante):
            raise NotFound("Restaurante")
        

    def __validate_produto(self, id_restaurante: str, itens: list) -> None:
        produtos_restaurante = {
            produto.id for produto in self.__produtos_repo.list_products_by_restaurante(id_restaurante)
        }
        for item in itens:
            id_produto = item.get("id_produto") or ""
            produto = self.__produtos_repo.find_by_id(id_produto)

            if not produto:
                raise NotFound("Produto")

            if id_produto not in produtos_restaurante:
                raise PermissionError(f"O produto '{produto.nome}' não pertence a esse restaurante!", 403)
            
            self.__verificar_qtd_estoque(produto.qtd_estoque, int(item.get("qtd_itens")))


    def __verificar_qtd_estoque(self, qtd_estoque: int, qtd_itens: int):
        if qtd_estoque < qtd_itens:
            raise StockExceeded(f"Quantidade indisponível no estoque! (Máximo: {qtd_estoque})")

            
    def format_response(self, pedidos: list[Pedido], is_nota_fiscal: bool = False) -> dict[list]:
        pedidos_formatados = []
        
        for pedido in pedidos:
            usuario = self.__usuarios_repo.find_by_id(pedido.id_usuario)
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
                "data_pedido": pedido.created_at,
                "status": pedido.status,
                "forma_pagamento": pedido.forma_pagamento.capitalize(),
                "cliente": usuario.nome,
                "email": usuario.email,
                "telefone": usuario.telefone,
                "tipo_entrega": pedido.tipo_entrega,
                "sub_total": pedido.sub_total,
                "valor_total": pedido.valor_total,
                "taxa_entrega": pedido.taxa_entrega,
                "atualizado_em": pedido.updated_at,
                "codigo": usuario.telefone[-4:],
                "restaurante": {
                    "nome": restaurante.nome or "",
                    "logo": restaurante.logo or "",
                    "cnpj": restaurante.cnpj or "",
                    "telefone": restaurante.telefone or "",
                    "endereco": restaurante.endereco if is_nota_fiscal else restaurante.endereco.to_dict()
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