from flask import Blueprint
from .utils import create_error_response
from src.main.handlers.custom_exceptions import *
from sqlalchemy.exc import DatabaseError

handlers_bp = Blueprint("handlers", __name__)


@handlers_bp.app_errorhandler(BaseCustomException)
def handle_exceptions(error):
    return create_error_response(error.message, error.status_code)


@handlers_bp.app_errorhandler(DatabaseError)
def handle_database_error(error):
    error_message = f"{error.args[0]} | Não foi possível conectar ao banco de dados! Verifique sua conexão ou tente novamente mais tarde!"
    return create_error_response(error_message, 500)


@handlers_bp.app_errorhandler(404)
def handle_value_error(error):
    return create_error_response("Página não encontrada!", error.code)


@handlers_bp.app_errorhandler(405)
def handle_value_error(error):
    return create_error_response("Método não permitido!", error.code)
  
