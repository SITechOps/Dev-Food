from flask import render_template
from flask_mail import Mail, Message
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from random import randint

class EmailSender:
    def __init__(self, app):
        self.mail = Mail(app)

    def send_email(self, http_request: HttpRequest) -> HttpResponse:
        destination_email = self.__get_email(http_request)
        verification_code = self.__generate_code()
        message = render_template("email_message_template.html", verification_code=verification_code)
        msg = Message(
            subject="Seu código de verificação chegou! 🔐",
            sender="devfoodsender@gmail.com",
            recipients=[destination_email],
            html=message
        )
        self.mail.send(msg)
        return self.__format_response(verification_code)
        
    def __get_email(self, http_request: HttpRequest) -> str:
        return http_request.body.get("data").get("email")
    
    def __generate_code(self) -> int:
        return randint(100000, 999999)
    
    def __format_response(self, verification_code: int) -> HttpResponse:
        return HttpResponse(
            body= {
                "data": {
                    "attributes":{
                        "verification_code": verification_code
                    }
                }
            },
            status_code=200
        )
