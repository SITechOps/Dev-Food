from src.model.repositories.RepUsuario import RepositoryUsuario
from flask import Blueprint, request

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.get("/hi")
def teste():
    return "Hi Lorena"

@usuario_bp.post("/users")
def create_user():
    response = request.json
    dados = {
        "nome": response.get('nome'),
        "email": response.get('email'),
        "senha": response.get('senha')
    }

    db_user = RepositoryUsuario()
    db_user.inserir(**dados)