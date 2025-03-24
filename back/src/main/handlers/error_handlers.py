from flask import Blueprint
from src.main.utils.response_formatter import ResponseFormatter
from src.main.handlers.custom_exceptions import *
from sqlalchemy.exc import DatabaseError, DataError, IntegrityError

handlers_bp = Blueprint("handlers", __name__)


@handlers_bp.app_errorhandler(BaseCustomException)
def handle_exceptions(error):
    return ResponseFormatter.format_error(error.message, error.status_code)  


@handlers_bp.app_errorhandler(DatabaseError)
def handle_database_error(error):
    error_message = f"Não foi possível conectar com o banco de dados!"
    error_details = error.args[0]
    return ResponseFormatter.format_error(error_message, 500, error_details)


@handlers_bp.app_errorhandler(DataError)
@handlers_bp.app_errorhandler(IntegrityError)
def handle_database_error(error):
    error_message = f"Ocorreu um erro ao processar seus dados!"
    error_details = error.args[0]
    return ResponseFormatter.format_error(error_message, 400, error_details)


@handlers_bp.app_errorhandler(404)
@handlers_bp.app_errorhandler(405)
def handle_http_errors(error):
    if error.code == 404:
        return ResponseFormatter.format_error("Página não encontrada!", error.code)
    elif error.code == 405:
        return ResponseFormatter.format_error("Método não permitido!", error.code)