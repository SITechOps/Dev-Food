from src.main.utils.db_scope import db_scope
from src.model.entities.item_pedido import ItemPedido

class ItensRepository:
    
    @db_scope
    def insert_item_pedido(self, db, id_pedido: str, info_item: dict) -> None:
        item_pedido = ItemPedido(
            id_pedido=id_pedido,
            **info_item
        )
        db.session.add(item_pedido)
        db.session.commit()


    @db_scope
    def list_items_by_pedido(self, db, id_pedido: str) -> None:
        return (
            db.session
            .query(ItemPedido)
            .filter_by(id_pedido=id_pedido)
            .all()
        )