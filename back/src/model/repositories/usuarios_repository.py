from src.main.handlers.custom_exceptions import EmailChangeNotAllowed, UsuarioNotFound
from src.model.configs.connection import DBConnectionHandler
from src.model.entities.usuario import Usuario
from .interfaces.iusuarios_repository import IUsuariosRepository
from sqlalchemy.orm import with_polymorphic

class UsuariosRepository(IUsuariosRepository):

    
    def insert(self, user_info: dict) -> Usuario:
        with DBConnectionHandler() as db:
            try:
                new_user = Usuario(**user_info)
                db.session.add(new_user)
                db.session.commit()
                db.session.refresh(new_user)
                return new_user
            except Exception as exception:
                db.session.rollback()
                raise exception
                

    def find_by_id(self, user_id: str) -> Usuario:
        with DBConnectionHandler() as db:
            user = (
                db.session
                .query(Usuario)
                .filter(Usuario.id == user_id)
                .one_or_none()
            )
            if not user: raise UsuarioNotFound()
            return user
        

    def find_by_email(self, user_email: str) -> Usuario | None:
        with DBConnectionHandler() as db:
            user = (
                db.session
                .query(Usuario)
                .filter(Usuario.email == user_email)
                .one_or_none()
            )
            return user
        

    def find_all_users(self) -> list[Usuario]:
        with DBConnectionHandler() as db:
            try:
                users = (
                    db.session
                    .query(Usuario)
                    .filter_by(role="usuario")
                    .all()
                )
                return users
            except Exception as exception:
                db.session.rollback()
                raise exception
    

    def update(self, user_id: str, user_info: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                user = self.find_by_id(user_id)
                if user.email != user_info.get("email"):
                    raise EmailChangeNotAllowed()     
                user.nome = user_info.get("nome")
                user.telefone = user_info.get("telefone")
                db.session.add(user)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception
    

    def delete(self, user_id: str) -> None:
        with DBConnectionHandler() as db:
            try:
                user = self.find_by_id(user_id)     
                db.session.delete(user)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception