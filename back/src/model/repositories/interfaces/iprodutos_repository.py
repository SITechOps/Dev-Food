from abc import ABC, abstractmethod
from src.model.entities.produto import Produto

class IProdutosRepository(ABC):
    
    @abstractmethod
    def insert(self, produto_info: dict, id_restaurante: str) -> None: pass


    @abstractmethod
    def find_by_id(self, id_produto: str) -> Produto | None: pass


    @abstractmethod
    def find_by_name(self, nome_produto: str, id_restaurante: str) -> Produto | None: pass


    @abstractmethod
    def list_products(self, restaurante_id: str) -> list[Produto]: pass


    @abstractmethod
    def update(self, id_produto: str, produto_info: dict) -> None: pass


    @abstractmethod
    def delete(self, id_produto: str) -> None: pass