from src.model.repositories.interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.handlers.custom_exceptions import ProductAlreadyExists, ProductNotFound, RestaurantNotFound
from src.model.repositories.interfaces.iprodutos_repository import IProdutosRepository
from src.http_types.http_response import HttpResponse
from src.http_types.http_request import HttpRequest
from src.main.utils.response_formatter import ResponseFormatter
from src.main.utils.file_upload import save_file, allowed_file, delete_file
from flask import current_app
from werkzeug.datastructures import FileStorage
import os

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
        
        novo_produto = self.__produtos_repo.insert(produto_info, id_restaurante)

        return HttpResponse(
            body={
                "message": f"{self.class_name} criado com sucesso!",
                "id": novo_produto.id
            },
            status_code=201
        )

    
    def get_products_by_restaurante(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id_restaurante")
        self.__check_if_restaurant_exists(id_restaurante)

        lista_produtos = self.__produtos_repo.list_products_by_restaurante(id_restaurante)
        return ResponseFormatter.display_obj_list(self.class_name, lista_produtos)
    

    def get_all_products(self) -> HttpResponse:
        lista_produtos = self.__produtos_repo.list_all_products()
        return ResponseFormatter.display_obj_list(self.class_name, lista_produtos)
    

    def update(self, http_request: HttpRequest, image_file: FileStorage = None) -> HttpResponse:
        id_produto = http_request.params.get("id_produto")
        self.__check_if_product_exists(id_produto)

        produto_info = http_request.body.get("data")
        self.__produtos_repo.update(id_produto, produto_info)

        if image_file:
            http_response = self.__update_product_image(id_produto, image_file)
        else:
            http_response = ResponseFormatter.display_operation(self.class_name, "alterado")

        return http_response


    def delete(self, http_request: HttpRequest) -> HttpResponse:
        id_produto = http_request.params.get("id_produto")
        self.__check_if_product_exists(id_produto)

        produto = self.__produtos_repo.find_by_id(id_produto)
        if produto.image_url:
            self.__delete_product_image(produto.image_url)

        self.__produtos_repo.delete(id_produto)
        return ResponseFormatter.display_operation(self.class_name, "deletado")
    
    
    def update_image(self, http_request: HttpRequest, file: FileStorage) -> HttpResponse:
        id_produto = http_request.params.get("id_produto")
        self.__check_if_product_exists(id_produto)

        if not allowed_file(file.filename):
            return HttpResponse(body={"error": "Tipo de arquivo inválido"}, status_code=400)

        upload_folder = current_app.config['UPLOAD_FOLDER']

        for ext in ['.png', '.jpg', '.jpeg']:
            existing_image_path = os.path.join(upload_folder, f"{id_produto}{ext}")
            if os.path.exists(existing_image_path):
                delete_file(existing_image_path)

        file_extension = os.path.splitext(file.filename)[1].lower()
        new_filename = f"{id_produto}{file_extension}"
        save_file(file, upload_folder, new_filename)

        image_url = f"/produto/images/{new_filename}"
        self.__produtos_repo.update_image_path(id_produto, image_url)

        return HttpResponse(body={"image_url": image_url}, status_code=200)
        

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
        

    def __update_product_image(self, id_produto: str, image_file: FileStorage) -> HttpResponse:
        upload_folder = current_app.config['UPLOAD_FOLDER']
        for ext in ['.png', '.jpg', '.jpeg']:
            existing_image_path = os.path.join(upload_folder, f"{id_produto}{ext}")
            if os.path.exists(existing_image_path):
                delete_file(existing_image_path)

        file_extension = os.path.splitext(image_file.filename)[1].lower()
        new_filename = f"{id_produto}{file_extension}"

        save_file(image_file, upload_folder, new_filename)

        image_url = f"/produto/images/{new_filename}"
        self.__produtos_repo.update_image_path(id_produto, image_url)

        return HttpResponse(body={"image_url": image_url}, status_code=200)


    def __delete_product_image(self, image_url: str) -> None:
        upload_folder = current_app.config['UPLOAD_FOLDER']
        print(f"URL da imagem: {image_url}")
        image_path = os.path.join(upload_folder, image_url.lstrip('/produto/images/'))
        print(f"Caminho completo da imagem: {image_path}")

        if os.path.exists(image_path):
            try:
                os.remove(image_path)
                print(f"Imagem {image_path} deletada com sucesso!")
            except Exception as e:
                print(f"Erro ao tentar deletar a imagem: {e}")
        else:
            print(f"Imagem {image_path} não encontrada.")
