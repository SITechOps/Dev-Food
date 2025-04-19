from src.model.entities.usuario import Usuario
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.utils.generate_token import generate_token
from src.main.utils.response_formatter import ResponseFormatter
from src.main.handlers.custom_exceptions import AlreadyExists, EmailChangeNotAllowed, NotFound
from src.model.repositories.interfaces.iusuarios_repository import IUsuariosRepository
from re import sub

class UsuariosManager:

    def __init__(self, users_repo: IUsuariosRepository) -> None:
        self.__users_repo = users_repo
        self.class_name = "Usuário"


    def create_new_user(self, http_request: HttpRequest) -> HttpResponse:
        dados_usuario = http_request.body.get("data")
        email = dados_usuario.get("email")

        usuario = self.__users_repo.find_by_email(email)
        self.__raise_if_user_exists(usuario)
        
        self.__fill_missing_name(dados_usuario)
        id_usuario = self.__users_repo.insert(dados_usuario)
        token = generate_token(id_usuario, "usuario")

        return ResponseFormatter.display_operation(self.class_name, "criado", token)
       
        
    def login_user(self, http_request: HttpRequest) -> HttpResponse:
        email = http_request.body.get("email")
        usuario = self.__users_repo.find_by_email(email)
        self.__raise_if_not_found(usuario)

        token = generate_token(usuario.id, usuario.role)
        return  ResponseFormatter.display_operation(self.class_name, "logado", token)
    

    def get_user_by_id(self, http_request: HttpRequest) -> HttpResponse:
        id_usuario = http_request.params.get("id")
        usuario = self.__users_repo.find_by_id(id_usuario)

        self.__raise_if_not_found(usuario)
        return ResponseFormatter.display_single_obj(usuario)


    def get_all_users(self) -> HttpResponse:
        lista_usuarios = self.__users_repo.find_all_users()
        return ResponseFormatter.display_obj_list(self.class_name, lista_usuarios)
    

    def update(self, http_request: HttpRequest) -> HttpResponse:
        id_usuario = http_request.params.get("id")
        dados_usuario = http_request.body.get("data")

        self.__check_user(id_usuario, dados_usuario.get("email"))
        self.__users_repo.update(id_usuario, dados_usuario)
        return ResponseFormatter.display_operation(self.class_name, "alterado")   
    

    def delete(self, http_request: HttpRequest) -> HttpResponse:   
        id_usuario = http_request.params.get("id")
        self.__check_user(id_usuario)

        self.__users_repo.delete(id_usuario)
        return ResponseFormatter.display_operation(self.class_name, "deletado")


    def __raise_if_not_found(self, usuario: Usuario | None) -> None:
        if not usuario:
            raise NotFound(self.class_name)
        

    def __raise_if_user_exists(self, usuario: Usuario | None) -> None:
        if usuario:
            raise AlreadyExists(self.class_name)
        
        
    def __raise_if_email_changed(self, email_informado: str, email_atual: str) -> None:
        if email_informado != email_atual:
            raise EmailChangeNotAllowed()
        

    def __check_user(self, id_usuario: str, email_informado: str = None) -> None:
        usuario = self.__users_repo.find_by_id(id_usuario)
        self.__raise_if_not_found(usuario)
        
        if email_informado:
            self.__raise_if_email_changed(email_informado, usuario.email)


    def __fill_missing_name(self, dados_usuario: dict) -> None:
        if not dados_usuario.get("nome"):
            parte_nome = dados_usuario.get("email").split("@")[0]
            nome_formatado = sub(r'[\d]|[._\-]+', ' ', parte_nome) # troca os símbolos por espaço
            dados_usuario["nome"] = ' '.join(palavra.capitalize() for palavra in nome_formatado.split())