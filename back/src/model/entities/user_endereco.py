from datetime import datetime
from src.model.configs.base import Base
from sqlalchemy import Column, CHAR, String, ForeignKey, UniqueConstraint, PrimaryKeyConstraint
from sqlalchemy.orm import relationship

class UserEndereco(Base):
    __tablename__ = "UserEndereco"
    
    id_usuario = Column(CHAR(36), ForeignKey("Usuario.id", ondelete="CASCADE"), nullable=False)
    id_endereco = Column(CHAR(36), ForeignKey("Endereco.id", ondelete="CASCADE"), nullable=False)
    tipo = Column(String(10), nullable=False)

    usuario = relationship("User", back_populates="enderecos_associados")
    endereco = relationship("Endereco", back_populates="usuarios_associados")

    __table_args__ = (
        PrimaryKeyConstraint("id_usuario", "id_endereco", name="pk_user_endereco"),
        UniqueConstraint("id_usuario", "tipo", name="unique_usuario_tipo"),
    )
