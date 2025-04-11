from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from alembic.migration import MigrationContext
from alembic.autogenerate import compare_metadata
from src.model.configs.base import Base


class DBConnectionHandler:


    def __init__(self):
        self.__connection_string = 'mysql+mysqlconnector://dev_user:dev1234@localhost:3307/devfood'
        self.__engine = self.__create_database_engine()
        self.session = None
        self.__reset_if_necessary()


    def __create_database_engine(self):
        engine = create_engine(self.__connection_string)
        return engine


    def __enter__(self):
        session_maker = sessionmaker(bind=self.__engine)
        self.session = session_maker()
        return self


    def __exit__(self, *_):
        self.session.close()


    def __reset_if_necessary(self):
        with self.__engine.connect() as connection:
            insp = inspect(connection)
            ctx = MigrationContext.configure(connection)
            diffs = compare_metadata(ctx, Base.metadata)

            if diffs:
                print("🚨 Diferença detectada. Resetando banco...")
                connection.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
                for table in reversed(insp.get_table_names()):
                    connection.execute(text(f"DROP TABLE IF EXISTS `{table}`"))
                connection.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
                Base.metadata.create_all(self.__engine)