class BaseCustomException(Exception):
    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class UserAlreadyExists(BaseCustomException):
    def __init__(self, message="Usuário já existe!"):
        super().__init__(message, 409)


class AddressTypeAlreadyExists(BaseCustomException):
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


class EmailChangeNotAllowed(BaseCustomException):
    def __init__(self, message="Este e-mail não pode ser alterado!"):
        super().__init__(message, 403)


class InvalidAddressType(BaseCustomException):
    def __init__(self, message="Tipo de endereço inválido! Escolha entre casa ou trabalho"):
        super().__init__(message, 400)


class RestaurantAlreadyExists(BaseCustomException):
    def __init__(self, message="Restaurante já existe!"):
        super().__init__(message, 409)


class AddressRequired(BaseCustomException):
    def __init__(self, message="Endereço é obrigatório para cadastrar restaurante!"):
        super().__init__(message, 400)


class RestaurantAddressAlreadyExists(BaseCustomException):
    def __init__(self, message="Já existe um restaurante cadastrado com esse endereço."):
        super().__init__(message, 409)


class RestaurantNotFound(BaseCustomException):
    def __init__(self, message="Restaurante não encontrado!"):
        super().__init__(message, 409)