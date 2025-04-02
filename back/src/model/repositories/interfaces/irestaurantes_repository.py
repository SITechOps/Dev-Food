from abc import ABC, abstractmethod
from src.model.entities.restaurante import Restaurante

class IRestaurantesRepository(ABC):

    @abstractmethod
    def create(self, info_restaurante: dict) -> None:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def list_all(self) -> list[Restaurante]:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def find_by_id(self, id_restaurante: str) -> Restaurante:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def find_by_email(self, email_restaurante: str) -> Restaurante | None:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def update(self, id_restaurante: str, info_restaurante: dict) -> None:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def delete(self, id_restaurante: str) -> None:
        raise NotImplementedError("Subclasses devem implementar este método")