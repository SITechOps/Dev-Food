from sqlalchemy import Column, CHAR, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.model.entities.usuario import Usuario

class Restaurante(Usuario):
    __tablename__ = "Restaurante"

    id = Column(CHAR(36), ForeignKey("Usuario.id"), primary_key=True)
    cnpj = Column(String(14), unique=True, nullable=False)
    razao_social = Column(String(30), unique=True, nullable=False)
    especialidade = Column(String(15), nullable=False)
    descricao = Column(String(255), nullable=False)
    horario_funcionamento = Column(String(15), nullable=False)
    banco = Column(String(30), nullable=False)
    agencia = Column(String(5), nullable=False)
    nro_conta = Column(String(13), nullable=False)
    tipo_conta = Column(String(13), nullable=False)
    logo = Column(Text, nullable=True)
    id_endereco = Column(CHAR(36), ForeignKey("Endereco.id", ondelete="CASCADE"), nullable=False)

    endereco = relationship("Endereco", back_populates="restaurante", uselist=False)
    produtos = relationship("Produto", back_populates="restaurante", cascade="all, delete-orphan")

    __mapper_args__ = {
        "polymorphic_identity": "restaurante"
    }

    def to_dict(self) -> dict:
        return {
            **super().to_dict(),
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
            "endereco": self.endereco.to_dict() or {}
        }