from src.model.configs.base import Base
from sqlalchemy import Column, String, Boolean
from uuid import uuid4

class User(Base):
    __tablename__ = "Usuario"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(50))
    email = Column(String(50), unique=True)
    senha = Column(String(12))
    is_admin = Column(Boolean)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "is_admin": bool(self.is_admin),
        }