from src.http_types.http_response import HttpResponse
from src.http_types.http_request import HttpRequest
from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.model.repositories.interfaces.ienderecos_repository import IEnderecosRepository
from src.main.handlers.custom_exceptions import InvalidAddressType
from src.main.utils.response_formatter import ResponseFormatter

class EnderecosManager:
    def __init__(self, enderecos_repo: IEnderecosRepository, users_repo: IUsersRepository = None) -> None:
        self.__enderecos_repo = enderecos_repo
        self.__users_repo = users_repo
        self.class_name = "Endereço"


    def create_new_endereco(self, http_request: HttpRequest) -> HttpResponse:
        data = http_request.body.get("data")
        id_usuario = data.get("id_usuario")
        self.__check_user(id_usuario)

        info_endereco = data.get("attributes")
        self.__validate_address_type(info_endereco.get("tipo"))
        
        self.__enderecos_repo.create(id_usuario, info_endereco)
        return ResponseFormatter.display_operation(self.class_name, "criado")
    

    def get_all_enderecos_by_user(self, http_request: HttpRequest) -> HttpResponse:
        id_usuario = http_request.params.get("id_usuario")

        self.__check_user(id_usuario)
        lista_enderecos = self.__enderecos_repo.find_all_enderecos_by_user(id_usuario)
        return ResponseFormatter.display_obj_list("Endereco", lista_enderecos)
    
    
    def update(self, http_request: HttpRequest) -> HttpResponse:
        data = http_request.body.get("data")
        id_usuario = data.get("id_usuario")
        info_endereco = data.get("attributes")
        id_endereco = http_request.params.get("id_endereco")

        self.__enderecos_repo.update(id_endereco, id_usuario, info_endereco)
        return ResponseFormatter.display_operation(self.class_name, "alterado")


    def delete(self, http_request: HttpRequest) -> HttpResponse:
        id_endereco = http_request.params.get("id_endereco")
        id_usuario = http_request.params.get("id_usuario")
        self.__check_user(id_usuario)

        self.__enderecos_repo.delete(id_endereco, id_usuario)
        return ResponseFormatter.display_operation(self.class_name, "deletado")
        

    def __check_user(self, id_usuario: str) -> None:
        self.__users_repo.find_by_id(id_usuario)


    def __validate_address_type(self, tipo: str):
        if tipo.lower() not in ["casa", "trabalho"]:
            raise InvalidAddressType()