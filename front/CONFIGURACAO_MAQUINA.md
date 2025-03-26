#Configuração de maquina 
---

### **Front-End**  

### 1. Clonar o repositório  
```sh
git clone "repositorio"
```
Este comando copia um repositório remoto para sua máquina local. Substitua `"repositorio"` pela URL real do repositório Git.

### 2. Atualizar o código da branch `develop`  
```sh
git pull origin develop
```
Isso garante que você tenha a versão mais recente da branch `develop`, trazendo todas as atualizações do repositório remoto para o seu ambiente local.

### 3. Instalar as dependências  
```sh
npm install
```
Este comando instala todas as dependências do projeto listadas no `package.json`, garantindo que tudo esteja pronto para rodar.

### 4. Iniciar o ambiente de desenvolvimento  
```sh
npm run dev
```
Isso executa o projeto no modo de desenvolvimento, normalmente iniciando um servidor local e recarregando automaticamente as mudanças feitas no código.

---

## **Back-End**  

### **Python**  

### 1. Atualizar o gerenciador de pacotes `pip`  
```sh
pip install --upgrade pip
```
Este comando atualiza o `pip` para a versão mais recente, garantindo compatibilidade com os pacotes mais novos.

### 2. Instalar dependências do projeto  
```sh
pip install -r requirements.txt
```
Isso instala todas as bibliotecas necessárias para o projeto, listadas no arquivo `requirements.txt`.

### 3. Rodar a aplicação  
```sh
py run.py
```
Este comando inicia a aplicação Python, executando o arquivo `run.py`, que normalmente contém o código de inicialização do servidor.

---

## **Docker**  

### 1. Instalar o Docker  
Baixe e instale o Docker seguindo as instruções oficiais no site:  
🔗 [Docker Download](https://www.docker.com/get-started/)

### 2. Abrir o Docker  
Após a instalação, abra o Docker Desktop para garantir que ele esteja rodando.

### 3. Criar uma conta  
É necessário criar uma conta no Docker Hub para acessar e gerenciar imagens de contêiner.

### 4. Subir os serviços com Docker Compose  
```sh
docker compose up
```
Este comando inicia os serviços definidos no arquivo `docker-compose.yml`, configurando e rodando os contêineres necessários para o projeto.

---

Isso garante que o time de desenvolvimento consiga configurar e rodar o projeto corretamente. Se precisar de mais detalhes ou ajustes na documentação, me avise! 🚀
