from src.main.handlers.custom_exceptions import UserNotFound
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.http_types.http_request import HttpRequest
from src.model.repositories.interfaces.ienderecos_repository import IEnderecosRepository

class EnderecosManager:
    def __init__(self, enderecos_repo: IEnderecosRepository, users_repo: IUsersRepository = None):
        self.__enderecos_repo = enderecos_repo
        self.__users_repo = users_repo


    def create_new_endereco(self, http_request: HttpRequest):
        data = http_request.body.get("data")
        id_usuario = data.get("id_usuario")
        self.__check_user(id_usuario)

        info_endereco = data.get("attributes")
        self.__enderecos_repo.create(id_usuario, info_endereco)
        return self.__format_modification_response("criado")
    

    def get_all_enderecos_by_user(self, id_usuario: int):
        self.__check_user(id_usuario)
        lista_enderecos = self.__enderecos_repo.find_all_enderecos_by_user(id_usuario)
        return self.__format_get_response(lista_enderecos)
    
    
    def update(self, http_request: HttpRequest):
        data = http_request.body.get("data").get("attributes")
        id_endereco = int(http_request.params.get("id_endereco"))
        self.__enderecos_repo.update(id_endereco, data)
        return self.__format_modification_response("alterado")


    def delete(self, http_request: HttpRequest):
        id_endereco = int(http_request.params.get("id_endereco"))
        self.__enderecos_repo.delete(id_endereco)
        return self.__format_modification_response("deletado")
        

    def __check_user(self, id_usuario: int) -> None:
        response = self.__users_repo.find_by_id(id_usuario)
        if not response: raise UserNotFound()


    def __format_get_response(self, lista_enderecos: list) -> HttpResponse:
        attributes = [endereco.to_dict() for endereco in lista_enderecos]
        
        return HttpResponse(
            body={
                "data": {
                    "Type": "Endereco",
                    "count": len(lista_enderecos),
                    "attributes": attributes,
                }
            },
            status_code=200
        )

    
    def __format_modification_response(self, action: str) -> HttpResponse:
        return HttpResponse(
            body= {
                "message": f"Endereço {action} com sucesso!"
            },
            status_code=(201 if action=="criado" else 200)
        )