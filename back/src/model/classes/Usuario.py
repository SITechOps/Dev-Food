from sqlalchemy import Column, Integer, String, Boolean
from src.model.settings.Base import Base

class Usuario(Base):
    __tablename__ = "Usuario"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(50))
    email = Column(String(50), unique=True)
    senha = Column(String(12))
    is_admin = Boolean

    def __repr__(self):
        return (
            f"{self.id} | {self.nome} | {self.email} | "
            f"{self.senha} | {'Admin' if self.is_admin else 'User'}"
        )