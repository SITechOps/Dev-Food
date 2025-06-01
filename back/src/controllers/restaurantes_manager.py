from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.irestaurantes_repository import IRestaurantesRepository
from src.main.utils.response_formatter import ResponseFormatter
from flask_jwt_extended import create_access_token
from src.services.image_service import ImageService
from werkzeug.datastructures import FileStorage
from datetime import datetime
from werkzeug.utils import secure_filename

class RestaurantesManager:
    def __init__(self, restaurante_repo: IRestaurantesRepository) -> None:
        self.__restaurante_repo = restaurante_repo
        self.class_name = "Restaurante"


    def create_new_restaurant(self, http_request: HttpRequest) -> HttpResponse:
        restaurante_info = http_request.body.get("data")
        
        if not restaurante_info:
            return ResponseFormatter.display_error("Requisição inválida: 'data' é obrigatório.", 400)

        restaurante_obj = self.__restaurante_repo.create(restaurante_info)
        token = create_access_token(
            identity=restaurante_obj.id,
            additional_claims={"role": "restaurante"}
        )

        return ResponseFormatter.display_operation(
            class_name=self.class_name,
            operation="criado",
            token=token
        )


    def get_all_restaurants(self) -> HttpResponse:
        lista_restaurante = self.__restaurante_repo.list_all()
        return ResponseFormatter.display_obj_list("Restaurante", lista_restaurante)


    def get_restaurant_by_id(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        
        if not id_restaurante:
            return ResponseFormatter.display_error("ID do restaurante é obrigatório.", 400)

        restaurante = self.__restaurante_repo.find_by_id(id_restaurante)
        
        if not restaurante:
            return ResponseFormatter.display_error("Restaurante não encontrado.", 404)
        
        return ResponseFormatter.display_single_obj(restaurante)


    def update(self, http_request: HttpRequest, image_file: FileStorage = None) -> HttpResponse:
     
        restaurante_info = http_request.body.get("data")
        id_restaurante = http_request.params.get("id")

        nome_antigo = self.__restaurante_repo.find_by_id(id_restaurante).nome
        nome_novo = restaurante_info.get("nome")

        if nome_antigo != nome_novo:
            try:
                novo_caminho = ImageService.rename_image(
                    folder_prefix="restaurante",
                    old_name=nome_antigo,
                    new_name=nome_novo,
                )

                restaurante_info["logo"] = novo_caminho

            except Exception as e:
                return ResponseFormatter.format_error("Erro ao renomear imagem:", 500, {"error": str(e)})

        self.__restaurante_repo.update(id_restaurante, restaurante_info)
        
        if image_file:
            self.update_image(http_request, image_file)

        return HttpResponse(
            body={"message": f"{self.class_name} alterado com sucesso!"},
            status_code=200
        )


    def update_financeiro(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        financeiro_info = http_request.body.get("data")

        if not financeiro_info:
            return ResponseFormatter.display_error("Requisição inválida: 'data' é obrigatório.", 400)

        if not id_restaurante:
            return ResponseFormatter.display_error("ID do restaurante é obrigatório.", 400)
        
        self.__restaurante_repo.update_dados_financeiros(id_restaurante, financeiro_info)
        return ResponseFormatter.display_operation(self.class_name, "alterado")


    def update_endereco(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        restaurante_info = http_request.body.get("data")
        endereco_info = restaurante_info.get("attributes")

        self.__restaurante_repo.update_endereco(id_restaurante, endereco_info)
        return ResponseFormatter.display_operation(self.class_name, "atualizado com novo endereço")


    def delete(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get("id")
        restaurante = self.__restaurante_repo.find_by_id(id_restaurante)

        if restaurante.logo:
            corrected_logo_path = restaurante.logo.replace("/restaurante/images/", "/restaurante/")
            ImageService.delete_image(corrected_logo_path)

        self.__restaurante_repo.delete(id_restaurante)
        return ResponseFormatter.display_operation(self.class_name, "deletado")


    def get_relatorio_receita(self, http_request: HttpRequest) -> HttpResponse:
        try:
            params = http_request.params or {}
            data_inicio = params.get("dataInicio")
            data_fim = params.get("dataFim")

            if data_inicio and data_fim:
                try:
                    datetime.strptime(data_inicio, "%Y-%m-%d")
                    datetime.strptime(data_fim, "%Y-%m-%d")
                except ValueError:
                    return HttpResponse(status_code=400, body={"error": "Formato de data inválido. Use YYYY-MM-DD."})

            relatorio = self.__restaurante_repo.relatorio_receita_bruta(data_inicio, data_fim)

            return HttpResponse(status_code=200, body={"data": relatorio})

        except Exception as e:
            return HttpResponse(status_code=500, body={"error": str(e)})
        
    
    def get_relatorio_qtd_pedidos(self, http_request: HttpRequest) -> HttpResponse:
        try:
            params = http_request.params or {}
            data_inicio = params.get("dataInicio")
            data_fim = params.get("dataFim")

            if data_inicio and data_fim:
                try:
                    datetime.strptime(data_inicio, "%Y-%m-%d")
                    datetime.strptime(data_fim, "%Y-%m-%d")
                except ValueError:
                    return HttpResponse(status_code=400, body={"error": "Formato de data inválido. Use YYYY-MM-DD."})

            relatorio = self.__restaurante_repo.relatorio_qtd_pedidos(data_inicio, data_fim)

            return HttpResponse(status_code=200, body={"data": relatorio})

        except Exception as e:
            return HttpResponse(status_code=500, body={"error": str(e)})


    def update_image(self, http_request: HttpRequest, file: FileStorage) -> HttpResponse:
        id_restaurante = http_request.params.get("id")

        restaurante = self.__restaurante_repo.find_by_id(id_restaurante)
        if not restaurante:
            return ResponseFormatter.display_error("Restaurante não encontrado.", 404)

        nome_restaurante = restaurante.nome

        try:
            logo = ImageService.update_image(file, "restaurante", nome_restaurante)
            safe_name = secure_filename(nome_restaurante.strip().lower().replace(" ", "_"))
            self.__restaurante_repo.update_image_path(id_restaurante, f"/restaurante/images/{safe_name}.webp")
            return HttpResponse(body={"image_url": logo}, status_code=200)
        except ValueError as e:
            return HttpResponse(body={"error": str(e)}, status_code=400)


