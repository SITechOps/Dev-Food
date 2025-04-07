from flask import Blueprint, jsonify, request, current_app
from src.services.sms_sender import SMSManager
from src.http_types.http_request import HttpRequest

sms_route_bp = Blueprint('sms_route', __name__)

@sms_route_bp.post('/send-sms')
def send_sms():
    http_request = HttpRequest(body=request.json)
    
    sms = SMSManager(current_app)
    http_response = sms.send_sms(http_request)
    
    return jsonify(http_response.body), http_response.status_code