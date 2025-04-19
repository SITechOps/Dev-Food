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
        self.display_name = "Usuário"


    def create_new_user(self, http_request: HttpRequest) -> HttpResponse:
        dados_usuario = http_request.body.get("data")
        email = dados_usuario.get("email")

        self.__check_duplicate_user(email)
        self.__fill_missing_name(dados_usuario)
        id_usuario = self.__users_repo.insert(dados_usuario)

        token = generate_token(id_usuario, "usuario")
        return ResponseFormatter.display_operation(self.display_name, "criado", token)
       
        
    def login_user(self, http_request: HttpRequest) -> HttpResponse:
        email = http_request.body.get("email")
        usuario = self.__ensure_user_found(email, "email")

        role = usuario.role
        token = generate_token(usuario.id, role)
        display_role = role.capitalize() if role.startswith("r") else self.display_name
        return  ResponseFormatter.display_operation(display_role, "logado", token)
    

    def get_user_by_id(self, http_request: HttpRequest) -> HttpResponse:
        id_usuario = http_request.params.get("id")
        usuario = self.__ensure_user_found(id_usuario)
        return ResponseFormatter.display_single_obj(usuario)


    def get_all_users(self) -> HttpResponse:
        lista_usuarios = self.__users_repo.find_all_users()
        return ResponseFormatter.display_obj_list(self.display_name, lista_usuarios)
    

    def update(self, http_request: HttpRequest) -> HttpResponse:
        id_usuario = http_request.params.get("id")
        dados_atualizados = http_request.body.get("data")

        usuario_atual = self.__ensure_user_found(id_usuario)
        self.__prevent_email_update(usuario_atual.email, dados_atualizados.get("email"))

        self.__users_repo.update(usuario_atual, dados_atualizados)
        return ResponseFormatter.display_operation(self.display_name, "alterado")   
    

    def delete(self, http_request: HttpRequest) -> HttpResponse:   
        id_usuario = http_request.params.get("id")
        usuario = self.__ensure_user_found(id_usuario)

        self.__users_repo.delete(usuario)
        return ResponseFormatter.display_operation(self.display_name, "deletado")


    def __ensure_user_found(self, termo_busca: str, tipo_busca: str = "id") -> Usuario:
        buscar_usuario = getattr(self.__users_repo, f"find_by_{tipo_busca}")
        usuario = buscar_usuario(termo_busca)
        if not usuario:
            raise NotFound(self.display_name)
        return usuario
        

    def __check_duplicate_user(self, email: str) -> None:
        if self.__users_repo.find_by_email(email):
            raise AlreadyExists(self.display_name)
        
        
    def __prevent_email_update(self, email_atual: str, email_informado: str) -> None:
        if email_atual != email_informado:
            raise EmailChangeNotAllowed()         


    def __fill_missing_name(self, dados_usuario: dict) -> None:
        if not dados_usuario.get("nome"):
            parte_nome = dados_usuario.get("email").split("@")[0]
            nome_formatado = sub(r'[\d]|[._\-]+', ' ', parte_nome) # troca os símbolos por espaço
            dados_usuario["nome"] = ' '.join(palavra.capitalize() for palavra in nome_formatado.split())