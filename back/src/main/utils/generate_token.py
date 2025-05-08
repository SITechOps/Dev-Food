from flask_jwt_extended import create_access_token

def generate_token(id_usuario: str, role: str) -> str:
    return (
        create_access_token(
            identity=id_usuario,
            additional_claims={"role": role}
        )
    )