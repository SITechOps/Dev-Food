from flask import Flask
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.main.utils.response_formatter import ResponseFormatter
from src.main.handlers.custom_exceptions import UnverifiedNumber
from random import randint
import re

class SMSManager:
    def __init__(self, app: Flask) -> None:
        self.client = Client(app.config["TWILIO_ACCOUNT_SID"], app.config["TWILIO_AUTH_TOKEN"])
        self.from_number = app.config["TWILIO_PHONE_NUMBER"]
        
    
    def send_sms(self, http_request: HttpRequest) -> HttpResponse:
        try:
            verification_code = self.__generate_code()
            phone_number = self.__extract_numbers(http_request)
            self.client.messages.create(
                to=f"+{phone_number}",
                from_=self.from_number,
                body=f'🎉 Bem-vindo(a) ao DevFood! 🍕 Seu código de verificação é {verification_code}! Até mais! 🚀'
            )
        except TwilioRestException as twilio_error:
            if "unverified" in str(twilio_error):
                raise UnverifiedNumber()
            raise twilio_error
        
        return ResponseFormatter.display_verification_code(verification_code)
    

    def __generate_code(self) -> int:
        return randint(100000, 999999)
    

    def __extract_numbers(self, http_request: HttpRequest) -> int:
        text_number = http_request.body.get("data").get("telefone")
        return re.sub(r'\D', '', text_number)