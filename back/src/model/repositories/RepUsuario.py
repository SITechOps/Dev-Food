from src.model.classes import Usuario
from src.model.interfaces.IUsuario import InterfaceUsuario
from src.model.settings.ConexaoBD import ConexaoBD
from src.model.classes.Usuario import Usuario

class RepositoryUsuario(InterfaceUsuario):
    def inserir(self, nome: str, email: str, senha: str, is_admin: bool = False) -> None:
        with ConexaoBD() as db:
            try:
                novo_usuario = Usuario(nome=nome, email=email, senha=senha, is_admin=is_admin)  # outra forma: **locals()
                db.sessao.add(novo_usuario)
                db.sessao.commit()
            except Exception as e:
                db.sessao.rollback()
                raise Exception(f"Erro ao salvar usuário no banco de dados: {e}")
        
    def selecionar_usuario(self, email_usuario: str) -> Usuario:
        with ConexaoBD() as db:
            usuario = (
                db.sessao
                .query(Usuario)
                .filter(Usuario.email == email_usuario)
                .one_or_none()
            )
            return usuario
        
    def listar_usuarios(self) -> list[Usuario]:
        with ConexaoBD() as db:
            usuarios = (
                db.sessao
                .query(Usuario)
                .all()
            )
            return usuarios