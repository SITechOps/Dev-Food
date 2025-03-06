import pytest
from src.model.repositories.users_repository import UsersRepository

db = UsersRepository()

#@pytest.mark.skip("Insert in DB")
def test_insert_user():
    data = {
        "nome": "gabriela",
        "email": "gabriela@gmail.com",
        "senha": "1234"
        }
    db.create_user(**data)


#@pytest.mark.skip("Select in DB")
def test_get_user_by_id():
    user_id = 1
    user = db.get_user_by_id(user_id)
    print(user)


#@pytest.mark.skip("Select All in DB")
def test_list_all_users():
    users_list = db.list_users()
    print(users_list)