from io import BytesIO
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
        app.config['MAIL_DEBUG'] = False
        self.mail = Mail(app)


    def send_email(self, http_request: HttpRequest) -> HttpResponse:
        try:
            destination_email = self.__get_email(http_request)
            verification_code = self.__generate_code()
            print("CÓDIGO:", verification_code)
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


    def send_pdf(self, recipient_email: str, pdf_buffer: BytesIO, pedido_id: int) -> None:
        try:
            msg = Message(
                subject=f"Nota Fiscal - Pedido #{pedido_id}",
                sender="devfoodsender@gmail.com",
                recipients=[recipient_email],
                body=f"Olá! Segue em anexo a nota fiscal referente ao pedido #{pedido_id}. Obrigado por usar o DevFood!"
            )

            # Adiciona o PDF como anexo
            msg.attach(
                f"nota_fiscal_pedido_{pedido_id}.pdf",
                "application/pdf",
                pdf_buffer.getvalue()
            )
            self.mail.send(msg)

        except SMTPRecipientsRefused:
            raise InvalidEmailFormat()
        
        
    def __get_email(self, http_request: HttpRequest) -> str:
        return http_request.body.get("data").get("email")
    

    def __generate_code(self) -> int:
        return randint(100000, 999999)