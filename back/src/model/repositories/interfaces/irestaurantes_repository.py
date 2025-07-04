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
    def update_dados_financeiros(self, id_restaurante: str, financeiro_data: dict ) -> None:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def update_endereco(self, id_restaurante: str, endereco_data: dict) -> None:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def delete(self, id_restaurante: str) -> None:
        raise NotImplementedError("Subclasses devem implementar este método")
    
    @abstractmethod
    def update_image_path(self, id_restaurante: str, image_url: str) -> None:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def relatorio_receita_bruta(self, data_inicio: str, data_fim: str) -> list[dict]:
        raise NotImplementedError("Subclasses devem implementar este método")


    @abstractmethod
    def relatorio_qtd_pedidos(self, data_inicio: str = None, data_fim: str = None) -> list[dict]:
        raise NotImplementedError("Subclasses devem implementar este método")

    
    @abstractmethod
    def relatorio_forma_pagamento_mais_usada(self, data_inicio: str = None, data_fim: str = None) -> list[dict]:
        raise NotImplementedError("Subclasses devem implementar este método")