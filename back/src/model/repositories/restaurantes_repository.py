from src.model.configs.connection import DBConnectionHandler
from .interfaces.irestaurantes_repository import IRestaurantesRepository
from src.model.entities.restaurante import Restaurante

class RestaurantesRepository(IRestaurantesRepository):


    def create(self, info_restaurante: dict) -> Restaurante:
        with DBConnectionHandler() as db:
            try:
                new_restaurante = Restaurante()  
                
                for key, value in info_restaurante.items():                  
                    setattr(new_restaurante, key, value)

                db.session.add(new_restaurante)
                db.session.commit()

            except Exception as exception:
                db.session.rollback()
                raise exception
                    

    def find_by_id(self, id_restaurante: str) -> Restaurante:
        with DBConnectionHandler() as db:
            restaurante = (
                db.session
                .query(Restaurante)
                .filter(Restaurante.id == id_restaurante)
                .one_or_none()
            )
            if not restaurante: raise "Restaurante não encontrado"
            return restaurante
        

    def find_by_email(self, email_restaurante: str) -> Restaurante | None:
        with DBConnectionHandler() as db:
            restaurante = (
                db.session
                .query(Restaurante)
                .filter(Restaurante.email == email_restaurante)
                .one_or_none()
            )
            return restaurante    


    def list_all(self) -> list[Restaurante]:
        with DBConnectionHandler() as db:
            restaurantes = (
                db.session
                .query(Restaurante)
                .all()
            )
            return restaurantes
    

    def update(self, id_restaurante: str, info_restaurante: dict) -> None:
        with DBConnectionHandler() as db:
            try:
                restaurante = self.find_by_id(id_restaurante)
                if not restaurante:
                    raise ValueError("Restaurante não encontrado.")  
                
                for key, value in info_restaurante.items():            
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