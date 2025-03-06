from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse


class UsersCreator:
    def __init__(self, users_repo: IUsersRepository):
        self.__users_repo = users_repo
    

    def create_user(self, http_request: HttpRequest) -> HttpResponse:
        users_info = http_request.body["data"]
        user_name = users_info["nome"]
        user_email = users_info["email"]
        user_passwd = users_info["senha"]

        self.__check_user(user_email)
        self.__create_user(user_name, user_email, user_passwd)
        return self.__format_response(user_name, user_email, user_passwd)


    def __check_user(self, user_email: str) -> None:
        response = self.__users_repo.get_user_by_email(user_email)
        if response: raise Exception('User already exists!')


    def __create_user(self, user_name: str, user_email: str, user_passwd: str) -> None:
        self.__users_repo.create_user(user_name, user_email, user_passwd)


    def __format_response(self, user_name: str, user_email: str, user_passwd: str) -> HttpResponse:
        return HttpResponse(
            body={
                "data": {
                    "Type": "User",
                    "count": 1,
                    "attributes": {
                        "nome": user_name,
                        "email": user_email,
                        "senha": user_passwd,
                    }
                }
            },
            status_code=201
        )