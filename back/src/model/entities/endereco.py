from src.model.configs.base import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class Endereco(Base):
    __tablename__ = "Endereco"
    id = Column(Integer, primary_key=True, autoincrement=True)
    logradouro = Column(String(100))
    bairro = Column(String(100))
    cidade = Column(String(50))
    estado = Column(String(50))
    pais = Column(String(30))
    numero = Column(Integer)
    complemento = Column(String(10), nullable=True)
    tipo = Column(String(20))
    id_usuario = Column(Integer, ForeignKey("User.id"))