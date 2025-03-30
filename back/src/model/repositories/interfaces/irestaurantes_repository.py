from abc import ABC, abstractmethod
from src.model.entities.restaurante import Restaurante

class IRestaurantesRepository(ABC):
    
    @abstractmethod
    def create(self, restaurante: dict) -> None:
        """Cria um novo restaurante"""
        raise NotImplementedError
    
    @abstractmethod
    def find_all(self, page: int = 1, limit: int = 10, category: str = None) -> list[Restaurante]:
        """Busca todos os restaurantespaginado e por categoria"""
        raise NotImplementedError
    
    @abstractmethod
    def find_by_id(self, id_restaurante: str) -> Restaurante:
        """Busca por id"""
        raise NotImplementedError
    
    @abstractmethod
    def update(self, id_restaurante: str, info: dict) -> None:
        """update restaurante"""
        raise NotImplementedError
    
    @abstractmethod
    def delete(self, id_restaurante: str) -> None:
        """manda o restaurante de arrasta"""
        raise NotImplementedError