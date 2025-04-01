from sqlalchemy.orm import relationship
from sqlalchemy import Column, CHAR, String
from src.model.configs.base import Base
from uuid import uuid4

class User(Base):
    __tablename__ = "Usuario"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(50))
    email = Column(String(50), unique=True)
    senha = Column(String(60))

    enderecos_associados = relationship("UserEndereco", back_populates="usuario")
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
        }