from src.main.utils.db_scope import db_scope
from src.model.entities.pedido import Pedido

class PedidosRepository:

    @db_scope
    def insert_pedido(self, db, info_pedido) -> str:
        pedido = Pedido(**info_pedido)
        db.session.add(pedido)
        db.session.commit()
        return pedido.id


    @db_scope
    def list_products_by_user(self, db, id_usuario: str) -> list[Pedido]:
        return (
            db.session
            .query(Pedido)
            .filter_by(id_usuario=id_usuario)
            .all()
        )