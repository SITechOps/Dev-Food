from sqlalchemy.orm import relationship
from sqlalchemy import Column, CHAR, DateTime, String, func
from src.model.configs.base import Base
from uuid import uuid4
from datetime import datetime
import pytz

tz_sp = pytz.timezone("America/Sao_Paulo")

class User(Base):
    __tablename__ = "Usuario"
    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(50))
    email = Column(String(50), unique=True)
    telefone = Column(String(15), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(tz_sp))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(tz_sp), onupdate=lambda: datetime.now(tz_sp))

    enderecos_associados = relationship("UserEndereco", back_populates="usuario")
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "telefone": self.telefone or ""
        }