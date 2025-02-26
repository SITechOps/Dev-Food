from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.model.settings.Base import Base

class ConexaoBD:
    def __init__(self):
        self.__string_conexao = 'mysql+mysqlconnector://meu_usuario:minha_senha@localhost:3307/meu_banco'
        self.__motor_conexao = self.__criar_conexao()
        self.sessao = None
        Base.metadata.create_all(self.__motor_conexao) # Para criar as tabelas

    def __criar_conexao(self):
        return create_engine(self.__string_conexao)

    def __enter__(self):
        GeradorSessao = sessionmaker(bind=self.__motor_conexao)
        self.sessao = GeradorSessao()
        return self
    
    def __exit__(self, *_):
        self.sessao.close()
