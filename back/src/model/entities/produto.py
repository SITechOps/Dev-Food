from uuid import uuid4
from sqlalchemy import Column, CHAR, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from src.model.configs.base import Base

class Produto(Base):
    __tablename__ = "Produto"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(100))
    descricao = Column(String(255))
    valor_unitario = Column(Numeric(5, 2))
    qtd_estoque = Column(Integer)
    imageUrl = Column(Text, nullable=True)

    id_restaurante = Column(CHAR(36), ForeignKey("Restaurante.id", ondelete="CASCADE"), nullable=False)

    restaurante = relationship("Restaurante", back_populates="produtos")

    __table_args__ = (
        UniqueConstraint("nome", "id_restaurante", name="uq_nome_restaurante"),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "valor_unitario": self.valor_unitario,
            "qtd_estoque": self.qtd_estoque,
            "imageUrl": self.imageUrl or ""
        }