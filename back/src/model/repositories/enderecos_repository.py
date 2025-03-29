from src.model.configs.connection import DBConnectionHandler
from src.model.entities.endereco import Endereco
from .interfaces.ienderecos_repository import IEnderecosRepository
from src.main.handlers.custom_exceptions import AddressNotFound

class EnderecosRepository(IEnderecosRepository):

    def create(self, id_usuario: str, endereco: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                new_endereco = Endereco(id_usuario=id_usuario)
                for key, value in endereco.items():
                    setattr(new_endereco, key, value)
                    
                db.session.add(new_endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception


    def find_all_enderecos_by_user(self, id_usuario: str) -> list[Endereco]:
        with DBConnectionHandler() as db:
            enderecos = (
                db.session
                .query(Endereco)
                .filter(Endereco.id_usuario == id_usuario)
                .all()
            )
            return enderecos
        

    def __find_by_id(self, id_endereco: int) -> Endereco:
        with DBConnectionHandler() as db:
            enderecos = (
                db.session
                .query(Endereco)
                .filter(Endereco.id == id_endereco)
                .one_or_none()
            )
            if not enderecos:
                raise AddressNotFound()
            return enderecos


    def update(self, id_endereco: int, info: Endereco) -> None:
        with DBConnectionHandler() as db:
            try:
                endereco = self.__find_by_id(id_endereco)
                for key, value in info.items():
                    setattr(endereco, key, value)

                db.session.add(endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception


    def delete(self, id_endereco: int) -> None:
        with DBConnectionHandler() as db:
            try:
                endereco = self.__find_by_id(id_endereco)
                db.session.delete(endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception