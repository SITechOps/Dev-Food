from src.model.entities.restaurante import Restaurante
from src.model.entities.usuario_endereco import UsuarioEndereco
from src.model.configs.connection import DBConnectionHandler
from src.model.entities.endereco import Endereco
from src.main.handlers.custom_exceptions import AddressTypeAlreadyExists, AddressNotFound, MinimumOneAddressRequired
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
                    already_linked_to_user = (
                        db.session.query(UsuarioEndereco)
                        .filter_by(
                            id_usuario=id_usuario,
                            id_endereco=existing_endereco.id
                        )
                        .first()
                    )

                    if already_linked_to_user:
                        raise AddressTypeAlreadyExists("Este endereço já está associado a este tipo.")

                    endereco_id = existing_endereco.id
                else:
                    new_endereco = Endereco()
                    for key, value in endereco.items():
                        setattr(new_endereco, key, value)

                    db.session.add(new_endereco)
                    db.session.flush() 
                    endereco_id = new_endereco.id

                user_endereco = UsuarioEndereco(
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
                    UsuarioEndereco.tipo  # Inclui o campo 'tipo' da tabela associativa
                )
                .join(UsuarioEndereco, Endereco.id == UsuarioEndereco.id_endereco)
                .filter(UsuarioEndereco.id_usuario == id_usuario)
                .all()
            )

            # Atribuir o campo 'tipo' dinamicamente ao objeto Endereco
            for endereco, tipo in enderecos:
                endereco.tipo = tipo

            return [endereco for endereco, _ in enderecos]
        

    def find_by_id(self, id_endereco: str) -> Endereco:
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

                novo_endereco_existente = self.__find_existing_address(db, info_endereco)

                user_endereco = (
                    db.session
                    .query(UsuarioEndereco)
                    .filter_by(id_usuario=id_usuario, id_endereco=id_endereco)
                    .first()
                )

                if not user_endereco:
                    raise AddressNotFound("A referência para o ID do endereço não foi encontrada para esse usuário.")

                if novo_endereco_existente:
                    # Se o novo endereço já existe, apenas atualiza a referência
                    user_endereco.id_endereco = novo_endereco_existente.id
                    user_endereco.tipo = info_endereco.get("tipo", "").lower()

                    # Se ninguém mais estiver usando o antigo endereço, podemos deletar
                    if self.__is_empty(db, id_endereco):
                        endereco_antigo = self.find_by_id(id_endereco)
                        db.session.delete(endereco_antigo)

                else:
                    # Se o novo endereço ainda não existe, criamos um novo
                    novo_endereco = Endereco(**info_endereco)
                    db.session.add(novo_endereco)
                    db.session.flush()  # Para obter novo ID

                    # Atualizamos o UsuarioEndereco
                    user_endereco.id_endereco = novo_endereco.id
                    user_endereco.tipo = info_endereco.get("tipo", "").lower()

                    # Deletamos o antigo endereço, se não estiver mais sendo usado
                    if self.__is_empty(db, id_endereco):
                        endereco_antigo = self.find_by_id(id_endereco)
                        db.session.delete(endereco_antigo)

                db.session.commit()

            except Exception as exception:
                db.session.rollback()
                raise exception


    def delete(self, id_endereco: str, id_usuario: str) -> None:
        with DBConnectionHandler() as db:
            try:
                # 1. Buscar a relação UsuarioEndereco
                user_endereco = (
                    db.session.query(UsuarioEndereco)
                    .filter(
                        UsuarioEndereco.id_usuario == id_usuario,
                        UsuarioEndereco.id_endereco == id_endereco
                    )
                    .one_or_none()
                )

                if not user_endereco:
                    raise AddressNotFound()
                # Verifica quantos endereços o usuário tem
                qtd_enderecos_usuario = (
                    db.session.query(UsuarioEndereco)
                    .filter(UsuarioEndereco.id_usuario == id_usuario)
                    .count()
                )

                if qtd_enderecos_usuario <= 1:
                    raise MinimumOneAddressRequired()

                # 2. Deleta a associação com o usuário
                db.session.delete(user_endereco)
                db.session.flush()

                # 3. Verifica se o endereço ainda está associado a outro usuário ou restaurante
                endereco_usado_por_mais_alguem = self.__is_address_used(db, id_endereco)

                if not endereco_usado_por_mais_alguem:
                    endereco = self.find_by_id(id_endereco)
                    db.session.delete(endereco)

                db.session.commit()

            except Exception as exception:
                db.session.rollback()
                raise exception

    
    def __check_existing_type(self, db, id_usuario: str, tipo: str) -> None:
        existing_type = (
            db.session
            .query(UsuarioEndereco)
            .filter(UsuarioEndereco.id_usuario == id_usuario,
                    UsuarioEndereco.tipo == tipo)
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
        Verifica se o endereço está órfão (sem associações na tabela UsuarioEndereco).
        """
        remaining_associations = (
            db.session.query(UsuarioEndereco)
            .filter(UsuarioEndereco.id_endereco == id_endereco)
            .count()
        )
        return remaining_associations == 0
    

    def __is_address_used(self, db, id_endereco: str) -> bool:
        # Verifica se há alguma associação com usuários
        user_links = (
            db.session.query(UsuarioEndereco)
            .filter(UsuarioEndereco.id_endereco == id_endereco)
            .count()
        )

        # Verifica se há alguma associação com restaurantes
        restaurant_links = (
            db.session.query(Restaurante)
            .filter(Restaurante.id_endereco == id_endereco)
            .count()
        )

        return user_links > 0 or restaurant_links > 0

