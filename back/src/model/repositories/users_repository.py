from src.model.configs.connection import DBConnectionHandler
from src.model.entities.users import User
from .interfaces.iusers_repository import IUsersRepository

class UsersRepository(IUsersRepository):
    def create_user(self, nome: str, email: str, senha: str, is_admin: bool = False) -> None:
        with DBConnectionHandler() as db:
            try:
                new_user = User(nome=nome, email=email, senha=senha, is_admin=is_admin)  
                db.session.add(new_user)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception
                
    def get_user_by_id(self, user_id: int) -> User:
        with DBConnectionHandler() as db:
            user = (
                db.session
                .query(User)
                .filter(User.id == user_id)
                .one_or_none()
            )
            return user
        
    def list_users(self) -> list[User]:
        with DBConnectionHandler() as db:
            users = (
                db.session
                .query(User)
                .all()
            )
            return users