from src.model.configs.base import Base
from sqlalchemy import Column, CHAR, DateTime, Integer, String, ForeignKey, UniqueConstraint, func
from src.main.handlers.custom_exceptions import InvalidAddressType
from sqlalchemy.orm import validates
from uuid import uuid4

class Restaurante(Base):
    __tablename__ = "Restaurante"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(100))
    avaliacao = Column(String(100))
    categoria = Column(String(50))
    descrição = Column(String(100))
    endereco = Column(String(100))
    horario_funcionamento = Column(String(100))
    id_usuario = Column(CHAR(36), ForeignKey("Usuario.id", ondelete="CASCADE"))
    tipo = Column(String(100))

    __table_args__ = (UniqueConstraint('tipo', 'id_usuario'),)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "logradouro": self.logradouro,
            "bairro": self.bairro,
            "cidade": self.cidade,
            "estado": self.estado,
            "pais": self.pais,
            "numero": self.numero,
            "complemento": self.complemento,
            "tipo": self.tipo,
        }
    
    @validates('tipo')
    def check_address_type(self, _, value):
        if value.lower() not in ["casa", "trabalho"]:
            raise InvalidAddressType()
        return value.lower()
