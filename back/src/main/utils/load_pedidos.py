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

        if usuarios_repo.find_by_email("teste@devfood.com"):
            return

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
            "pais": "Brasil",
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

        # Pedido 1
        produtos_r1 = produtos_repo.list_products_by_restaurante(restaurantes[0].id)
        if len(produtos_r1) >= 2:
            pedidos.append({
                "id_usuario": id_usuario,
                "id_restaurante": restaurantes[0].id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Cartão",
                "status": "Entregue",
                "tipo_entrega": "Padrão",
                "sub_total": 100.00,
                "taxa_entrega": 15.00,
                "valor_total": 115.00,
                "itens": [
                    {"id_produto": produtos_r1[0].id, "qtd_itens": 2, "valor_calculado": 50.00},
                    {"id_produto": produtos_r1[1].id, "qtd_itens": 1, "valor_calculado": 50.00},
                ],
            })

        # Pedido 2
        produtos_r2 = produtos_repo.list_products_by_restaurante(restaurantes[1].id)
        if len(produtos_r2) >= 1:
            pedidos.append({
                "id_usuario": id_usuario,
                "id_restaurante": restaurantes[1].id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Pix",
                "status": "Entregue",
                "tipo_entrega": "Rápida",
                "sub_total": 200.00,
                "taxa_entrega": 25.00,
                "valor_total": 225.00,
                "created_at": data_ontem,
                "updated_at": data_ontem,
                "itens": [
                    {"id_produto": produtos_r2[0].id, "qtd_itens": 4, "valor_calculado": 200.00},
                ],
            })

        # Pedido 3
        produtos_r3 = produtos_repo.list_products_by_restaurante(restaurantes[2].id)
        if len(produtos_r3) >= 1:
            pedidos.append({
                "id_usuario": id_usuario,
                "id_restaurante": restaurantes[2].id,
                "id_endereco": id_endereco,
                "forma_pagamento": "Cartão",
                "status": "Pendente",
                "tipo_entrega": "Padrão",
                "sub_total": 150.00,
                "taxa_entrega": 10.00,
                "valor_total": 160.00,
                "created_at": data_3_dias_atras,
                "updated_at": data_3_dias_atras,
                "itens": [
                    {"id_produto": produtos_r3[0].id, "qtd_itens": 3, "valor_calculado": 150.00},
                ],
            })

        # Mais 10 pedidos variados
        formas_pagamento = ["Pix", "Cartão"]
        tipos_entrega = ["Padrão", "Rápida"]

        for i in range(10):
            restaurante = restaurantes[i % len(restaurantes)]
            produtos = produtos_repo.list_products_by_restaurante(restaurante.id)

            if not produtos:
                continue

            qtd_itens = min(3, len(produtos))
            itens = []
            sub_total = 0.0

            for j in range(qtd_itens):
                qtd = j + 1
                valor = 30.0 * qtd
                itens.append({
                    "id_produto": produtos[j].id,
                    "qtd_itens": qtd,
                    "valor_calculado": valor
                })
                sub_total += valor

            taxa_entrega = 10.0 + (i % 3) * 5
            valor_total = sub_total + taxa_entrega

            created_time = datetime.now() - timedelta(days=i)
            created_time = created_time.replace(hour=11 + i % 5, minute=15, second=0, microsecond=0)

            pedidos.append({
                "id_usuario": id_usuario,
                "id_restaurante": restaurante.id,
                "id_endereco": id_endereco,
                "forma_pagamento": formas_pagamento[i % len(formas_pagamento)],
                "status": "Entregue" if i % 2 == 0 else "Pendente",
                "tipo_entrega": tipos_entrega[i % len(tipos_entrega)],
                "sub_total": round(sub_total, 2),
                "taxa_entrega": round(taxa_entrega, 2),
                "valor_total": round(valor_total, 2),
                "created_at": created_time,
                "updated_at": created_time,
                "itens": itens
            })

        # Inserindo todos os pedidos
        for pedido_data in pedidos:
            pedido_info = {key: pedido_data[key] for key in pedido_data if key != "itens"}
            id_pedido = pedidos_repo.insert_pedido(pedido_info)

            for item in pedido_data["itens"]:
                itens_repo.insert_item_pedido(id_pedido, item)
