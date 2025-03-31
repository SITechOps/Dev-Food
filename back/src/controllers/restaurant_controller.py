from src.http_types.http_request import HttpRequest
from src.http_types.http_response import HttpResponse
from src.model.repositories.interfaces.irestaurantes_repository import IRestaurantesRepository
from src.model.entities.restaurante import Restaurante

class RestaurantesController:
    def __init__(self, restaurantes_repository: IRestaurantesRepository):
        self.restaurantes_repository = restaurantes_repository

    def get_restaurants(self, http_request: HttpRequest) -> HttpResponse:
        page = http_request.params.get('page', 1, type=int)
        limit = http_request.params.get('limit', 10, type=int)
        category = http_request.params.get('category', type=str)
        restaurants = self.restaurantes_repository.find_all(page, limit, category)
        return HttpResponse(body=[restaurant.__dict__ for restaurant in restaurants])

    def get_restaurant_by_id(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get('id_restaurante')
        restaurant = self.restaurantes_repository.find_by_id(id_restaurante)
        return HttpResponse(body=restaurant.__dict__)

    def create_restaurant(self, http_request: HttpRequest) -> HttpResponse:
        data = http_request.body()
        self.restaurantes_repository.create(data)
        restaurant = self.restaurantes_repository.find_by_id(restaurant.query.order_by(restaurant.id.desc()).first().id)
        return HttpResponse(body=restaurant.__dict__, status_code=201)

    def update_restaurant(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get('id_restaurante')
        data = http_request.body
        self.restaurantes_repository.update(id_restaurante, data)
        restaurant = self.restaurantes_repository.find_by_id(id_restaurante)
        return HttpResponse(body=restaurant.__dict__)

    def delete_restaurant(self, http_request: HttpRequest) -> HttpResponse:
        id_restaurante = http_request.params.get('id_restaurante')
        self.restaurantes_repository.delete(id_restaurante)
        return HttpResponse(status_code=204)