from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, CHAR, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from src.model.configs.base import Base

class Restaurante(Base):
    __tablename__ = "Restaurante"

    id = Column(CHAR(36), primary_key=True, default=lambda: str(uuid4()))
    nome = Column(String(50), nullable=False)
    descricao = Column(String(200), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    cnpj = Column(String(14), unique=True, nullable=False)
    razao_social = Column(String(30), unique=True, nullable=False)
    especialidade = Column(String(15), nullable=False)
    telefone = Column(String(15), nullable=False)
    horario_funcionamento = Column(String(15), nullable=False)
    banco = Column(String(30), nullable=False)
    agencia = Column(String(5), nullable=False)
    nro_conta = Column(String(13), nullable=False)
    tipo_conta = Column(String(13), nullable=False)
    logo = Column(String(200), nullable=True)
    id_endereco = Column(CHAR(36), ForeignKey("Endereco.id", ondelete="CASCADE"), nullable=False)

    endereco = relationship("Endereco", back_populates="restaurante", uselist=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "email": self.email,
            "cnpj": self.cnpj,
            "razao_social": self.razao_social,
            "especialidade": self.especialidade,
            "telefone": self.telefone,
            "horario_funcionamento": self.horario_funcionamento,
            "banco": self.banco,
            "agencia": self.agencia,
            "nro_conta": self.nro_conta,
            "tipo_conta": self.tipo_conta,
            "logo": self.logo,
            "endereco": self.endereco.to_dict() if self.endereco else None
        }