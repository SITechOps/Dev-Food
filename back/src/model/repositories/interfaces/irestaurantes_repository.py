from abc import ABC, abstractmethod
from src.model.entities.restaurante import Restaurante

class IRestaurantesRepository(ABC):
    
    @abstractmethod
    def create(self, restaurante: dict) -> None: pass
    
    @abstractmethod
    def find_all(self, page: int = 1, limit: int = 10, category: str = None) -> list[Restaurante]: pass
    
    @abstractmethod
    def find_by_id(self, id_restaurante: str) -> Restaurante: pass
    
    @abstractmethod
    def update(self, id_restaurante: str, info: dict) -> None: pass
    
    @abstractmethod
    def delete(self, id_restaurante: str) -> None: pass