from src.main.handlers.custom_exceptions import ProductAlreadyExists
from src.model.configs.connection import DBConnectionHandler
from .interfaces.iprodutos_repository import IProdutosRepository
from src.model.entities.produto import Produto
from sqlalchemy.exc import IntegrityError

class ProdutosRepository(IProdutosRepository):
    
    def insert(self, produto_info: dict, id_restaurante: str) -> None:
        with DBConnectionHandler() as db:
            try:
                new_produto = Produto(
                    **produto_info,
                    id_restaurante=id_restaurante
                )
                db.session.add(new_produto)
                db.session.commit()
                db.session.refresh(new_produto) 
                return new_produto
            except Exception as e:
                db.session.rollback()
                raise e
                

    def find_by_id(self, id_produto: str) -> Produto | None:
        with DBConnectionHandler() as db:
            try:
                produto = (
                    db.session
                    .query(Produto)
                    .filter(Produto.id == id_produto)
                    .one_or_none()
                )
                return produto
            except Exception as e:
                db.session.rollback()
                raise e
            

    def find_by_name(self, nome_produto: str, id_restaurante: str) -> Produto | None:
        with DBConnectionHandler() as db:
            try:
                produto = (
                    db.session
                    .query(Produto)
                    .filter(
                        Produto.nome == nome_produto,
                        Produto.id_restaurante == id_restaurante
                    )
                    .one_or_none()
                )
                return produto
            except Exception as e:
                db.session.rollback()
                raise e
        

    def list_products_by_restaurante(self, restaurante_id: str) -> list[Produto]:
        with DBConnectionHandler() as db:
            try:
                produtos = (
                    db.session
                    .query(Produto)
                    .filter_by(id_restaurante=restaurante_id)
                    .all()
                )
                return produtos
            except Exception as e:
                db.session.rollback()
                raise e
            

    def list_all_products(self) -> list[Produto]:
        with DBConnectionHandler() as db:
            try:
                produtos = (
                    db.session
                    .query(Produto)
                    .all()
                )
                return produtos
            except Exception as e:
                db.session.rollback()
                raise e
    

    def update(self, id_produto: str, produto_info: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                produto = self.find_by_id(id_produto)

                for chave, valor in produto_info.items():
                    setattr(produto, chave, valor)

                db.session.add(produto)
                db.session.commit()
            except Exception as e:
                db.session.rollback()

                if isinstance(e, IntegrityError) and "Duplicate entry" in str(e.orig):
                    raise ProductAlreadyExists() from e
                
                raise e
    

    def delete(self, id_produto: str) -> None:
        with DBConnectionHandler() as db:
            try:
                produto = self.find_by_id(id_produto)     
                db.session.delete(produto)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception

    
    def update_image_path(self, id_produto: str, image_url: str) -> None:
        with DBConnectionHandler() as db:
            try:
                produto = db.session.query(Produto).filter_by(id=id_produto).first()
                if not produto:
                    raise ValueError("Produto não encontrado")

                produto.image_url  = image_url 
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                raise e
