# src/controllers/cnpj_manager.py
import requests
from flask import current_app # Para logging, opcional

class CNPJManager:
    def __init__(self):
        self.external_api_base_url = "https://receitaws.com.br/v1/cnpj/"

    def consultar_cnpj(self, cnpj_numeros: str):
        if not cnpj_numeros or not cnpj_numeros.isdigit() or len(cnpj_numeros) != 14:
            return {"status": "ERROR", "message": "CNPJ inválido. Forneça 14 dígitos numéricos."}, 400

        external_api_url = f"{self.external_api_base_url}{cnpj_numeros}"
        
        try:
            response = requests.get(external_api_url, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data, response.status_code

        except requests.exceptions.Timeout:
            # current_app.logger.error(f"Timeout ao consultar CNPJ {cnpj_numeros} na ReceitaWS.")
            return {"status": "ERROR", "message": "Timeout ao consultar a API externa de CNPJ."}, 504
        except requests.exceptions.HTTPError as e:
            # current_app.logger.error(f"Erro HTTP da ReceitaWS para CNPJ {cnpj_numeros}: {e.response.status_code} - {e.response.text}")
            try:
                error_data = e.response.json()
                return error_data, e.response.status_code
            except ValueError:
                return {"status": "ERROR", "message": f"Erro na API externa de CNPJ: {e.response.status_code}"}, e.response.status_code
        except requests.exceptions.RequestException as e:
            # current_app.logger.error(f"Erro de conexão ao consultar CNPJ {cnpj_numeros} na ReceitaWS: {str(e)}")
            return {"status": "ERROR", "message": "Erro de conexão ao consultar a API externa de CNPJ."}, 500
        except Exception as e:
            # current_app.logger.error(f"Erro inesperado ao consultar CNPJ {cnpj_numeros}: {str(e)}")
            return {"status": "ERROR", "message": "Erro interno ao processar a consulta de CNPJ."}, 500