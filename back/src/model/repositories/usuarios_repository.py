from src.main.utils.db_scope import db_scope
from src.main.handlers.custom_exceptions import EmailChangeNotAllowed, NotFound, UsuarioNotFound
from src.model.entities.usuario import Usuario

class UsuariosRepository:

    @db_scope
    def insert(self, db, info_usuario: dict) -> str:
        usuario = Usuario(**info_usuario)
        db.session.add(usuario)
        db.session.commit()
        return usuario.id


    @db_scope
    def find_by_id(self, db, id_usuario: str) -> Usuario | None:
        return (
            db.session
            .query(Usuario)
            .filter_by(id=id_usuario)
            .one_or_none()
        )


    @db_scope
    def find_by_email(self, db, email: str) -> Usuario | None:
        return (
            db.session
            .query(Usuario)
            .filter_by(email=email)
            .one_or_none()
        )


    @db_scope
    def find_all_users(self, db) -> list[Usuario]:
        return (
            db.session
            .query(Usuario)
            .filter_by(role="usuario")
            .all()
        )


    @db_scope
    def update(self, db, id_usuario: str, info_usuario: dict) -> None:
        user = (
            db.session
            .query(Usuario)
            .filter_by(id=id_usuario)
            .one_or_none()
        )       
        user.nome = info_usuario.get("nome")
        user.telefone = info_usuario.get("telefone")
        db.session.add(user)
        db.session.commit()


    @db_scope
    def delete(self, db, id_usuario: str) -> None:
        user = self.find_by_id(id_usuario)
        db.session.delete(user)
        db.session.commit()