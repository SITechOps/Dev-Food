from abc import ABC, abstractmethod
from src.model.entities.usuario import Usuario


class IUsuariosRepository(ABC):

    @abstractmethod
    def insert(self, info_usuario: dict) -> str: pass


    @abstractmethod
    def find_by_id(self, id_usuario: str) -> Usuario | None: pass


    @abstractmethod
    def find_by_email(self, email: str) -> Usuario | None: pass


    @abstractmethod
    def find_all_users(self) -> list[Usuario]: pass


    @abstractmethod
    def update(self, usuario_atual: Usuario, dados_atualizados: dict) -> None: pass

    @abstractmethod
    def delete(self, usuario: Usuario) -> None: pass