from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse


class UsersRemover:
    def __init__(self, users_repo: IUsersRepository):
        self.__users_repo = users_repo


    def delete_user(self, http_request: HttpRequest) -> HttpResponse:
        user_id = int(http_request.params["id"])

        try:
            user = self.__users_repo.get_user_by_id(user_id)
            if user is None:
                return HttpResponse(
                    body={"error": "User not found!"},
                    status_code=404
                )

            self.__users_repo.delete_user(user_id)
            return HttpResponse(body=None, status_code=200)
        
        except Exception as e:
            return HttpResponse(
                body={"error": str(e)},
                status_code=500
            )