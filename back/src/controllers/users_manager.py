from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.main.handlers.custom_exceptions import UserAlreadyExists
from src.main.utils.response_formatter import ResponseFormatter
from flask_jwt_extended import create_access_token

class UsersManager:
    def __init__(self, users_repo: IUsersRepository) -> None:
        self.__users_repo = users_repo
        self.class_name = "Usuário"

    def create_new_user(self, http_request: HttpRequest) -> HttpResponse:
        user_info = http_request.body.get("data")
        user_email = user_info.get("email")
        
        if self.__users_repo.find_by_email(user_email):
            raise UserAlreadyExists()
        
        id_user = self.__users_repo.insert(user_info)
        token = create_access_token(
            identity=id_user,
            additional_claims={
                "nome": user_info.get("nome"),
                "email": user_info.get("email")
            }
        )
        return ResponseFormatter.display_operation(self.class_name, "criado", token)
    

    def get_user_by_id(self, http_request: HttpRequest) -> HttpResponse:
        user_id = http_request.params.get("id")
        user = self.__users_repo.find_by_id(user_id)
        return ResponseFormatter.display_single_obj(user)
    

    def get_all_users(self) -> HttpResponse:
        users_list = self.__users_repo.find_all_users()
        return ResponseFormatter.display_obj_list("User", users_list)
    

    def update(self, http_request: HttpRequest) -> HttpResponse:
        user_info = http_request.body.get("data")
        user_id = http_request.params.get("id")

        self.__users_repo.update(user_id, user_info)
        return ResponseFormatter.display_operation(self.class_name, "alterado")   
    

    def delete(self, http_request: HttpRequest) -> HttpResponse:   
        user_id = http_request.params.get("id")

        self.__users_repo.delete(user_id)
        return ResponseFormatter.display_operation(self.class_name, "deletado")