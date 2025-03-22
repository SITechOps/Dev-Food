from flask_swagger_ui import get_swaggerui_blueprint

BASE_URL = "/docs"
FILE_URL = "/swagger.yaml"

def register_swagger(app):
    app.static_folder = "../../../"
    swagger_bp = get_swaggerui_blueprint(BASE_URL, FILE_URL)
    app.register_blueprint(swagger_bp)