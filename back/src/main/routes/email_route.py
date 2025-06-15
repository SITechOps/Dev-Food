from flask import Blueprint, jsonify, request, current_app
from src.http_types.http_request import HttpRequest
from src.services.email_sender import EmailSender

email_route_bp = Blueprint('email_route', __name__)

@email_route_bp.post('/send-email')
def send_email():
    """
    Enviar email
    ---
    tags:
      - Email
    summary: Enviar email
    description: Envia um email para o endereço especificado
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              data:
                type: object
                required:
                  - email
                properties:
                  email:
                    type: string
                    format: email
                    example: "ana.souza@gmail.com"
    responses:
      "200":
        description: Email enviado com sucesso
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Email enviado com sucesso!"
      "400":
        description: Email inválido
        content:
          application/json:
            schema:
              type: object
              properties:
                error_message:
                  type: string
                  example: "Email inválido"
    """
    http_request = HttpRequest(body=request.json)
    
    email = EmailSender(current_app)
    http_response = email.send_email(http_request)
    
    return jsonify(http_response.body), http_response.status_code