from cerberus import Validator

def users_creator_validator(request: any):
    body_validator = Validator({
            "data":{
                "type": "dict",
                "schema": {
                    "id": {"type": "integer", "required": False, "empty": True},
                    "nome": {"type": "string", "required": True, "empty": False},
                    "email": {"type": "string", "required": True, "empty": False},
                    "senha": {"type": "string", "required": True, "empty": False},
                    "is_admin": {"type": "boolean", "required": False, "empty": True}
                    }
        }
    })

    response = body_validator.validate(request.json)

    if response is False:
        raise Exception(body_validator.errors)