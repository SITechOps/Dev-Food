import os
import mercadopago
from uuid import uuid4
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import NotFound
from src.main.utils.response_formatter import ResponseFormatter
from mercadopago.config.request_options import RequestOptions

class PaymentService:
    def __init__(self) -> None:
        self.sdk = mercadopago.SDK(os.getenv("MERCADO_PAGO_ACCESS_TOKEN") or "")
        self.request_options = RequestOptions(
            custom_headers={"x-idempotency-key": str(uuid4())}
        )


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
                },
                "description": "Pedido DevFood"
            }

            result = self.sdk.payment().create(dados_pagamento, self.request_options)
            return self.__format_pix_transaction(result.get("response"))

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


    def create_credit_card_payment(self, http_request: HttpRequest) -> HttpResponse:
        try:
            info_card = http_request.body

            token = info_card.get("token")
            email = info_card.get("cardholderEmail")
            amount = float(info_card.get("transaction_amount"))
            installments = int(info_card.get("installments"))
            doc_type = info_card.get("identification_type")
            doc_number = info_card.get("identification_number")

            if not token or not email:
                return ResponseFormatter.format_error("Token ou email ausente!", 400)

            payment_data = {
                "transaction_amount": amount,
                "token": token,
                "description": "Compra com cartão",
                "installments": installments,
                "payment_method_id": info_card.get("payment_method_id"),  # exemplo: "visa"
                "payer": {
                    "email": email,
                    "identification": {
                        "type": doc_type,
                        "number": doc_number
                    }
                }
            }

            result = self.sdk.payment().create(payment_data, self.request_options)
            return self.__format_credit_card_transaction(result.get("response"))

        except Exception as error:
            return ResponseFormatter.format_error("Erro ao processar pagamento com cartão!", 400, error)

        
    def __format_pix_transaction(self, payment: dict) -> HttpResponse:
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
    

    def __format_credit_card_transaction(self, payment: dict) -> HttpResponse:
        return HttpResponse(
            body={
                "id": payment.get("id"),
                "status": payment.get("status"),
                "status_detail": payment.get("status_detail"),
                "description": payment.get("description"),
                "installments": payment.get("installments"),
                "payment_type_id": payment.get("payment_type_id")
            },
            status_code=201
        )
