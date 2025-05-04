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
        
        restaurantes = restaurantes_repo.list_all()
        
        if not restaurantes or len(restaurantes) < 3 or not id_endereco:
            print("Dados insuficientes para criar pedidos. Necessário pelo menos 3 restaurantes.")
            return
        
        data_ontem = (datetime.now() - timedelta(days=1)).replace(hour=12, minute=30, second=10, microsecond=0)
        data_3_dias_atras = (datetime.now() - timedelta(days=3)).replace(hour=16, minute=45, second=20, microsecond=0)
        
        pedidos = []
        
        produtos_r1 = produtos_repo.list_products_by_restaurante(restaurantes[0].id)
        if len(produtos_r1) >= 2:
            pedidos.append({
                "valor_total": 100.00,
                "id_usuario": id_usuario,
                "id_restaurante": restaurantes[0].id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Cartão",
                "status": "Entregue",
                "tipo_entrega": "Padrão",
                "itens": [
                    {"id_produto": produtos_r1[0].id, "qtd_itens": 2, "valor_calculado": 50.00},
                    {"id_produto": produtos_r1[1].id, "qtd_itens": 1, "valor_calculado": 50.00},
                ],
            })
        
        produtos_r2 = produtos_repo.list_products_by_restaurante(restaurantes[1].id)
        if len(produtos_r2) >= 1:
            pedidos.append({
                "valor_total": 200.00,
                "id_usuario": id_usuario,
                "id_restaurante": restaurantes[1].id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Pix",
                "status": "Entregue",
                "tipo_entrega": "Rápida",
                "created_at": data_ontem,
                "updated_at": data_ontem,
                "itens": [
                    {"id_produto": produtos_r2[0].id, "qtd_itens": 4, "valor_calculado": 200.00},
                ],
            })
        
        produtos_r3 = produtos_repo.list_products_by_restaurante(restaurantes[2].id)
        if len(produtos_r3) >= 1:
            pedidos.append({
                "valor_total": 150.00,
                "id_usuario": id_usuario,
                "id_restaurante": restaurantes[2].id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Dinheiro",
                "status": "Pendente",
                "tipo_entrega": "Padrão",
                "created_at": data_3_dias_atras,
                "updated_at": data_3_dias_atras,
                "itens": [
                    {"id_produto": produtos_r3[0].id, "qtd_itens": 3, "valor_calculado": 150.00},
                ],
            })

        for pedido_data in pedidos:
            pedido_info = {key: pedido_data[key] for key in pedido_data if key != "itens"}
            id_pedido = pedidos_repo.insert_pedido(pedido_info)

            for item in pedido_data["itens"]:
                itens_repo.insert_item_pedido(id_pedido, item)