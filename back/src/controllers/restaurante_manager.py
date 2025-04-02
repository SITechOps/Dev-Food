from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.utils.response_formatter import ResponseFormatter
from src.main.handlers.custom_exceptions import UserAlreadyExists

from flask_jwt_extended import create_access_token

class RestaurantesManager:
    def __init__(self, restaurante_repo: IRestaurantesRepository) -> None:
        self.__restaurante_repo = restaurante_repo
        self.class_name = "Restaurante"


    def create_new_restaurant(self, http_request: HttpRequest) -> HttpResponse:
        restaurante_info = http_request.body.get("data")
        email_restaurante = restaurante_info.get("email")
        
        if self.__restaurante_repo.find_by_email(email_restaurante):
            raise UserAlreadyExists()
        
        id_restaurante = self.__restaurante_repo.create(restaurante_info)
        token = create_access_token(
            identity=id_restaurante,
            additional_claims={
                "role": "restaurante"
            }
        )
        return ResponseFormatter.display_operation(self.class_name, "criado", token)
    

    def get_restaurant_by_id(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        restaurante = self.__restaurante_repo.find_by_id(id_restaurante)
        return ResponseFormatter.display_single_obj(restaurante)
    

    def get_all_restaurants(self) -> HttpResponse:
        lista_restaurante = self.__restaurante_repo.list_all()
        return ResponseFormatter.display_obj_list("Restaurante", lista_restaurante)
    

    def update(self, http_request: HttpRequest) -> HttpResponse:
        restaurante_info = http_request.body.get("data")
        id_restaurante = http_request.params.get("id")

        self.__restaurante_repo.update(id_restaurante, restaurante_info)
        return ResponseFormatter.display_operation(self.class_name, "alterado")   
    

    def delete(self, http_request: HttpRequest) -> HttpResponse:   
        id_restaurante = http_request.params.get("id")

        self.__restaurante_repo.delete(id_restaurante)
        return ResponseFormatter.display_operation(self.class_name, "deletado")