from src.model.configs.connection import DBConnectionHandler
from .interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.handlers.custom_exceptions import RestaurantAlreadyExists, RestaurantNotFound, RestaurantAddressAlreadyExists, AddressRequired, UsuarioAlreadyExists
from src.model.entities.restaurante import Restaurante
from src.model.entities.endereco import Endereco
from src.model.entities.usuario_endereco import UsuarioEndereco
from src.model.entities.usuario import Usuario
from src.model.entities.pedido import Pedido
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from datetime import datetime, timedelta
class RestaurantesRepository(IRestaurantesRepository):


    def create(self, info_restaurante: dict) -> Restaurante:
        with DBConnectionHandler() as db:
            try:
                endereco_data = info_restaurante.pop("endereco", None)
                if not endereco_data:
                    raise AddressRequired()
                
                email = info_restaurante.get("email")
                cnpj = info_restaurante.get("cnpj")
                razao_social = info_restaurante.get("razao_social")
                self.__verificar_duplicidade(email, cnpj, razao_social)

                restaurante_existente = (
                    db.session.query(Restaurante)
                    .join(Endereco)
                    .filter_by(**endereco_data)
                    .first()
                )
                if restaurante_existente:
                    raise RestaurantAddressAlreadyExists()

                user_endereco = (
                    db.session.query(UsuarioEndereco)
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

            except Exception as e:
                if isinstance(e, IntegrityError) and "Duplicate entry" in str(e.orig):
                    raise UsuarioAlreadyExists("Esse email já está em uso!") from e
                db.session.rollback()
                raise e


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
                    'horario_funcionamento', 'logo',
                    'razao_social', 'cnpj'
                ]

                for key in campos_permitidos:
                    if key in info_restaurante:
                        setattr(restaurante, key, info_restaurante[key])

                db.session.add(restaurante)
                db.session.commit()
            except Exception as e:
                if isinstance(e, IntegrityError) and "Duplicate entry" in str(e.orig):
                    raise UsuarioAlreadyExists("Esse email já está em uso!") from e
                db.session.rollback()
                raise e


    def update_dados_financeiros(self, id_restaurante: str, financeiro_data: dict ) -> None:
        with DBConnectionHandler() as db:
            try:
                restaurante = self.find_by_id(id_restaurante)
                if not restaurante:
                    raise RestaurantNotFound()

                campos_permitidos = [
                    'banco', 'agencia', 'nro_conta', 'tipo_conta'
                ]

                for key in campos_permitidos:
                    if key in financeiro_data:
                        setattr(restaurante, key, financeiro_data[key])

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

                endereco_em_uso_por_usuario = (
                    db.session.query(UsuarioEndereco)
                    .filter_by(id_endereco=id_endereco_atual)
                    .first()
                )

                if endereco_em_uso_por_usuario:
                    usuario_com_novo_endereco = (
                        db.session.query(UsuarioEndereco)
                        .join(Endereco, Endereco.id == UsuarioEndereco.id_endereco)
                        .filter_by(**endereco_data)
                        .first()
                    )

                    if usuario_com_novo_endereco:
                        restaurante.id_endereco = usuario_com_novo_endereco.id_endereco

                    else:
                        restaurante_existente = (
                            db.session.query(Restaurante)
                            .join(Endereco, Endereco.id == Restaurante.id_endereco)
                            .filter_by(**endereco_data)
                            .first()
                        )
                        if restaurante_existente:
                            raise RestaurantAddressAlreadyExists()

                        novo_endereco = Endereco(**endereco_data)
                        db.session.add(novo_endereco)
                        db.session.flush()
                        db.session.refresh(novo_endereco)

                        restaurante.id_endereco = novo_endereco.id
                        db.session.add(restaurante)  

                else:
                    restaurante_existente = (
                        db.session.query(Restaurante)
                        .join(Endereco, Endereco.id == Restaurante.id_endereco)
                        .filter_by(**endereco_data)
                        .first()
                    )
                    if restaurante_existente:
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
                   not db.session.query(UsuarioEndereco).filter_by(id_endereco=id_endereco).first():
                    endereco = db.session.query(Endereco).get(id_endereco)
                    if endereco:
                        db.session.delete(endereco)
                        db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception
            

    def relatorio_receita_bruta(self, data_inicio: str = None, data_fim: str = None) -> list[dict]:
        with DBConnectionHandler() as db:
            try:
                query = (
                    db.session.query(
                        Restaurante.nome.label("nome"),
                        func.sum(Pedido.valor_total).label("receita_bruta")
                    )
                    .select_from(Pedido)
                    .join(Restaurante, Restaurante.id == Pedido.id_restaurante)
                    .group_by(Restaurante.nome)
                    .order_by(func.sum(Pedido.valor_total).desc())  
                )

                if data_inicio and data_fim:
                    data_inicio_dt = datetime.strptime(data_inicio, "%Y-%m-%d")
                    data_fim_dt = datetime.strptime(data_fim, "%Y-%m-%d") + timedelta(days=1)

                    query = query.filter(Pedido.created_at >= data_inicio_dt)
                    query = query.filter(Pedido.created_at < data_fim_dt)

                resultados = query.all()

                receita_total = sum(row.receita_bruta for row in resultados)

                relatorio = [
                    {
                        "nome": row.nome,
                        "receita_bruta": float(row.receita_bruta),
                        "porcentagem_total": round((row.receita_bruta / receita_total) * 100, 2) if receita_total > 0 else 0.0
                    }
                    for row in resultados
                ]
                return relatorio

            except Exception as e:
                raise e


    def relatorio_qtd_pedidos(self, data_inicio: str = None, data_fim: str = None) -> list[dict]:
        with DBConnectionHandler() as db:
            try:
                query = (
                    db.session.query(
                        Restaurante.nome.label("nome"),
                        func.count(Pedido.id).label("quantidade_pedidos")
                    )
                    .select_from(Pedido)
                    .join(Restaurante, Restaurante.id == Pedido.id_restaurante)
                    .group_by(Restaurante.nome)
                    .order_by(func.count(Pedido.id).desc())  
                )

                if data_inicio and data_fim:
                    data_inicio_dt = datetime.strptime(data_inicio, "%Y-%m-%d")
                    data_fim_dt = datetime.strptime(data_fim, "%Y-%m-%d") + timedelta(days=1)

                    query = query.filter(Pedido.created_at >= data_inicio_dt)
                    query = query.filter(Pedido.created_at < data_fim_dt)

                resultados = query.all()

                total_pedidos = sum(row.quantidade_pedidos for row in resultados)

                relatorio = [
                    {
                        "nome": row.nome,
                        "quantidade_pedidos": row.quantidade_pedidos,
                        "porcentagem_total": round((row.quantidade_pedidos / total_pedidos) * 100, 2) if total_pedidos > 0 else 0.0
                    }
                    for row in resultados
                ]

                return relatorio

            except Exception as e:
                raise e

    
    def relatorio_forma_pagamento_mais_usada(self, data_inicio: str = None, data_fim: str = None) -> list[dict]:
        with DBConnectionHandler() as db:
            try:
                subquery = (
                    db.session.query(
                        Pedido.id_restaurante,
                        Pedido.forma_pagamento,
                        func.count(Pedido.id).label("total")
                    )
                    .group_by(Pedido.id_restaurante, Pedido.forma_pagamento)
                )

                if data_inicio and data_fim:
                    data_inicio_dt = datetime.strptime(data_inicio, "%Y-%m-%d")
                    data_fim_dt = datetime.strptime(data_fim, "%Y-%m-%d") + timedelta(days=1)
                    subquery = subquery.filter(Pedido.created_at >= data_inicio_dt)
                    subquery = subquery.filter(Pedido.created_at < data_fim_dt)

                subquery = subquery.subquery()

                query = (
                    db.session.query(
                        Restaurante.nome.label("nome"),
                        subquery.c.forma_pagamento,
                        subquery.c.total
                    )
                    .join(Restaurante, Restaurante.id == subquery.c.id_restaurante)
                )

                results = query.all()

                pagamentos_por_restaurante = {}
                for row in results:
                    nome = row.nome
                    if nome not in pagamentos_por_restaurante:
                        pagamentos_por_restaurante[nome] = []
                    pagamentos_por_restaurante[nome].append({
                        "forma_pagamento": row.forma_pagamento.capitalize(),
                        "total": row.total
                    })

                relatorio = []
                for nome, pagamentos in pagamentos_por_restaurante.items():
                    max_total = max(p["total"] for p in pagamentos)
                    formas_mais_usadas = [
                        p["forma_pagamento"] for p in pagamentos if p["total"] == max_total
                    ]
                    formas_concatenadas = " / ".join(sorted(formas_mais_usadas))

                    relatorio.append({
                        "nome": nome,
                        "forma_pagamento_mais_usada": formas_concatenadas,
                        "total_usos": max_total
                    })

                return relatorio

            except Exception as e:
                raise e


    def update_image_path(self, id_restaurante: str, image_url: str) -> None:
        with DBConnectionHandler() as db:
            try:
                restaurante = db.session.query(Restaurante).filter_by(id=id_restaurante).first()
                if not restaurante:
                    raise ValueError("Restaurante não encontrado")

                restaurante.logo  = image_url 
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e


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
                
            