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
                return new_user.id
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
        

    def get_user_by_email(self, user_email: str) -> User:
        with DBConnectionHandler() as db:
            user = (
                db.session
                .query(User)
                .filter(User.email == user_email)
                .one_or_none()
            )
            return user
    

    def update_user(self, user_id: int, nome: str, senha: str) -> None:
        with DBConnectionHandler() as db:
            try:
                user = self.get_user_by_id(user_id)     
                if not user:
                    raise Exception("User not found!")      
                user.nome = nome
                user.senha = senha
                db.session.add(user)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception
    

    def delete_user(self, user_id: int) -> None:
        with DBConnectionHandler() as db:
            try:
                user = self.get_user_by_id(user_id)
                if not user:
                    raise Exception("User not found!")      
                db.session.delete(user)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception