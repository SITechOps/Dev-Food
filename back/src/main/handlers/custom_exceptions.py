class BaseCustomException(Exception):
    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class UserAlreadyExists(BaseCustomException):
    def __init__(self, message="Usuário já existe!"):
        super().__init__(message, 409)


class AddressAlreadyExists(BaseCustomException):
    def __init__(self, message="Esse tipo de endereço já existe!"):
        super().__init__(message, 409)


class UserNotFound(BaseCustomException):
    def __init__(self, message="Usuário não encontrado!"):
        super().__init__(message, 404)


class AddressNotFound(BaseCustomException):
    def __init__(self, message="Endereço não encontrado!"):
        super().__init__(message, 404)


class WrongPassword(BaseCustomException):
    def __init__(self, message="Senha incorreta!"):
        super().__init__(message, 401)
