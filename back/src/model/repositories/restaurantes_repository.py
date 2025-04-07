from src.model.configs.connection import DBConnectionHandler
from .interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.handlers.custom_exceptions import RestaurantNotFound, RestaurantAddressAlreadyExists, AddressRequired
from src.model.entities.restaurante import Restaurante
from src.model.entities.endereco import Endereco
from src.model.entities.user_endereco import UserEndereco
from sqlalchemy.orm import joinedload

class RestaurantesRepository(IRestaurantesRepository):


    def create(self, info_restaurante: dict) -> Restaurante:
        with DBConnectionHandler() as db:
            try:
                endereco_data = info_restaurante.pop("endereco", None)
                if not endereco_data:
                    raise AddressRequired()

                restaurante_mesmo_endereco = (
                    db.session.query(Restaurante)
                    .join(Endereco)
                    .filter_by(**endereco_data)
                    .first()
                )

                if restaurante_mesmo_endereco:
                    raise RestaurantAddressAlreadyExists()

                novo_endereco = Endereco(**endereco_data)
                db.session.add(novo_endereco)
                db.session.commit()

                new_restaurante = Restaurante(id_endereco=novo_endereco.id, **info_restaurante)
                db.session.add(new_restaurante)
                db.session.commit()

                restaurante_completo = (
                    db.session.query(Restaurante)
                    .options(joinedload(Restaurante.endereco))
                    .filter_by(id=new_restaurante.id)
                    .first()
                )

                return restaurante_completo

            except Exception as exception:
                db.session.rollback()
                raise exception


    def list_all(self) -> list[Restaurante]:
        with DBConnectionHandler() as db:
            data = db.session.query(Restaurante).options(
                joinedload(Restaurante.endereco)
            ).all()
            return data


    def find_by_id(self, id_restaurante: str) -> Restaurante:
        with DBConnectionHandler() as db:
            restaurante = db.session.query(Restaurante).options(
                joinedload(Restaurante.endereco)
                ).filter(Restaurante.id == id_restaurante).one_or_none()
            if not restaurante:
                raise RestaurantNotFound()
            return restaurante


    def find_by_email(self, email_restaurante: str) -> Restaurante | None:
        with DBConnectionHandler() as db:
            return db.session.query(Restaurante).filter(Restaurante.email == email_restaurante).one_or_none()


    def update(self, id_restaurante: str, info_restaurante: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                restaurante = self.find_by_id(id_restaurante)
                if not restaurante:
                    raise RestaurantNotFound()
                
                for key, value in info_restaurante.items():
                    setattr(restaurante, key, value)
                
                db.session.add(restaurante)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception


    def update_endereco(self, id_restaurante: str, endereco_data: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                restaurante = self.find_by_id(id_restaurante)
                if not restaurante:
                    raise RestaurantNotFound()

                id_endereco_atual = restaurante.id_endereco
                campos_para_comparar = {key: endereco_data[key] for key in ['logradouro', 'numero', 'bairro', 'cidade', 'estado', 'pais','complemento']}

                endereco_existente = (
                    db.session.query(Endereco)
                    .filter_by(**campos_para_comparar)
                    .filter(Endereco.id != id_endereco_atual)
                    .first()
                )

                if endereco_existente:
                    raise RestaurantAddressAlreadyExists()

                endereco_atual = db.session.query(Endereco).get(id_endereco_atual)
                for key, value in endereco_data.items():
                    setattr(endereco_atual, key, value)

                db.session.commit()

            except Exception as exception:
                db.session.rollback()
                raise exception


    def delete(self, id_restaurante: str) -> None:
        with DBConnectionHandler() as db:
            try:
                restaurante = self.find_by_id(id_restaurante)
                if not restaurante:
                    raise RestaurantNotFound()
                
                id_endereco = restaurante.id_endereco
                db.session.delete(restaurante)
                db.session.commit()
                
                if not db.session.query(Restaurante).filter_by(id_endereco=id_endereco).first() and \
                   not db.session.query(UserEndereco).filter_by(id_endereco=id_endereco).first():
                    endereco = db.session.query(Endereco).get(id_endereco)
                    if endereco:
                        db.session.delete(endereco)
                        db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception