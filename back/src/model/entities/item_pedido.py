from uuid import uuid4
from sqlalchemy import Column, CHAR, ForeignKey, Integer, Numeric
from src.model.configs.base import Base

class ItemPedido(Base):
    __tablename__ = "ItemPedido"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    id_pedido = Column(CHAR(36), ForeignKey("Pedido.id", ondelete="CASCADE"), nullable=False)
    id_produto = Column(CHAR(36), ForeignKey("Produto.id", ondelete="CASCADE"), nullable=False)
    qtd_itens = Column(Integer, nullable=False)
    valor_calculado = Column(Numeric(5, 2), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "id_pedido": self.id_pedido,
            "id_produto": self.id_produto,
            "qtd_itens": self.qtd_itens,
            "valor_calculado": self.valor_calculado
        }