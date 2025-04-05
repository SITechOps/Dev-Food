from flask import render_template
from flask_mail import Mail, Message
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.handlers.custom_exceptions import InvalidEmailFormat
from src.main.utils.response_formatter import ResponseFormatter
from smtplib import SMTPRecipientsRefused
from random import randint

class EmailSender:
    def __init__(self, app):
        self.mail = Mail(app)


    def send_email(self, http_request: HttpRequest) -> HttpResponse:
        try:
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
        except SMTPRecipientsRefused:
            raise InvalidEmailFormat()
        
        return ResponseFormatter.display_verification_code(verification_code)
        
        
    def __get_email(self, http_request: HttpRequest) -> str:
        return http_request.body.get("data").get("email")
    

    def __generate_code(self) -> int:
        return randint(100000, 999999)