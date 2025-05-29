from flask import Blueprint, jsonify # current_app foi removido daqui, pois o logger está no manager
# import requests # Não é mais necessário aqui se toda a lógica está no manager
from src.controllers.cpnj_manager import CNPJManager # Importe o novo manager

proxy_api_bp = Blueprint('proxy_api', __name__)

@proxy_api_bp.route('/consulta-cnpj/<string:cnpj_numeros>', methods=['GET'])
def consultar_cnpj_externo_route(cnpj_numeros):
    """
    Consulta dados de um CNPJ usando o CNPJManager.
    (Mantenha a documentação Swagger/OpenAPI aqui se desejar)
    """
    manager = CNPJManager()
    data, status_code = manager.consultar_cnpj(cnpj_numeros)
    return jsonify(data), status_code

# Não se esqueça de registrar o blueprint na sua aplicação Flask