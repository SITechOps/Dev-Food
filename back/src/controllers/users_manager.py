from src.model.entities.users import User
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import UserAlreadyExists
from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from flask_jwt_extended import create_access_token

class UsersManager:
    def __init__(self, users_repo: IUsersRepository):
        self.__users_repo = users_repo

    def create_new_user(self, http_request: HttpRequest) -> HttpResponse:
        user_info = http_request.body.get("data")
        user_email = user_info.get("email")
        
        if self.__users_repo.find_by_email(user_email):
            raise UserAlreadyExists()
        
        id_user = self.__users_repo.insert(user_info)
        token = create_access_token(identity=id_user)
        
        return self.__format_user_modification_response("criado", token)
    

    def get_user_by_id(self, http_request: HttpRequest):
        user_id = int(http_request.params.get("id"))
        user = self.__users_repo.find_by_id(user_id)
        return self.__format_user_response(user)
    

    def get_all_users(self):
        users_list = self.__users_repo.find_all_users()
        return self.__format_user_list_response(users_list)
    

    def update(self, http_request: HttpRequest):
        user_info = http_request.body.get("data")
        user_id = int(http_request.params.get("id"))

        self.__users_repo.update(user_id, user_info)

        return self.__format_user_modification_response("alterado")   
    

    def delete(self, http_request: HttpRequest):   
        user_id = int(http_request.params.get("id"))

        self.__users_repo.delete(user_id)

        return self.__format_user_modification_response("deletado")


    def __format_user_response(self, user_info: User) -> HttpResponse:
        return HttpResponse(
            body={
                "data": {
                    "Type": "Usuario",
                    "attributes": user_info.to_dict(),
                }
            },
            status_code=200
        )
    

    def __format_user_list_response(self, user_list: list[User]) -> HttpResponse:
        attributes = [user.to_dict() for user in user_list]
        
        return HttpResponse(
            body={
                "data": {
                    "Type": "Usuario",
                    "count": len(user_list),
                    "attributes": attributes,
                }
            },
            status_code=200
        )

    
    def __format_user_modification_response(self, action: str, token: str = None) -> HttpResponse:
        return HttpResponse(
            body= {
                "message": f"Usuário {action} com sucesso!",
                **({"token": token} if token else {})
            },
            status_code=(201 if action=="criado" else 200)
        )
