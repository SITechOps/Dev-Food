from flask import jsonify
from src.model.entities.usuario import Usuario
from src.model.entities.endereco import Endereco
from src.model.entities.restaurante import Restaurante
from src.model.entities.produto import Produto
from src.http_types.http_response import HttpResponse
from typing import Literal

class ResponseFormatter:
    
    
    @staticmethod
    def display_obj_list(class_name: str, obj_list: list[Usuario | Endereco | Restaurante | Produto]) -> HttpResponse:
        return HttpResponse(
            body={
                "data": {
                    "Type": class_name,
                    "count": len(obj_list),
                    "attributes": [obj.to_dict() for obj in obj_list],
                }
            },
            status_code=200
        )


    @staticmethod
    def display_single_obj(obj: Usuario | Endereco | Restaurante | Produto) -> HttpResponse:
        return HttpResponse(
            body={
                "data": {
                    "Type": type(obj).__name__,
                    "attributes": obj.to_dict(),
                }
            },
            status_code=200
        )
    

    @staticmethod
    def display_operation(
        class_name: Literal["Usuário", "Endereço", "Restaurante"],
        operation: Literal["criado", "logado", "alterado", "removido"],
        token: str = None,
    ) -> HttpResponse:
        return HttpResponse(
            body={
                "message": f"{class_name} {operation} com sucesso!",
                **({"properties": {"token": token}} if token else {}),
            },
            status_code=201 if operation=="criado" else 200
        )
    

    @staticmethod
    def display_verification_code(verification_code: int) -> HttpResponse:
        return HttpResponse(
            body= {
                "properties": {
                    "verificationCode": verification_code
                }
            },
            status_code=200
        )


    @staticmethod
    def format_error(message: str, status_code: int, details: str = None):
        http_response = HttpResponse(
            body={
                "error_message": message,
                **({"log_info": {"details": details}} if details else {})
            },
            status_code=status_code
        )
        return jsonify(http_response.body), http_response.status_code