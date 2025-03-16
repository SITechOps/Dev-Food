from abc import ABC, abstractmethod
from src.model.entities.endereco import Endereco

class IEnderecosRepository(ABC):

    @abstractmethod
    def create_endereco(self, id_usuario: int, endereco: dict) -> None: pass

    @abstractmethod
    def get_all_enderecos_by_user(self, id_usuario: int) -> list[Endereco]: pass

    @abstractmethod
    def update_endereco(self, id_endereco: int, info: Endereco) -> None: pass

    @abstractmethod
    def delete_endereco(self, endereco_id: int) -> None: pass
