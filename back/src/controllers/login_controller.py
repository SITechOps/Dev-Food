from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.main.handlers.custom_exceptions import UserNotFound, WrongPassword
from src.main.utils.response_formatter import ResponseFormatter
from flask_jwt_extended import create_access_token

class LoginController:
    def __init__(self, users_repo: IUsersRepository) -> None:
        self.__users_repo = users_repo
    
    def authenticate_user(self, http_request: HttpRequest) -> HttpResponse:
        data = http_request.body.get("data")
        email = data.get("email")
        senha = data.get("senha")

        user_info = self.__users_repo.find_by_email(email)
        if not user_info:
            raise UserNotFound()
        if user_info.senha != senha:
            raise WrongPassword()
    
        token = create_access_token(identity=user_info.id)
        return ResponseFormatter.display_operation("Usuário", "logado", token)