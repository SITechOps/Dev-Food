from src.main.utils.db_scope import db_scope
from src.model.entities.usuario import Usuario
from sqlalchemy.orm import with_polymorphic

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
            .query(with_polymorphic(Usuario, "*"))
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
    def update(self, db, usuario_atual: Usuario, dados_atualizados: dict) -> None:
        usuario_atual.nome = dados_atualizados.get("nome")
        usuario_atual.telefone = dados_atualizados.get("telefone")
        db.session.add(usuario_atual)
        db.session.commit()


    @db_scope
    def delete(self, db, usuario: Usuario) -> None:
        db.session.delete(usuario)
        db.session.commit()