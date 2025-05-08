from functools import wraps
from src.model.configs.connection import DBConnectionHandler

def db_scope(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        with DBConnectionHandler() as db:
            try:
                return func(self, db, *args, **kwargs)
            except Exception as e:
                db.session.rollback()
                raise e
    return wrapper