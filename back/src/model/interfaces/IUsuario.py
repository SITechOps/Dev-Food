from abc import ABC, abstractmethod
from src.model.classes.Usuario import Usuario

class InterfaceUsuario(ABC):
    @abstractmethod
    def inserir(self, nome: str, email: str, senha: str, is_admin: bool) -> None:
        pass

    @abstractmethod
    def selecionar_usuario(self, nome_usuario: str) -> Usuario:
        pass

    @abstractmethod
    def listar_usuarios(self) -> list[Usuario]:
        pass