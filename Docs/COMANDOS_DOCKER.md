# 🚀 Guia de Instalação e Uso do Docker + MySQL no Linux

Este guia cobre desde a instalação do Docker e Docker Compose até a execução de queries no MySQL dentro de um container Docker.

---

## 🐳 1️⃣ Instalando o Docker no Ubuntu

### 🔹 Atualizar pacotes

```bash
sudo apt update && sudo apt upgrade -y
```

### 🔹 Instalar dependências

```bash
sudo apt install -y ca-certificates curl gnupg
```

### 🔹 Adicionar repositório oficial do Docker

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 🔹 Instalar Docker

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 🔹 Verificar instalação

```bash
docker --version
```

Se o Docker estiver instalado corretamente, ele exibirá a versão.

---

## 🔧 2️⃣ Instalando o Docker Compose

### 🔹 Instalar a versão mais recente

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### 🔹 Conceder permissão de execução

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

### 🔹 Verificar instalação

```bash
docker-compose --version
```

---

## 👤 3️⃣ Permissão para rodar Docker sem sudo

Se precisar rodar Docker sem usar `sudo`, adicione seu usuário ao grupo `docker`:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Para garantir que a mudança foi aplicada:

```bash
docker ps
```

Se o comando rodar sem erro, a permissão foi concedida corretamente.

---

## 🏗️ 4️⃣ Subindo um container MySQL com Docker Compose

Crie um arquivo `docker-compose.yml` com o seguinte conteúdo:

```yaml
version: "3.8"
services:
  db:
    image: mysql:8.0
    container_name: mysql_container
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: meu_banco
      MYSQL_USER: meu_usuario
      MYSQL_PASSWORD: minha_senha
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### 🔹 Subir o container MySQL

```bash
docker-compose up -d
```

### 🔹 Verificar se o container está rodando

```bash
docker ps
```

---

## 🔄 5️⃣ Acessando o MySQL dentro do container

### 🔹 Entrar no terminal do container

```bash
docker exec -it mysql_container bash
```

### 🔹 Acessar o MySQL

```bash
mysql -u meu_usuario -p
```

Digite a senha definida no `docker-compose.yml` (exemplo: `meu_usuario`).

---

## 📂 6️⃣ Comandos básicos no MySQL

### 🔹 Listar bancos de dados

```sql
SHOW DATABASES;
```

### 🔹 Selecionar um banco de dados

```sql
USE meu_banco;
```

### 🔹 Listar tabelas do banco selecionado

```sql
SHOW TABLES;
```

### 🔹 Selecionar todos os registros de uma tabela

```sql
SELECT * FROM nome_da_tabela;
```

### 🔹 Selecionar colunas específicas

```sql
SELECT coluna1, coluna2 FROM nome_da_tabela;
```

### 🔹 Filtrar resultados

```sql
SELECT * FROM nome_da_tabela WHERE coluna = 'valor';
```

### 🔹 Limitar quantidade de registros

```sql
SELECT * FROM nome_da_tabela LIMIT 10;
```

---

## 🔄 7️⃣ Encerrando e Reiniciando Containers

### 🔹 Parar um container

```bash
docker stop mysql_container
```

### 🔹 Iniciar um container parado

```bash
docker start mysql_container
```

### 🔹 Derrubar e recriar os containers

```bash
docker-compose down
```

```bash
docker-compose up -d
```

### 🔹 Reiniciar o serviço do Docker

```bash
sudo systemctl restart docker
```

### 🔹 Sair do MySQL

```sql
EXIT;
```

---

Este guia cobre os passos essenciais para rodar um container MySQL usando Docker no Linux, garantindo que tudo esteja configurado corretamente do início ao fim.
