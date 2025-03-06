from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse


class UsersReader:
    def __init__(self, users_repo: IUsersRepository):
        self.__users_repo = users_repo


    def get_all_users(self) -> HttpResponse:
        users = self.__users_repo.list_users()

        if not users:
            return HttpResponse(
                body={
                    "data": {
                        "message": "Não há usuários cadastrados!"
                    }
                },
                status_code=200
                )

        return self.__format_response(users)


    def __format_response(self, users) -> HttpResponse:
        users_data = [
            {
                "id": user.id,
                "nome": user.nome,
                "email": user.email,
                "is_admin": bool(user.is_admin),
            }
            for user in users
        ]   

        return HttpResponse(
            body={
                "data": {
                    "Type": "User",
                    "count": len(users),
                    "attributes": users_data,
                }
            },
            status_code=200
        )