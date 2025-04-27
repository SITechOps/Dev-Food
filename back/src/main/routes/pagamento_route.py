from flask import Blueprint, jsonify, request, current_app
from src.services.payment_service import PaymentService
from src.http_types.http_request import HttpRequest

pagamento_route_bp = Blueprint('pagamento_route', __name__)

@pagamento_route_bp.post('/pix/qr-code')
def send_pix():
    http_request = HttpRequest(body=request.json)

    pagamento = PaymentService(current_app)
    http_response = pagamento.create_pix_qr_code(http_request)
    print(http_response.body)
    
    return jsonify(http_response.body), http_response.status_code


@pagamento_route_bp.get('/pix/status/<id_pagamento>')
def verify_payment_status(id_pagamento: str):
    http_request = HttpRequest(params={"id_pagamento": id_pagamento})

    pagamento = PaymentService(current_app)
    http_response = pagamento.get_pix_status(http_request)
    
    return jsonify(http_response.body), http_response.status_code
