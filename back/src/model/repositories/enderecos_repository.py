from src.model.configs.connection import DBConnectionHandler
from src.model.entities.endereco import Endereco
from .interfaces.ienderecos_repository import IEnderecosRepository

class EnderecosRepository(IEnderecosRepository):

    def create_endereco(self, logradouro: str, bairro: str, cidade: str, estado: str, pais: str, numero: int, complemento: str, tipo: str, id_usuario: int) -> None:
        with DBConnectionHandler() as db:
            try:
                new_endereco = Endereco(
                    logradouro=logradouro,
                    bairro=bairro,
                    cidade=cidade,
                    estado=estado,
                    pais=pais,
                    numero=numero,
                    complemento=complemento,
                    tipo=tipo,
                    id_usuario=id_usuario
                )
                db.session.add(new_endereco)
                db.session.commit()
                return new_endereco.id
            except Exception as exception:
                db.session.rollback()
                raise exception

    def get_endereco_by_id(self, endereco_id: int) -> Endereco:
        with DBConnectionHandler() as db:
            endereco = (
                db.session
                .query(Endereco)
                .filter(Endereco.id == endereco_id)
                .one_or_none()
            )
            return endereco

    def list_enderecos(self) -> list[Endereco]:
        with DBConnectionHandler() as db:
            enderecos = (
                db.session
                .query(Endereco)
                .all()
            )
            return enderecos

    def get_endereco_by_usuario(self, id_usuario: int) -> list[Endereco]:
        with DBConnectionHandler() as db:
            enderecos = (
                db.session
                .query(Endereco)
                .filter(Endereco.id_usuario == id_usuario)
                .all()
            )
            return enderecos

    def update_endereco(self, endereco_id: int, logradouro: str, bairro: str, cidade: str, estado: str, pais: str, numero: int, complemento: str, tipo: str) -> None:
        with DBConnectionHandler() as db:
            try:
                endereco = self.get_endereco_by_id(endereco_id)
                if not endereco:
                    raise Exception("Endereco não encontrado!")
                endereco.logradouro = logradouro
                endereco.bairro = bairro
                endereco.cidade = cidade
                endereco.estado = estado
                endereco.pais = pais
                endereco.numero = numero
                endereco.complemento = complemento
                endereco.tipo = tipo
                db.session.add(endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception

    def delete_endereco(self, endereco_id: int) -> None:
        with DBConnectionHandler() as db:
            try:
                endereco = self.get_endereco_by_id(endereco_id)
                if not endereco:
                    raise Exception("Endereco not found!")
                db.session.delete(endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception