from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse


class UsersFilter:
    def __init__(self, users_repo: IUsersRepository):
        self.__users_repo = users_repo


    def get_user_by_id(self, http_request: HttpRequest) -> HttpResponse:
        try:
            user_id = int(http_request.params["id"])
            
            user = self.__users_repo.get_user_by_id(user_id)
            if not user:
                raise Exception("User not found!")
            
            return self.__format_response(user)
        
        except Exception as e:
            return HttpResponse(
                body={"error": str(e)},
                status_code=404  
            )


    def __format_response(self, user) -> HttpResponse:
        user_data = {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "is_admin": bool(user.is_admin), 
        }
        
        return HttpResponse(
            body={
                "data": {
                    "Type": "User",
                    "attributes": user_data
                }
            },
            status_code=200 
        )