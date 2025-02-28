from abc import ABC, abstractmethod
from src.model.entities.users import User

class IUsersRepository(ABC):

    @abstractmethod
    def create_user(self, nome: str, email: str, senha: str, is_admin: bool = False) -> None: pass
                
    @abstractmethod
    def get_user_by_id(self, user_id: int) -> User: pass
        
    @abstractmethod
    def list_users(self) -> list[User]: pass