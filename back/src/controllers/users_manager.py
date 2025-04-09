import re
from src.model.entities.user import User
from src.model.entities.restaurante import Restaurante
from src.model.repositories.interfaces.irestaurantes_repository import IRestaurantesRepository
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.iusers_repository import IUsersRepository
from src.main.utils.response_formatter import ResponseFormatter
from flask_jwt_extended import create_access_token

class UsersManager:
    def __init__(self, users_repo: IUsersRepository, restaurantes_repo: IRestaurantesRepository = None) -> None:
        self.__users_repo = users_repo
        self.__restaurantes_repo = restaurantes_repo
        self.class_name = "Usuário"

    def authenticate_user(self, http_request: HttpRequest) -> HttpResponse:
        login_info = http_request.body.get("data")
        email = login_info.get("email")
        is_created = False
        
        user_found = self.get_account_by_email(email)
        
        if user_found:
            id_user = user_found.id
        else:
            self.__fill_missing_name(login_info)
            id_user = self.__users_repo.insert(login_info)
            is_created = True
            
        token = create_access_token(
            identity=id_user,
            additional_claims={"role": "restaurante" if getattr(user_found, 'cnpj', None) else "usuario"}
        )
        return ResponseFormatter.display_operation(
            self.class_name, "criado" if is_created else "logado", token
        )
    

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
    

    def __fill_missing_name(self, user_info: dict) -> None:
        if not user_info.get("nome"):
            username_part = user_info.get("email").split("@")[0]
            cleaned_name = re.sub(r'[\d]|[._\-]+', ' ', username_part) # troca os símbolos por espaço
            user_info["nome"] = ' '.join(part.capitalize() for part in cleaned_name.split())


    def get_account_by_email(self, email: str) -> User | Restaurante | None:
        return self.__users_repo.find_by_email(email) or \
               self.__restaurantes_repo.find_by_email(email)