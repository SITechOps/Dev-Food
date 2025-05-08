from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.utils.response_formatter import ResponseFormatter
from flask_jwt_extended import create_access_token

class RestaurantesManager:
    def __init__(self, restaurante_repo: IRestaurantesRepository) -> None:
        self.__restaurante_repo = restaurante_repo
        self.class_name = "Restaurante"


    def create_new_restaurant(self, http_request: HttpRequest) -> HttpResponse:
        restaurante_info = http_request.body.get("data")
        
        if not restaurante_info:
            return ResponseFormatter.display_error("Requisição inválida: 'data' é obrigatório.", 400)

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
    

    def update_financeiro(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        financeiro_info = http_request.body.get("data")

        if not financeiro_info:
            return ResponseFormatter.display_error("Requisição inválida: 'data' é obrigatório.", 400)

        if not id_restaurante:
            return ResponseFormatter.display_error("ID do restaurante é obrigatório.", 400)
        
        self.__restaurante_repo.update_dados_financeiros(id_restaurante, financeiro_info)
        return ResponseFormatter.display_operation(self.class_name, "alterado")


    def update_endereco(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        restaurante_info = http_request.body.get("data")
        endereco_info = restaurante_info.get("attributes")
        print(http_request) 

        self.__restaurante_repo.update_endereco(id_restaurante, endereco_info)
        return ResponseFormatter.display_operation(self.class_name, "atualizado com novo endereço")


    def delete(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")

        if not id_restaurante:
            return ResponseFormatter.display_error("ID do restaurante é obrigatório.", 400)

        self.__restaurante_repo.delete(id_restaurante)
        return ResponseFormatter.display_operation(self.class_name, "deletado")