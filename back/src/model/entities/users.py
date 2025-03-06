from src.model.configs.base import Base
from sqlalchemy import Column, Integer, String, Boolean

class User(Base):

    
    __tablename__ = "Usuario"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(50))
    email = Column(String(50), unique=True)
    senha = Column(String(12))
    is_admin = Column(Boolean)
    #is_admin = Boolean


    def __repr__(self):
        return (
            f"{self.id} | {self.nome} | {self.email} | "
            f"{self.senha} | {'Admin' if self.is_admin else 'User'}"
        )
    

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "is_admin": bool(self.is_admin),
        }