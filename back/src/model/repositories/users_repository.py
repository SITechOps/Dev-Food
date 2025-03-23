from src.main.handlers.custom_exceptions import UserNotFound
from src.model.configs.connection import DBConnectionHandler
from src.model.entities.users import User
from .interfaces.iusers_repository import IUsersRepository

class UsersRepository(IUsersRepository):

    
    def insert(self, user_info: dict, is_admin: bool = False) -> None:
        with DBConnectionHandler() as db:
            try:
                new_user = User(
                    nome=user_info.get("nome"),
                    email=user_info.get("email"),
                    senha=user_info.get("senha"),
                    is_admin=is_admin
                )  
                db.session.add(new_user)
                db.session.commit()
                return new_user.id
            except Exception as exception:
                db.session.rollback()
                raise exception
                

    def find_by_id(self, user_id: int) -> User | None:
        with DBConnectionHandler() as db:
            user = (
                db.session
                .query(User)
                .filter(User.id == user_id)
                .one_or_none()
            )
            if not user: raise UserNotFound()
            return user
        

    def find_by_email(self, user_email: str) -> User | None:
        with DBConnectionHandler() as db:
            user = (
                db.session
                .query(User)
                .filter(User.email == user_email)
                .one_or_none()
            )
            return user
        

    def find_all_users(self) -> list[User]:
        with DBConnectionHandler() as db:
            users = (
                db.session
                .query(User)
                .all()
            )
            return users
    

    def update(self, user_id: int, user_info: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                user = self.find_by_id(user_id)        
                user.nome = user_info.get("nome")
                user.senha = user_info.get("senha")
                db.session.add(user)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception
    

    def delete(self, user_id: int) -> None:
        with DBConnectionHandler() as db:
            try:
                user = self.find_by_id(user_id)     
                db.session.delete(user)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception