from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.utils.response_formatter import ResponseFormatter
from src.main.handlers.custom_exceptions import RestaurantAlreadyExists
from flask_jwt_extended import create_access_token

class RestaurantesManager:
    def __init__(self, restaurante_repo: IRestaurantesRepository) -> None:
        self.__restaurante_repo = restaurante_repo
        self.class_name = "Restaurante"


    def create_new_restaurant(self, http_request: HttpRequest) -> HttpResponse:
        restaurante_info = http_request.body.get("data")
        
        if not restaurante_info:
            return ResponseFormatter.display_error("Requisição inválida: 'data' é obrigatório.", 400)

        email = restaurante_info.get("email")
        cnpj = restaurante_info.get("cnpj")
        razao_social = restaurante_info.get("razao_social")

        all_restaurants = self.__restaurante_repo.list_all()
        duplicated = next(
            (
                r for r in all_restaurants
                if r.email == email or r.cnpj == cnpj or r.razao_social == razao_social
            ),
            None
        )

        if duplicated:
            if duplicated.email == email:
                raise RestaurantAlreadyExists("Já existe um restaurante com este e-mail.")
            elif duplicated.cnpj == cnpj:
                raise RestaurantAlreadyExists("Já existe um restaurante com este CNPJ.")
            elif duplicated.razao_social == razao_social:
                raise RestaurantAlreadyExists("Já existe um restaurante com esta razão social.")

        restaurante_obj = self.__restaurante_repo.create(restaurante_info)
        token = create_access_token(
            identity=restaurante_obj.id,
            additional_claims={"role": "restaurante"}
        )

        return ResponseFormatter.display_operation(
            class_name=self.class_name,
            operation="criado",
            token=token
        )


    def get_all_restaurants(self) -> HttpResponse:
        lista_restaurante = self.__restaurante_repo.list_all()
        return ResponseFormatter.display_obj_list("Restaurante", lista_restaurante)


    def get_restaurant_by_id(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        
        if not id_restaurante:
            return ResponseFormatter.display_error("ID do restaurante é obrigatório.", 400)

        restaurante = self.__restaurante_repo.find_by_id(id_restaurante)
        
        if not restaurante:
            return ResponseFormatter.display_error("Restaurante não encontrado.", 404)
        
        return ResponseFormatter.display_single_obj(restaurante)


    def update(self, http_request: HttpRequest) -> HttpResponse:
        restaurante_info = http_request.body.get("data")
        id_restaurante = http_request.params.get("id")

        if not restaurante_info:
            return ResponseFormatter.display_error("Requisição inválida: 'data' é obrigatório.", 400)

        if not id_restaurante:
            return ResponseFormatter.display_error("ID do restaurante é obrigatório.", 400)

        self.__restaurante_repo.update(id_restaurante, restaurante_info)
        return ResponseFormatter.display_operation(self.class_name, "alterado")


    def update_endereco(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        restaurante_info = http_request.body.get("data")
        endereco_info = restaurante_info.get("attributes")

        self.__restaurante_repo.update_endereco(id_restaurante, endereco_info)
        return ResponseFormatter.display_operation(self.class_name, "alterado")


    def delete(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")

        if not id_restaurante:
            return ResponseFormatter.display_error("ID do restaurante é obrigatório.", 400)

        self.__restaurante_repo.delete(id_restaurante)
        return ResponseFormatter.display_operation(self.class_name, "deletado")