from uuid import uuid4
from sqlalchemy import Column, CHAR, ForeignKey, Numeric, Enum, String
from src.model.configs.base import Base
from random import randint

class Pedido(Base):
    __tablename__ = "Pedido"
    id = Column(CHAR(36), primary_key=True, default=lambda: randint(1000, 10000))
    valor_total = Column(Numeric(6, 2), nullable=False)
    id_usuario = Column(CHAR(36), ForeignKey("Usuario.id", ondelete="CASCADE"), nullable=False)
    id_restaurante = Column(CHAR(36), ForeignKey("Restaurante.id"), nullable=False)
    id_endereco = Column(CHAR(36), ForeignKey("Endereco.id"), nullable=False)
    forma_pagamento = Column(String(20), nullable=False)
    status = Column(String(20), default="Pendente")
    tipo_entrega = Column(String(10), default="Agora")   

    def to_dict(self):
        return {
            "id": self.id,
            "valor_total": self.valor_total,
            "data_pedido": self.created_at,
            "id_usuario": self.id_usuario,
            "id_restaurante": self.id_restaurante,
            "forma_pagamento": self.forma_pagamento,
            "status": self.status,
            "tipo_entrega": self.tipo_entrega
        }