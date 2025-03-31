
from src.model.entities.endereco import Endereco
from src.model.configs.connection import DBConnectionHandler
from src.model.entities.restaurante import Restaurante
from src.main.handlers.custom_exceptions import AddressNotFound
from abc import ABC

class RestaurantesRepository(ABC):

    def create(self, restaurante: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                new_restaurante = Restaurante()
                for key, value in restaurante.items():
                    # Converte nomes de propriedades camelCase para snake_case
                    if key == "imageUrl":
                        setattr(new_restaurante, "image_url", value)
                    elif key == "bannerUrl":
                        setattr(new_restaurante, "banner_url", value)
                    elif key == "hours":
                        setattr(new_restaurante, "hours", value)
                    else:
                        setattr(new_restaurante, key, value)
                    
                db.session.add(new_restaurante)
                db.session.commit()
                return new_restaurante.id
            except Exception as exception:
                db.session.rollback()
                raise exception

    def find_all(self, page: int = 1, limit: int = 10, category: str = None) -> list[Restaurante]:
        with DBConnectionHandler() as db:
            query = db.session.query(Restaurante)
            
            # Aplicar filtro por categoria se fornecido
            if category:
                query = query.filter(Restaurante.category == category)
            
            # Aplicar paginação
            offset = (page - 1) * limit
            restaurantes = query.limit(limit).offset(offset).all()
            
            return restaurantes

    def find_by_id(self, id_restaurante: str) -> Restaurante:
        with DBConnectionHandler() as db:
            restaurante = (
                db.session
                .query(Restaurante)
                .filter(Restaurante.id == id_restaurante)
                .one_or_none()
            )
            if not restaurante:
                raise RestaurantNotFound()
            return restaurante

    def update(self, id_restaurante: str, info: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                restaurante = self.find_by_id(id_restaurante)
                
                for key, value in info.items():
                    # Converte nomes de propriedades camelCase para snake_case
                    if key == "imageUrl":
                        setattr(restaurante, "image_url", value)
                    elif key == "bannerUrl":
                        setattr(restaurante, "banner_url", value)
                    elif key == "isSuperRestaurant":
                        setattr(restaurante, "is_super_restaurant", value)
                    elif key == "hours":
                        setattr(restaurante, "opening_hours", value)
                    else:
                        setattr(restaurante, key, value)

                db.session.add(restaurante)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception

    def delete(self, id_restaurante: str) -> None:
        with DBConnectionHandler() as db:
            try:
                restaurante = self.find_by_id(id_restaurante)
                db.session.delete(restaurante)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception
                
    def search(self, query: str, page: int = 1, limit: int = 10) -> list[Restaurante]:
        """Busca restaurantes por nome ou categoria"""
        with DBConnectionHandler() as db:
            search_term = f"%{query}%"
            restaurantes = (
                db.session
                .query(Restaurante)
                .filter(
                    or_(
                        Restaurante.name.ilike(search_term),
                        Restaurante.category.ilike(search_term)
                    )
                )
                .limit(limit)
                .offset((page - 1) * limit)
                .all()
            )
            return restaurantes

    def create(self, id_usuario: str, endereco: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                new_endereco = Endereco(id_usuario=id_usuario)
                for key, value in endereco.items():
                    setattr(new_endereco, key, value)
                    
                db.session.add(new_endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception


    def find_all_enderecos_by_user(self, id_usuario: str) -> list[Endereco]:
        with DBConnectionHandler() as db:
            enderecos = (
                db.session
                .query(Endereco)
                .filter(Endereco.id_usuario == id_usuario)
                .all()
            )
            return enderecos
        

    def __find_by_id(self, id_endereco: str) -> Endereco:
        with DBConnectionHandler() as db:
            enderecos = (
                db.session
                .query(Endereco)
                .filter(Endereco.id == id_endereco)
                .one_or_none()
            )
            if not enderecos:
                raise AddressNotFound()
            return enderecos


    def update(self, id_endereco: str, info: Endereco) -> None:
        with DBConnectionHandler() as db:
            try:
                endereco = self.__find_by_id(id_endereco)
                for key, value in info.items():
                    setattr(endereco, key, value)

                db.session.add(endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception


    def delete(self, id_endereco: str) -> None:
        with DBConnectionHandler() as db:
            try:
                endereco = self.__find_by_id(id_endereco)
                db.session.delete(endereco)
                db.session.commit()
            except Exception as exception:
                db.session.rollback()
                raise exception