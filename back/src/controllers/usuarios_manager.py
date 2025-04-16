from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.iusuarios_repository import IUsuariosRepository
from src.main.utils.response_formatter import ResponseFormatter
from flask_jwt_extended import create_access_token
import re

class UsuariosManager:
    def __init__(self, users_repo: IUsuariosRepository) -> None:
        self.__users_repo = users_repo
        self.class_name = "Usuário"


    def authenticate_user(self, http_request: HttpRequest) -> HttpResponse:
        login_info = http_request.body.get("data")
        email = login_info.get("email")

        user_found = self.__users_repo.find_by_email(email)
        operacao = "logado" if user_found else "criado"
        
        if not user_found:
            self.__fill_missing_name(login_info)
            user_found = self.__users_repo.insert(login_info)
            
        role = user_found.role
        token = create_access_token(
            identity=user_found.id,
            additional_claims={"role": role}
        )
        return ResponseFormatter.display_operation(role.capitalize(), operacao, token)
       

    def get_user_by_id(self, http_request: HttpRequest) -> HttpResponse:
        user_id = http_request.params.get("id")
        user = self.__users_repo.find_by_id(user_id)
        return ResponseFormatter.display_single_obj(user)
    

    def get_all_users(self) -> HttpResponse:
        users_list = self.__users_repo.find_all_users()
        return ResponseFormatter.display_obj_list("Usuario", users_list)
    

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