from src.model.repositories.pedidos_repository import PedidosRepository
from src.model.repositories.itens_repository import ItensRepository
from src.model.repositories.usuarios_repository import UsuariosRepository
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.model.repositories.produtos_repository import ProdutosRepository
from src.model.repositories.enderecos_repository import EnderecosRepository
from src.model.configs.connection import DBConnectionHandler
from datetime import datetime, timedelta

def load_pedidos_exemplo():
    with DBConnectionHandler() as db:
        usuarios_repo = UsuariosRepository()
        restaurantes_repo = RestaurantesRepository()
        produtos_repo = ProdutosRepository()
        enderecos_repo = EnderecosRepository()
        pedidos_repo = PedidosRepository()
        itens_repo = ItensRepository()

        if usuarios_repo.find_by_email("teste@devfood.com"): return

        id_usuario = usuarios_repo.insert({
            "nome": "Usuário Teste",
            "email": "teste@devfood.com",
            "telefone": "11987654321"
        })
        endereco_data = {
            "logradouro": "Rua Saraiva Leão",
            "bairro": "Jardim Colorado",
            "cidade": "São Paulo",
            "estado": "SP",
            "numero": "38",
            "complemento": "Bloco A",
            "tipo": "casa"
        }
        id_endereco = enderecos_repo.create(id_usuario, endereco_data)
        restaurante = restaurantes_repo.list_all()[0]
        produtos = produtos_repo.list_products_by_restaurante(restaurante.id)

        if not restaurante or not id_endereco or len(produtos) < 2:
            print("Dados insuficientes para criar pedidos.")
            return
        
        data_ontem = (datetime.now() - timedelta(days=1)).replace(hour=12, minute=30, second=10, microsecond=0)
        data_3_dias_atras = (datetime.now() - timedelta(days=3)).replace(hour=16, minute=45, second=20, microsecond=0)
                
        pedidos = [
            {
                "valor_total": 100.00,
                "id_usuario": id_usuario,
                "id_restaurante": restaurante.id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Cartão",
                "status": "Concluído",
                "tipo_entrega": "Agora",
                "itens": [
                    {"id_produto": produtos[0].id, "qtd_itens": 2, "valor_calculado": 50.00},
                    {"id_produto": produtos[1].id, "qtd_itens": 1, "valor_calculado": 50.00},
                ],
            },
            {
                "valor_total": 200.00,
                "id_usuario": id_usuario,
                "id_restaurante": restaurante.id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Pix",
                "status": "Concluído",
                "tipo_entrega": "Agendado",
                "created_at": data_ontem,
                "updated_at": data_ontem,
                "itens": [
                    {"id_produto": produtos[0].id, "qtd_itens": 4, "valor_calculado": 200.00},
                ],
            },
            {
                "valor_total": 150.00,
                "id_usuario": id_usuario,
                "id_restaurante": restaurante.id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Dinheiro",
                "status": "Pendente",
                "tipo_entrega": "Agora",
                "created_at": data_3_dias_atras,
                "updated_at": data_3_dias_atras,
                "itens": [
                    {"id_produto": produtos[1].id, "qtd_itens": 3, "valor_calculado": 150.00},
                ],
            },
        ]

        for pedido_data in pedidos:
            pedido_info = {key: pedido_data[key] for key in pedido_data if key != "itens"}
            id_pedido = pedidos_repo.insert_pedido(pedido_info)

            for item in pedido_data["itens"]:
                itens_repo.insert_item_pedido(id_pedido, item)