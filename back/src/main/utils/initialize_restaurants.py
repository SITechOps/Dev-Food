from src.model.repositories.restaurantes_repository import RestaurantesRepository

def inicializar_restaurantes_exemplo():
    restaurante_repo = RestaurantesRepository()
    restaurantes_existentes = restaurante_repo.list_all()
    if len(restaurantes_existentes) == 0:
        restaurantes_exemplo = [
            {
                "nome": "Sabor Brasileiro",
                "descricao": "Deliciosos pratos brasileiros",
                "email": "contato@saborbrasileiro.com.br",
                "cnpj": "12345678901234",
                "razao_social": "Sabor Brasileiro LTDA",
                "especialidade": "Brasileira",
                "telefone": "(11) 3456-7890",
                "horario_funcionamento": "11:00 - 23:00",
                "banco": "Banco do Brasil",
                "agencia": "3245",
                "nro_conta": "56789-0",
                "tipo_conta": "Corrente",
                "logo": "",
                "endereco": {
                    "logradouro": "Avenida Paulista",
                    "numero": "1500",
                    "bairro": "Bela Vista",
                    "cidade": "São Paulo",
                    "estado": "SP",
                    "complemento": "Andar 10",
                    "pais": "Brasil"
                }
            },
            {
                "nome": "Cantina Italiana",
                "descricao": "Deliciosos pratos italianos",
                "email": "reservas@cantinaitaliana.com.br",
                "cnpj": "98765432109876",
                "razao_social": "Cantina Bella Italia",
                "especialidade": "Italiana",
                "telefone": "(11) 2345-6789",
                "horario_funcionamento": "18:00 - 00:00",
                "banco": "Santander",
                "agencia": "1789",
                "nro_conta": "12345-6",
                "tipo_conta": "Empresarial",
                "logo": "",
                "endereco": {
                    "logradouro": "Rua Augusta",
                    "numero": "789",
                    "bairro": "Consolação",
                    "cidade": "São Paulo",
                    "estado": "SP",
                    "complemento": "",
                    "pais": "Brasil"
                }
            },
            {
                "nome": "Sushi Express",
                "descricao": "Pratos de sushi frescos",
                "email": "atendimento@sushiexpress.com.br",
                "cnpj": "45678912345678",
                "razao_social": "Sushi Express LTDA",
                "especialidade": "Japonesa",
                "telefone": "(11) 3333-4444",
                "horario_funcionamento": "11:00 - 22:00",
                "banco": "Bradesco",
                "agencia": "0123",
                "nro_conta": "987654-3",
                "tipo_conta": "Corrente",
                "logo": "",
                "endereco": {
                    "logradouro": "Rua Liberdade",
                    "numero": "123",
                    "bairro": "Liberdade",
                    "cidade": "São Paulo",
                    "estado": "SP",
                    "complemento": "Loja 45",
                    "pais": "Brasil"
                }
            }
        ]

        
        for restaurante in restaurantes_exemplo:
            restaurante_repo.create(restaurante)