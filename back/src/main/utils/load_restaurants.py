import json
from src.model.repositories.restaurantes_repository import RestaurantesRepository
from src.model.repositories.produtos_repository import ProdutosRepository
from pathlib import Path

caminho_arquivo = Path(__file__).parent / 'sample_restaurants.json'

def load_sample_restaurants():   
    restaurante_repo = RestaurantesRepository()
    produto_repo = ProdutosRepository()

    if not restaurante_repo.list_all():

        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            dados_restaurantes = json.load(f)

        for restaurante in dados_restaurantes:
            produtos = restaurante.pop("produtos", [])
            id_restaurante = restaurante_repo.create(restaurante).id

            for produto in produtos:
                produto_repo.insert(produto, id_restaurante)
