from src.model.configs.connection import DBConnectionHandler
from .interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.handlers.custom_exceptions import RestaurantAlreadyExists, RestaurantNotFound, RestaurantAddressAlreadyExists, AddressRequired
from src.model.entities.restaurante import Restaurante
from src.model.entities.endereco import Endereco
from src.model.entities.user_endereco import UserEndereco
from sqlalchemy.orm import joinedload
from sqlalchemy import or_

class RestaurantesRepository(IRestaurantesRepository):


    def create(self, info_restaurante: dict) -> Restaurante:
        with DBConnectionHandler() as db:
            try:
                endereco_data = info_restaurante.pop("endereco", None)
                if not endereco_data:
                    raise AddressRequired()

                restaurante_existente = (
                    db.session.query(Restaurante)
                    .join(Endereco)
                    .filter_by(**endereco_data)
                    .first()
                )
                if restaurante_existente:
                    raise RestaurantAddressAlreadyExists()
                
                email = info_restaurante.get("email")
                cnpj = info_restaurante.get("cnpj")
                razao_social = info_restaurante.get("razao_social")
                self.__verificar_duplicidade(email, cnpj, razao_social)

                user_endereco = (
                    db.session.query(UserEndereco)
                    .join(Endereco)
                    .filter_by(**endereco_data)
                    .first()
                )

                if user_endereco:
                    id_endereco = user_endereco.id_endereco
                else:
                    novo_endereco = Endereco(**endereco_data)
                    db.session.add(novo_endereco)
                    db.session.flush()
                    id_endereco = novo_endereco.id

                restaurante = Restaurante(id_endereco=id_endereco, **info_restaurante)
                db.session.add(restaurante)
                db.session.commit()

                return (
                    db.session.query(Restaurante)
                    .options(joinedload(Restaurante.endereco))
                    .filter_by(id=restaurante.id)
                    .first()
                )

            except Exception:
                db.session.rollback()
                raise


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
                
                email = info_restaurante.get("email")
                cnpj = info_restaurante.get("cnpj")
                razao_social = info_restaurante.get("razao_social")
                self.__verificar_duplicidade(email, cnpj, razao_social, ignorar_id=id_restaurante)

                campos_permitidos = [
                    'nome', 'descricao', 'email', 'telefone', 'especialidade',
                    'horario_funcionamento', 'logo', 'banco', 'agencia', 'nro_conta', 'tipo_conta',
                    'razao_social', 'cnpj'
                ]

                for key in campos_permitidos:
                    if key in info_restaurante:
                        setattr(restaurante, key, info_restaurante[key])

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

                # Verifica se o endereço atual está sendo usado por algum usuário
                endereco_em_uso_por_usuario = (
                    db.session.query(UserEndereco)
                    .filter_by(id_endereco=id_endereco_atual)
                    .first()
                )

                if endereco_em_uso_por_usuario:
                    # Existe algum usuário com o novo endereço?
                    usuario_com_novo_endereco = (
                        db.session.query(UserEndereco)
                        .join(Endereco, Endereco.id == UserEndereco.id_endereco)
                        .filter_by(**endereco_data)
                        .first()
                    )

                    if usuario_com_novo_endereco:
                        # Reutiliza endereço já existente de usuário
                        restaurante.id_endereco = usuario_com_novo_endereco.id_endereco

                    else:
                        # Verifica se já existe restaurante com esse novo endereço
                        restaurante_existente = (
                            db.session.query(Restaurante)
                            .join(Endereco, Endereco.id == Restaurante.id_endereco)
                            .filter_by(**endereco_data)
                            .first()
                        )
                        if restaurante_existente:
                            raise RestaurantAddressAlreadyExists()

                        # Cria novo endereço e associa ao restaurante
                        novo_endereco = Endereco(**endereco_data)
                        db.session.add(novo_endereco)
                        db.session.flush()  # para obter ID antes do commit
                        restaurante.id_endereco = novo_endereco.id

                else:
                    # Endereço atual NÃO está em uso por usuários
                    # Verifica se já existe restaurante com novo endereço
                    restaurante_existente = (
                        db.session.query(Restaurante)
                        .join(Endereco, Endereco.id == Restaurante.id_endereco)
                        .filter_by(**endereco_data)
                        .first()
                    )
                    if restaurante_existente:
                        raise RestaurantAddressAlreadyExists()

                    # Atualiza endereço atual com os dados novos
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


    def __verificar_duplicidade(self, email=None, cnpj=None, razao_social=None, ignorar_id=None):
        with DBConnectionHandler() as db:
            if email:
                query = db.session.query(Restaurante).filter(Restaurante.email == email)
                if ignorar_id:
                    query = query.filter(Restaurante.id != ignorar_id)
                if query.first():
                    raise RestaurantAlreadyExists(f"Já existe um restaurante com este e-mail!")

            if cnpj:
                query = db.session.query(Restaurante).filter(Restaurante.cnpj == cnpj)
                if ignorar_id:
                    query = query.filter(Restaurante.id != ignorar_id)
                if query.first():
                    raise RestaurantAlreadyExists(f"Já existe um restaurante com este CNPJ!")

            if razao_social:
                query = db.session.query(Restaurante).filter(Restaurante.razao_social == razao_social)
                if ignorar_id:
                    query = query.filter(Restaurante.id != ignorar_id)
                if query.first():
                    raise RestaurantAlreadyExists(f"Já existe um restaurante com esta razão social!")