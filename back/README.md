# API Documentation - CRUD de Usuários 📃

Esta documentação descreve os endpoints disponíveis para realizar operações de CRUD (Criar, Ler, Atualizar, Deletar) para o gerenciamento de usuários.

## Endpoints

| Operação              | Método HTTP | URL                               | Corpo da Requisição (Body)                                                                             | Status Esperado | Resposta Esperada                                                                                                                       |
| --------------------- | ----------- | --------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Listar Usuários**   | GET         | `http://localhost:3000/user`      | -                                                                                                      | 200 OK          | `{ "data": { "Type": "User", "attributes": [{ "email": "email@email.com", "id": X, "is_admin": true, "nome": "Name" }], "count": X } }` |
| **Filtrar por ID**    | GET         | `http://localhost:3000/user/{id}` | -                                                                                                      | 200 OK          | `{ "data": { "Type": "User", "attributes": [{ "email": "name@email.com", "id": X, "is_admin": true, "nome": "Name" }], "count": 1 } }`  |
| **Cadastrar Usuário** | POST        | `http://localhost:3000/user`      | `{ "data": { "nome": "Name", "email": "name@email.com", "senha": "12345", "is_admin": true } }`        | 201 Created     | `{ "data": { "Type": "User", "attributes": { "email": "name@email.com", "nome": "Name", "senha": "12345" }, "count": 1 } }`             |
| **Atualizar Usuário** | PUT         | `http://localhost:3000/user/{id}` | `{ "data": { "nome": "New Name", "email": "newname@email.com", "senha": "12345", "is_admin": true } }` | 200 OK          | `{ "data": { "Type": "User", "attributes": 2, "count": 1, "response": "User updated!" } }`                                              |
| **Deletar Usuário**   | DELETE      | `http://localhost:3000/user/{id}` | -                                                                                                      | 204 No Content  |                                                                                                                                         |

---

## Detalhes dos Status Codes

- **200 OK**: Requisição bem-sucedida. Retorna os dados do usuário ou a lista de usuários.
- **201 Created**: Requisição bem-sucedida para criação de recurso. Retorna os dados do novo usuário criado.
- **204 No Content**: Requisição bem-sucedida, mas sem conteúdo na resposta (usado para a exclusão de recursos).
- **404 Not Found**: O recurso solicitado não foi encontrado.
- **500 Internal Server Error**: Erro no servidor ao processar a requisição.
