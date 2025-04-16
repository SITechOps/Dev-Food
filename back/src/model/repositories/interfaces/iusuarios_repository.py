from abc import ABC, abstractmethod
from src.model.entities.usuario import Usuario


class IUsuariosRepository(ABC):


    @abstractmethod
    def insert(self, user_info: dict) -> str: pass


    @abstractmethod
    def find_by_id(self, user_id: str) -> Usuario | None: pass


    @abstractmethod
    def find_by_email(self, user_email: str) -> Usuario | None: pass


    @abstractmethod
    def find_all_users(self) -> list[Usuario]: pass


    @abstractmethod
    def update(self, user_id: str, user_info: dict) -> None: pass


    @abstractmethod
    def delete(self, user_id: str) -> None: pass