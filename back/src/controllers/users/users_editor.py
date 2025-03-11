from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse


class UsersEditor:
    def __init__(self, users_repo: IUsersRepository):
        self.__users_repo = users_repo


    def update_user(self, http_request: HttpRequest) -> HttpResponse:
        print(http_request)
        users_info = http_request.body["data"]

        user_id = int(http_request.params["id"])
        user_name = users_info["nome"]
        user_passwd = users_info["senha"]

        if not self.__check_user(user_id):
            return HttpResponse(
                body={"error": "User not found!"},
                status_code=404
            )

        return self.__update_user(user_id, user_name, user_passwd)


    def __check_user(self, user_id: int) -> bool:
        user = self.__users_repo.get_user_by_id(user_id)
        return user is not None


    def __update_user(self, user_id: int, user_name: str, user_passwd: str) -> HttpResponse:
        try:
            self.__users_repo.update_user(user_id, user_name, user_passwd)
            return self.__format_response(user_id)
        
        except Exception as e:
            return HttpResponse(
                body={"error": str(e)},
                status_code=500
            )


    def __format_response(self, user_id: int) -> HttpResponse:
        return HttpResponse(
            body={
                "data": {
                    "Type": "User",
                    "count": 1,
                    "UserId": user_id,
                    "response": "User updated!"
                }
            },
            status_code=200
        )