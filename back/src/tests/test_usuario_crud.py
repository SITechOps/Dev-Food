import pytest
from src.model.repositories.RepUsuario import RepositoryUsuario

db = RepositoryUsuario()

def test_inserir_dados():
    dados = {
        "nome": "rodrigo",
        "email": "rodrigo4@gmail.com",
        "senha": "1234"
        }
    db.inserir(**dados)

def test_selecionar_usuario():
    email = "rodrigo@gmail.com"
    usuario = db.selecionar_usuario(email)
    print(usuario)

@pytest.mark.skip
def test_listar_usuario():
    lista_usuarios = db.listar_usuarios()
    print(lista_usuarios)