from abc import ABC, abstractmethod
from src.model.entities.user import User


class IUsersRepository(ABC):


    @abstractmethod
    def insert(self, user_info: dict, is_admin: bool = False) -> None: pass


    @abstractmethod
    def find_by_id(self, user_id: str) -> User | None: pass


    @abstractmethod
    def find_by_email(self, user_email: str) -> User | None: pass


    @abstractmethod
    def find_all_users(self) -> list[User]: pass


    @abstractmethod
    def update(self, user_id: str, user_info: dict) -> None: pass


    @abstractmethod
    def delete(self, user_id: str) -> None: pass