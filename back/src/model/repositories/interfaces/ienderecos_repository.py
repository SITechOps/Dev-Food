from abc import ABC, abstractmethod
from src.model.entities.endereco import Endereco

class IEnderecosRepository(ABC):

    @abstractmethod
    def create(self, id_usuario: str, endereco: dict) -> None: pass

    @abstractmethod
    def find_all_enderecos_by_user(self, id_usuario: str) -> list[Endereco]: pass

    @abstractmethod
    def update(self, id_endereco: int, info: Endereco) -> None: pass

    @abstractmethod
    def delete(self, id_endereco: int) -> None: pass
