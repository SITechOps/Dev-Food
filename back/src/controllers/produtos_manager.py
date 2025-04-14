from src.model.repositories.interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.handlers.custom_exceptions import ProductAlreadyExists, ProductNotFound, RestaurantNotFound
from src.model.repositories.interfaces.iprodutos_repository import IProdutosRepository
from src.http_types.http_response import HttpResponse
from src.http_types.http_request import HttpRequest
from src.main.utils.response_formatter import ResponseFormatter

class ProdutosManager:
    def __init__(self, produtos_repo: IProdutosRepository, restaurantes_repo: IRestaurantesRepository = None) -> None:
        self.__produtos_repo = produtos_repo
        self.__restaurantes_repo = restaurantes_repo
        self.class_name = "Produto"


    def create_new_produto(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.body.get("id_restaurante")
        self.__check_if_restaurant_exists(id_restaurante)

        produto_info = http_request.body.get("data")
        self.__check_if_product_is_unique(produto_info.get("nome"), id_restaurante)
        
        self.__produtos_repo.insert(produto_info, id_restaurante)
        return ResponseFormatter.display_operation(self.class_name, "criado")
    

    def list_products_by_restaurante(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id_restaurante")
        self.__check_if_restaurant_exists(id_restaurante)

        lista_enderecos = self.__produtos_repo.list_products(id_restaurante)
        return ResponseFormatter.display_obj_list(self.class_name, lista_enderecos)
    
    
    def update(self, http_request: HttpRequest) -> HttpResponse:
        id_produto = http_request.params.get("id_produto")
        self.__check_if_product_exists(id_produto)
        produto_info = http_request.body.get("data")

        self.__produtos_repo.update(id_produto, produto_info)
        return ResponseFormatter.display_operation(self.class_name, "alterado")


    def delete(self, http_request: HttpRequest) -> HttpResponse:
        id_produto = http_request.params.get("id_produto")
        self.__check_if_product_exists(id_produto)

        self.__produtos_repo.delete(id_produto)
        return ResponseFormatter.display_operation(self.class_name, "deletado")
        

    def __check_if_product_exists(self, id_produto: str) -> None:
        produto = self.__produtos_repo.find_by_id(id_produto)
        if not produto:
            raise ProductNotFound()
        

    def __check_if_product_is_unique(self, nome_produto: str, id_restaurante: str) -> None:
        produto = self.__produtos_repo.find_by_name(nome_produto, id_restaurante)
        if produto:
            raise ProductAlreadyExists()
        

    def __check_if_restaurant_exists(self, id_restaurante: str) -> None:
        restaurante = self.__restaurantes_repo.find_by_id(id_restaurante)
        if not restaurante:
            raise RestaurantNotFound()