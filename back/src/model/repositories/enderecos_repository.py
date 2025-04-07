from src.model.entities.restaurante import Restaurante
from src.model.entities.user_endereco import UserEndereco
from src.model.configs.connection import DBConnectionHandler
from src.model.entities.endereco import Endereco
from src.main.handlers.custom_exceptions import AddressTypeAlreadyExists, AddressNotFound, InvalidAddressType, UserNotFound
from .interfaces.ienderecos_repository import IEnderecosRepository

class EnderecosRepository(IEnderecosRepository):


    def create(self, id_usuario: str, endereco: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                tipo = endereco.pop("tipo").lower()
                self.__check_existing_type(db, id_usuario, tipo)
                existing_endereco = self.__find_existing_address(db, endereco)
                endereco_id = ""
                if existing_endereco:
                    existing_user_endereco = (
                        db.session
                        .query(UserEndereco)
                        .filter(
                            UserEndereco.id_usuario == id_usuario,
                            UserEndereco.id_endereco == existing_endereco.id,
                        )
                        .one_or_none()
                    )
                    if existing_user_endereco:
                        raise AddressTypeAlreadyExists("Este endereço já está associado a este tipo.")
                    endereco_id = existing_endereco.id
                
                else:
                    new_endereco = Endereco()
                    for key, value in endereco.items():
                        setattr(new_endereco, key, value)

                    db.session.add(new_endereco)
                    db.session.flush()  # Garante que o ID do novo endereço seja gerado
                    endereco_id = new_endereco.id
                    
                user_endereco = UserEndereco(
                    id_usuario=id_usuario,
                    id_endereco=endereco_id,
                    tipo=tipo
                )
                db.session.add(user_endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception


    def find_all_enderecos_by_user(self, id_usuario: str) -> list[dict]:
        with DBConnectionHandler() as db:
            enderecos = (
                db.session.query(
                    Endereco,
                    UserEndereco.tipo  # Inclui o campo 'tipo' da tabela associativa
                )
                .join(UserEndereco, Endereco.id == UserEndereco.id_endereco)
                .filter(UserEndereco.id_usuario == id_usuario)
                .all()
            )

            # Atribuir o campo 'tipo' dinamicamente ao objeto Endereco
            for endereco, tipo in enderecos:
                endereco.tipo = tipo

            return [endereco for endereco, _ in enderecos]
        

    def __find_by_id(self, id_endereco: str) -> Endereco:
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


    def update(self, id_endereco: str, id_usuario: str, info_endereco: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                self.__check_existing_type(db, id_usuario, info_endereco.get("tipo"))
                existing_endereco = self.__find_existing_address(db, info_endereco)
                if existing_endereco:
                    # Atualizar a referência do id_endereco na tabela UserEndereco
                    user_endereco = (
                        db.session
                        .query(UserEndereco)
                        .filter_by(id_usuario=id_usuario, id_endereco=id_endereco)
                        .first()
                    )

                    if not user_endereco:
                        raise AddressNotFound("A referência para o ID do endereço não foi encontrada para esse usuário.")
                    
                    user_endereco.id_endereco = existing_endereco.id
                    user_endereco.tipo = info_endereco.get("tipo")

                    if self.__is_empty(db, id_endereco):
                        endereco = self.__find_by_id(id_endereco)
                        db.session.delete(endereco)
                        
                    db.session.flush()
                else:
                    user_endereco = db.session.query(UserEndereco).filter(  
                        (UserEndereco.id_usuario == id_usuario) &
                        (UserEndereco.id_endereco == id_endereco)
                    ).first()
                    
                    if not user_endereco:
                        raise AddressNotFound("A referência para o ID do endereço não foi encontrada para esse usuário.")
                    
                    endereco = db.session.query(Endereco).filter_by(id=id_endereco).first()

                    for key, value in info_endereco.items():
                        setattr(endereco, key, value)

                    db.session.flush()  # Garante que o endereço seja alterado primeiro
                    user_endereco.tipo = info_endereco.get("tipo")
                    db.session.flush()

                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception


    def delete(self, id_endereco: str, id_usuario: str) -> None:
        with DBConnectionHandler() as db:
            try:
                user_endereco = (
                    db.session.query(UserEndereco)
                    .filter(
                        UserEndereco.id_usuario == id_usuario,
                        UserEndereco.id_endereco == id_endereco
                    )
                    .one_or_none()
                )
                if not user_endereco:
                    raise AddressNotFound()
                db.session.delete(user_endereco)               

                if self.__is_empty(db, id_endereco):
                    endereco = self.__find_by_id(id_endereco)
                    db.session.delete(endereco)               
                
                db.session.commit()
                    
            except Exception as exception:
                db.session.rollback()
                raise exception
            
    
    def __check_existing_type(self, db, id_usuario: str, tipo: str) -> None:
        existing_type = (
            db.session
            .query(UserEndereco)
            .filter(UserEndereco.id_usuario == id_usuario,
                    UserEndereco.tipo == tipo)
            .one_or_none()
        )
        if existing_type:
            raise AddressTypeAlreadyExists()


    def __find_existing_address(self, db, endereco: dict) -> Endereco | None:
        return (
            db.session
            .query(Endereco)
            .filter(
                Endereco.logradouro == endereco.get("logradouro"),
                Endereco.numero == endereco.get("numero"),
                Endereco.bairro == endereco.get("bairro"),
                Endereco.cidade == endereco.get("cidade")
            )
            .one_or_none()
        )
    
    
    def __is_empty(self, db, id_endereco: str) -> bool:
        """
        Verifica se o endereço está órfão (sem associações na tabela UserEndereco).
        """
        remaining_associations = (
            db.session.query(UserEndereco)
            .filter(UserEndereco.id_endereco == id_endereco)
            .count()
        )
        return remaining_associations == 0
