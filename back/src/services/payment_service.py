from flask import Flask
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import NotFound
from src.main.utils.response_formatter import ResponseFormatter

class PaymentService:
    def __init__(self, app: Flask) -> None:
        self.sdk = app.config["MERCADO_PAGO_SDK"]
        self.request_options = app.config["REQUEST_OPTIONS"]
        

    def create_pix_qr_code(self, http_request: HttpRequest) -> HttpResponse:
        try:
            info_pix = http_request.body.get("pix")
            email = info_pix.get("email_comprador")
            if not email:
                raise NotFound("Email")

            dados_pagamento = {
                "transaction_amount": float(info_pix.get("valor_pagamento")),
                "payment_method_id": "pix",
                "payer": {
                    "first_name": info_pix.get("nome_comprador"),
                    "email": email
                }
            }

            result = self.sdk.payment().create(dados_pagamento, self.request_options)
            return self.__format_transaction(result.get("response"))

        except Exception as error:
            return ResponseFormatter.format_error("Erro ao processar pagamento!", 400, error)

        
    def get_pix_status(self, http_request: HttpRequest) -> HttpResponse:
        try:
            id_pagamento = http_request.params.get("id_pagamento")

            if not id_pagamento:
                return ResponseFormatter.format_error("ID de pagamento não fornecido!", 400)
            
            servico_pagamento = self.sdk.payment()
            detalhes_pagamento = servico_pagamento.get(id_pagamento).get("response")
            dados_resposta = {
                "id": detalhes_pagamento.get("id"),
                "status": detalhes_pagamento.get("status"),
                "status_detail": detalhes_pagamento.get("status_detail")
            }
            return HttpResponse(body=dados_resposta, status_code=200)
            
        except Exception as error:
            return ResponseFormatter.format_error("Erro ao processar pagamento!", 400, error)

        
    def __format_transaction(self, payment: dict) -> HttpResponse:
        transaction_data = payment.get('point_of_interaction', {}).get('transaction_data', {})
        return HttpResponse(
            body={
                "id": payment.get('id'),
                "status": payment.get('status'),
                "qr_code": transaction_data.get('qr_code'),
                "qr_code_base64": transaction_data.get('qr_code_base64'),
                "ticket_url": transaction_data.get('ticket_url')
            }, status_code=201
        )