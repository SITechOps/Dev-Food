from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import UserAlreadyExists
from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from flask_jwt_extended import create_access_token

class UsersCreator:
    def __init__(self, users_repo: IUsersRepository):
        self.__users_repo = users_repo
    

    def create_user(self, http_request: HttpRequest) -> HttpResponse:
        user_info = http_request.body["data"]
        user_name = user_info["nome"]
        user_email = user_info["email"]
        user_passwd = user_info["senha"]

        self.__check_user(user_email)
        id_user = self.__create_user(user_name, user_email, user_passwd)
        token = self.__generate_token(id_user, user_info)
        return self.__format_response(token)


    def __check_user(self, user_email: str) -> None:
        response = self.__users_repo.get_user_by_email(user_email)
        if response: raise UserAlreadyExists()


    def __create_user(self, user_name: str, user_email: str, user_passwd: str) -> None:
        id_user = self.__users_repo.create_user(user_name, user_email, user_passwd)
        return id_user
    

    def __generate_token(self, id_user: int, user_info: dict) -> str:
        token = create_access_token(
            identity=id_user,
            additional_claims={
                "nome": user_info.get("nome"),
                "email": user_info.get("email")
            }
        )
        return token


    def __format_response(self, token: str) -> HttpResponse:
        return HttpResponse(
            body={
                "message": "Usuário cadastrado com sucesso!",
                "properties": {
                    "token": token
                }
            },
            status_code=201
        )