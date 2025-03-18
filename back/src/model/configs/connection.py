from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.model.configs.base import Base


class DBConnectionHandler:


    def __init__(self):
        self.__connection_string = 'mysql+mysqlconnector://dev_user:dev1234@localhost:3307/devfood'
        self.__engine = self.__create_database_engine()
        self.session = None
        Base.metadata.create_all(self.__engine) 


    def __create_database_engine(self):
        engine = create_engine(self.__connection_string)
        return engine
    

    def __enter__(self):
        session_maker = sessionmaker(bind=self.__engine)
        self.session = session_maker()
        return self
    

    def __exit__(self, *_):
        self.session.close()
