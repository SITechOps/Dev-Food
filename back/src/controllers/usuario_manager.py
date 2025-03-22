from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import UserNotFound, UserAlreadyExists
from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from flask_jwt_extended import create_access_token

class UsersManager:
    def __init__(self, users_repo: IUsersRepository):
        self.__users_repo = users_repo

    def create_user(self, http_request: HttpRequest) -> HttpResponse:
        user_info = http_request.body["data"]
        user_email = user_info["email"]
        
        if self.__users_repo.get_user_by_email(user_email):
            raise UserAlreadyExists()
        
        id_user = self.__users_repo.create_user(
            user_info["nome"], user_email, user_info["senha"]
        )
        
        token = create_access_token(
            identity=id_user,
            additional_claims={
                "nome": user_info.get("nome"),
                "email": user_info.get("email")
            }
        )
        
        return self.__format_modify_response(f"criado, {token}")
    

    def update_user(self, http_request: HttpRequest):
        users_info = http_request.body["data"]

        user_id = int(http_request.params["id"])
        user_name = users_info["nome"]
        user_passwd = users_info["senha"]

        self.__users_repo.update_user(user_id, user_name, user_passwd)
        return self.__format_modify_response("alterado")
        

    def get_all_users(self):
        self.__users_repo.list_users()
        lista_usuarios = self.__users_repo.list_users()
        return self.__format_get_response(lista_usuarios)
    

    def get_user_by_id(self, http_request: HttpRequest):
        user_id = int(http_request.params["id"])
        user = self.__users_repo.get_user_by_id(user_id)
        
        if not user:
            raise UserNotFound()
        
        return HttpResponse(
            body={"data": {"Type": "User", "attributes": {"id": user.id, "nome": user.nome, "email": user.email, "is_admin": bool(user.is_admin)}}},
            status_code=200
        )
    

    def delete_user(self, id_usuario: int):      
        self.__check_user(id_usuario)      
        self.__users_repo.delete_user(id_usuario)
        return self.__format_modify_response("deletado")
    

    def __check_user(self, id_usuario: int) -> None:
        response = self.__users_repo.get_user_by_id(id_usuario)
        if not response: raise UserNotFound()


    def __format_get_response(self, lista_usuarios: list) -> HttpResponse:
        attributes = [usuario.to_dict() for usuario in lista_usuarios]
        
        return HttpResponse(
            body={
                "data": {
                    "Type": "Usuario",
                    "count": len(lista_usuarios),
                    "attributes": attributes,
                }
            },
            status_code=200
        )
    

    def __format_modify_response(self, estado: str) -> HttpResponse:
        return HttpResponse(
            body= {
                "data": {
                    "message": f"Usuário {estado} com sucesso!"
                }
            },
            status_code=(201 if estado=="criado" else 200)
        )
