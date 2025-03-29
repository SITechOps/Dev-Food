from src.model.configs.base import Base
from sqlalchemy import Column, CHAR, Integer, String, ForeignKey, UniqueConstraint
from src.main.handlers.custom_exceptions import InvalidAddressType
from sqlalchemy.orm import validates

class Endereco(Base):
    __tablename__ = "Endereco"
    id = Column(Integer, primary_key=True, autoincrement=True)
    logradouro = Column(String(100))
    bairro = Column(String(100))
    cidade = Column(String(50))
    estado = Column(String(50))
    pais = Column(String(30))
    numero = Column(Integer)
    complemento = Column(String(20), nullable=True)
    tipo = Column(String(20))
    id_usuario = Column(CHAR(36), ForeignKey("Usuario.id", ondelete="CASCADE"))

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
