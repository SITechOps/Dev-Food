from src.model.configs.base import Base
from src.model.entities.user_endereco import UserEndereco
from sqlalchemy import Column, CHAR, Integer, String
from sqlalchemy.orm import relationship
from uuid import uuid4

class Endereco(Base):
    __tablename__ = "Endereco"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    logradouro = Column(String(100))
    bairro = Column(String(100))
    cidade = Column(String(50))
    estado = Column(String(50))
    pais = Column(String(30))
    numero = Column(Integer)
    complemento = Column(String(20), nullable=True)
    tipo = None

    usuarios_associados = relationship("UserEndereco", back_populates="endereco")

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
            "tipo": self.tipo
        }