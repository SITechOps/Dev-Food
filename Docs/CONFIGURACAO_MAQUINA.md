# Configuração de Máquina

## Pré-requisitos

Certifique-se de que as seguintes ferramentas estão instaladas no seu sistema:

- [Node.js](https://nodejs.org/) (para o front-end)
- [Python 3.8+](https://www.python.org/) (para o back-end)
- [Docker](https://www.docker.com/get-started) (para contêineres)

## Configurando o Repositório Local

### 1. Clonar o repositório

```sh
git clone https://github.com/SITechOps/Dev-Food.git
```

### 2. Atualizar o código da branch `develop`

```sh
git pull origin develop
```

Isso garante que você tenha a versão mais recente da branch `develop`, trazendo todas as atualizações do repositório remoto para o seu ambiente local.

## **Executando o Front-End**

### 1. Instalar as dependências do front-end

```sh
cd front
npm install
```

Este comando instala todas as dependências do projeto listadas no `package.json`, garantindo que tudo esteja pronto para rodar.

### 2. Rodar o código front-end

```sh
npm run dev
```

Isso executa o projeto no modo de desenvolvimento, normalmente iniciando um servidor local e recarregando automaticamente as mudanças feitas no código.

---

## **Executando o Back-End**

### 1. Criar o ambiente virtual

```sh
py -m venv .venv
```

### 2. Ativar o ambiente virtual

- No Windows:

```sh
.venv\Scripts\activate
```

- No Linux/Mac:

```sh
source .venv/bin/activate
```

### 3. Instalar as dependências do back-end

```sh
pip install -r requirements.txt
```

### Alternativa: Instalar o ambiente virtual pelo VS Code:

1. Baixe a extensão oficial do Python

2. Pressione F1 e digite "Python: Create Environment".

3. Escolha "Venv".

4. Selecione a versão do Python desejada.

5. Selecione o arquivo requirements.txt para instalar as dependências do backend.

### 4. Rodar a aplicação back-end

```sh
cd back
py run.py
```

Em apenas uma linha:

```sh
py back/run.py
```

## **Configurando o Docker**

### 1. Instalar o Docker

Baixe e instale o Docker seguindo as instruções oficiais no site:  
🔗 [Docker Download](https://www.docker.com/get-started/)

### 2. Abrir o Docker

Após a instalação, abra o Docker Desktop para garantir que ele esteja rodando.

### 3. Criar uma conta

É necessário criar uma conta no Docker Hub para acessar e gerenciar imagens de contêiner.

### 4. Rodar o Container

```sh
cd back
docker compose up -d --build
```

Este comando inicia os serviços definidos no arquivo `docker-compose.yml`, configurando e rodando os contêineres necessários para o projeto.

- `-d`: Executa os contêineres em modo "detached" (em segundo plano).

- `--build`: Reconstrói a imagem antes de iniciar os contêineres, garantindo que as versões mais recentes sejam usadas.

#### Para listar os containeres em execução, use:

```sh
docker ps # process status
```

#### Para interromper os contêineres em execução, use:

```sh
docker compose stop
```

#### Para remover os contêineres e seus volumes associados, use:

```sh
docker compose down -v
```

- `-v`: remove os volumes criados, incluindo o banco de dados para liberar espaço em disco.

#### Para remover as imagens, use:

```sh
docker rmi $(docker images -a -q)
```

## **MySQL: Acesso e Comandos**

Para acessar o banco de dados MySQL que está rodando no container Docker, você pode usar um dos seguintes métodos:

#### 1. Via Terminal:

```sh
docker exec -it mysql_container bash
```

#### 2. Via Docker Desktop

1. Abra o Docker Desktop
2. Localize o container mysql_container na lista
3. Clique no container para ver os detalhes
4. Selecione a aba "Exec"

### Executando o MySQL:

- Dentro do shell do contêiner, execute o cliente MySQL:

  ```sh
  mysql -u root -p
  ```

- Digite a senha root quando solicitado

- Selecione o banco de dados do projeto:

  ```sh
  use devfood
  ```

### Comandos úteis do MySQL:

- Listar tabelas

  ```sh
  show tables;
  ```

- Visualizar a estrutura de uma tabela:

  ```sh
  describe nome_da_tabela;
  ```

- Selecionar todos os dados de uma tabela:
  ```sh
  select * from nome_da_tabela;
  ```

### **Acesso via Interface Gráfica (MySQL Workbench):**

Você também pode acessar o banco de dados MySQL usando uma interface gráfica como o MySQL Workbench. Para isso, você precisará das seguintes informações:

- **Host:** `localhost` ou o endereço IP do seu contêiner Docker.

- **Porta:** 3307 (ou a porta que você mapeou no `docker-compose.yml`).

- **Usuário:** `root`.

- **Senha:** A mesma senha root que você encontrou no `docker-compose.yml`.

## Acesso ao Swagger:

Com o backend em execução, acesse o Swagger através do navegador:

    localhost:5000/docs
