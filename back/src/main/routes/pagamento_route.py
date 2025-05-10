from flask import Blueprint, jsonify, request
from src.services.payment_service import PaymentService
from src.http_types.http_request import HttpRequest

pagamento_route_bp = Blueprint('pagamento_route', __name__)

@pagamento_route_bp.post('/pix/qr-code')
def send_pix():
    """
    Gerar QR Code para pagamento PIX
    ---
    tags:
      - Pagamentos
    summary: Gerar QR Code para pagamento PIX
    description: Cria um QR Code para pagamento via PIX usando Mercado Pago
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              pix:
                type: object
                required:
                  - email_comprador
                  - valor_pagamento
                properties:
                  email_comprador:
                    type: string
                    format: email
                    example: "ana.souza@gmail.com"
                  nome_comprador:
                    type: string
                    example: "Ana Souza"
                  valor_pagamento:
                    type: number
                    example: 25.90
    responses:
      "201":
        description: QR Code gerado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                qr_code:
                  type: string
                  example: "00020101021226870014br.gov.bcb.pix2565..."
                qr_code_base64:
                  type: string
                  example: "iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAIAAAAP3aGbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIHklEQVR4nO3dwW4bORRFQcfI/3+yMYsBZmfCYWxL5LtVteSNwTpBs3kp6fX9/f0P0Pf39wMAqf/+9QAAHidYQIJgAQmCBSQIFpAgWECCYAEJggUkCBaQIFhAgmABCYIFJAgWkCBYQIJgAQmCBSQIFpAgWECCYAE..."
      "400":
        description: Erro ao processar pagamento
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Erro ao processar pagamento!"
    """
    http_request = HttpRequest(body=request.json)

    pagamento = PaymentService()
    http_response = pagamento.create_pix_qr_code(http_request)
    return jsonify(http_response.body), http_response.status_code


@pagamento_route_bp.get('/pix/status/<id_pagamento>')
def verify_payment_status(id_pagamento: str):
    """
    Verificar status de pagamento PIX
    ---
    tags:
      - Pagamentos
    summary: Verificar status de pagamento PIX
    description: Consulta o status de um pagamento PIX pelo ID
    parameters:
      - name: id_pagamento
        in: path
        required: true
        description: ID do pagamento a ser consultado
        schema:
          type: string
          example: "123456789"
    responses:
      "200":
        description: Status do pagamento obtido com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  example: "123456789"
                status_detail:
                  type: string
                  example: "accredited"
      "400":
        description: Erro ao consultar status do pagamento
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "ID de pagamento não fornecido!"
    """
    http_request = HttpRequest(params={"id_pagamento": id_pagamento})

    pagamento = PaymentService()
    http_response = pagamento.get_pix_status(http_request)
    return jsonify(http_response.body), http_response.status_code


@pagamento_route_bp.post('/cartao')
def process_credit_card_payment():
    """
    Processar pagamento com cartão de crédito
    ---
    tags:
      - Pagamentos
    summary: Processar pagamento com cartão de crédito
    description: Endpoint para processar um pagamento com cartão de crédito.
    requestBody:
      description: Dados do cartão e informações do pagamento
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              token:
                type: string
                description: Token do cartão gerado pela plataforma de pagamento.
                example: "tok_abc123xyz"
              cardholderEmail:
                type: string
                description: E-mail do titular do cartão.
                example: "cliente@exemplo.com"
              transaction_amount:
                type: number
                example: 150.75
              installments:
                type: integer
                example: 3
              identification_type:
                type: string
                example: "CPF"
              identification_number:
                type: string
                example: "123.456.789-00"
              payment_method_id:
                type: string
                example: "visa"
    responses:
      "201":
        description: Pagamento realizado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                  example: "123456789"
      "400":
        description: Erro no processamento do pagamento com cartão
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Erro ao processar pagamento!"
    """
    http_request = HttpRequest(body=request.json)

    pagamento = PaymentService()
    http_response = pagamento.create_credit_card_payment(http_request)
    return jsonify(http_response.body), http_response.status_code