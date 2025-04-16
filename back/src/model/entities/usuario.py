from uuid import uuid4
from sqlalchemy import Column, CHAR, String
from sqlalchemy.orm import relationship
from src.model.configs.base import Base

class Usuario(Base):
    __tablename__ = "Usuario"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    telefone = Column(String(15))
    role = Column(String(11))

    enderecos_associados = relationship("UsuarioEndereco", back_populates="usuario", cascade="all, delete-orphan")
    
    __mapper_args__ = {
        "polymorphic_identity": "usuario",
        "polymorphic_on": "role"
    }

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone or ""
        }