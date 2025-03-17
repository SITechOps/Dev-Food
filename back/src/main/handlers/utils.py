from flask import jsonify
from src.http_types.http_response import HttpResponse

def create_error_response(error_message: str, status_code: int):
    http_response = HttpResponse(
        body={"error": {"message": error_message}},
        status_code=status_code
    )
    return jsonify(http_response.body), http_response.status_code