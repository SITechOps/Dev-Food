from src.model.configs.base import Base
from sqlalchemy import Column, CHAR, String, Boolean
from uuid import uuid4

class User(Base):
    __tablename__ = "Usuario"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    senha = Column(String(60), nullable= False)
    is_admin = Column(Boolean)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "is_admin": bool(self.is_admin),
        }