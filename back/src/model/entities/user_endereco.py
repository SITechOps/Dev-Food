from uuid import uuid4
from src.model.configs.base import Base
from sqlalchemy import Column, CHAR, DateTime, String, ForeignKey, UniqueConstraint, PrimaryKeyConstraint, func
from sqlalchemy.orm import relationship

class UserEndereco(Base):
    __tablename__ = "UserEndereco"
    
    id_usuario = Column(CHAR(36), ForeignKey("Usuario.id", ondelete="CASCADE"), nullable=False)
    id_endereco = Column(CHAR(36), ForeignKey("Endereco.id", ondelete="CASCADE"), nullable=False)
    tipo = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    usuario = relationship("User", back_populates="enderecos_associados")
    endereco = relationship("Endereco", back_populates="usuarios_associados")

    __table_args__ = (
        PrimaryKeyConstraint("id_usuario", "id_endereco", name="pk_user_endereco"),
        UniqueConstraint("id_usuario", "tipo", name="unique_usuario_tipo"),
    )
