from flask import Blueprint, jsonify, request
from src.http_types.http_request import HttpRequest
from src.services.email_sender import EmailSender

email_route_bp = Blueprint('email_route', __name__)

@email_route_bp.post('/send-email')
def send_email():
    http_request = HttpRequest(body=request.json)
    
    email = EmailSender()
    http_response = email.send_email(http_request)
    
    return jsonify(http_response.body), http_response.status_code

