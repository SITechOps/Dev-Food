from uuid import uuid4
from sqlalchemy import Column, CHAR, String
from sqlalchemy.orm import relationship
from src.model.configs.base import Base

class User(Base):
    __tablename__ = "Usuario"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    telefone = Column(String(15))

    enderecos_associados = relationship("UserEndereco", back_populates="usuario", cascade="all, delete-orphan")
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone or ""
        }