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
version: '3.8'
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

## 🔄 7️⃣ Reiniciando o Docker e Containers
Se houver problemas com permissões ou conexão, tente:

### 🔹 Reiniciar o serviço do Docker
```bash
sudo systemctl restart docker
```

### 🔹 Parar e iniciar os containers novamente
```bash
docker-compose down
docker-compose up -d
```
=======
# 🍽️ Bem-vindo ao projeto DevFood! - TechOps

## 📖 Índice

- [Sobre o Projeto](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-sobre-o-projeto)
- [Arquitetura do Sistema](https://github.com/SITechOps/Dev-Food/blob/main/README.md#%EF%B8%8F-arquitetura-do-sistema)
- [Recursos Principais](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-recursos-principais)
- [Tecnologias Utilizadas](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-tecnologias-utilizadas)
- [Fluxo de Dados](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-fluxo-de-dados)
- [Instalação](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-instala%C3%A7%C3%A3o)
- [Roadmap](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-roadmap)
- [Contribuição](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-contribui%C3%A7%C3%A3o)
- [Integrantes](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-integrantes-do-projeto)
- [Figma do Projeto](https://github.com/SITechOps/Dev-Food/blob/main/README.md#-figma-do-projeto)

## 📝 Sobre o Projeto

O **DevFood** é um clone do iFood, criado para fins educacionais e experimentação de tecnologias modernas de desenvolvimento web. Nosso objetivo é proporcionar uma experiência semelhante à de um aplicativo de delivery, onde usuários podem navegar por restaurantes, realizar pedidos e acompanhar a entrega em tempo real.

Atualmente, o DevFood cobre as principais funcionalidades de um app de delivery, como:
- Cadastro e login de usuários.
- Listagem de restaurantes e pratos disponíveis.
- Sistema de pedidos e acompanhamento de status.
- Painel para restaurantes gerenciarem seus pedidos.

Nosso projeto está em constante evolução, e planejamos adicionar novas funcionalidades, como suporte a avaliações, geolocalização e integração com meios de pagamento.

### 📸 Capturas de Tela

![Exemplo da Interface](https://via.placeholder.com/600x300.png)

## 🏗️ Arquitetura do Sistema

O DevFood é baseado em uma arquitetura modular, separando o frontend e o backend:

- **Frontend (Vite + Tailwind CSS)**: Responsável pela interface do usuário, garantindo uma experiência moderna e responsiva.
- **Backend (Flask)**: API REST que lida com autenticação, pedidos e gerenciamento de restaurantes.

## 🔥 Recursos Principais

✔️ Cadastro e login de usuários 🔑  
✔️ Listagem de restaurantes e pratos 🍔  
✔️ Sistema de pedidos 📦  
✔️ Atualização do status do pedido em tempo real ⏳  
✔️ Painel para restaurantes gerenciarem pedidos 📊  
✔️ Interface responsiva 📱  

## 🛠 Tecnologias Utilizadas

### 🔹 Backend:
- **Flask**: Framework web minimalista para APIs.

### 🔹 Frontend:
- **Vite**: Ferramenta moderna para desenvolvimento frontend rápido.
- **Tailwind CSS**: Framework CSS para estilização eficiente e responsiva.
- **React**: Planejamos migrar para React para maior escalabilidade.

## 🔄 Fluxo de Dados

1. **Usuário acessa o frontend** e faz login.
2. **Requisição enviada ao backend (Flask)** para autenticação.
3. **Usuário seleciona um restaurante e faz um pedido.**
4. **Pedido salvo no banco de dados e notificado ao restaurante.**
5. **Restaurante altera status do pedido** e usuário é notificado.
6. **Pedido é concluído e armazenado no histórico do usuário.**

## 🚀 Instalação

### Pré-requisitos

- Python 3.9+ instalado
- Node.js instalado

### Backend (Flask)

1. Clone o repositório:

   ```sh
   git clone https://github.com/SITechOps/Dev-Food.git
   ```

2. Entre no diretório do backend:

   ```sh
   cd back
   ```

3. Crie um ambiente virtual e ative:

   ```sh
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   venv\Scripts\activate  # Windows
   ```

4. Instale as dependências:

   ```sh
   pip install -r requirements.txt
   ```

5. Inicie o servidor Flask:

   ```sh
   flask run
   ```

### Frontend (Vite + Tailwind)

1. Entre no diretório do frontend:

   ```sh
   cd front
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Inicie o projeto:

   ```sh
   npm run dev
   ```

## 🚀 Roadmap

- [ ] Implementar sistema de avaliações ⭐  
- [ ] Adicionar suporte a geolocalização 📍  
- [ ] Melhorar interface do dashboard 📊  
- [ ] Criar versão mobile 📱  
- [ ] Integração com meio de pagamento 💳  

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua funcionalidade (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'Adicionando nova funcionalidade'`)
4. Faça um push para a branch (`git push origin minha-feature`)
5. Abra um **Pull Request**


# 🌐 Integrantes do Projeto:
<table>
  <tr>
    <th>Nome</th>
    <th>Github</th>
    <th>Linkedin</th>
  </tr>
  <tr>
    <td>Enzo Mikami</td>
    <td><a href="https://github.com/Enzoka123"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a></td>
     <td><a href="https://www.linkedin.com/in/enzo-mikami-4113a1265/"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" width="90" height="26"></a></td>
  </tr>
  <tr>
    <td>Gabriela Samor</td>
    <td><a href="https://github.com/gabrielasamor"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a></td>
      <td><a href="https://www.linkedin.com/in/gabriela-cristina-samor/"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" width="90" height="26"></a></td>
  </tr>
  <tr>
    <td>Gustavo Rezende</td>
    <td><a href="https://github.com/gustrpaz"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a></td>
      <td><a href="https://www.linkedin.com/in/gustavo-rezende-paz/"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" width="90" height="26"></a></td>
  </tr>
  <tr>
    <td>Guilherme Santos</td>
    <td><a href="https://github.com/Guilherme1608"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a></td>
      <td><a href="https://www.linkedin.com/in/guilherme-santos-7249b91a4/"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" width="90" height="26"></a></td>
  </tr>
  <tr>
    <td>Joselaine Romão</td>
    <td><a href="https://github.com/joselainejrs/"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a></td>
      <td><a href="https://www.linkedin.com/in/joselaine-soares"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" width="90" height="26"></a></td>
  </tr>
  <tr>
    <td>Rodrigo Mazucato</td>
    <td><a href="https://github.com/RodrigoMazucato"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a></td>
      <td><a href="https://www.linkedin.com/in/rodrigo-mazucato-49238a1b6/"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" width="90" height="26"></a></td>
  </tr>
  <tr>
    <td>Rubya de Jesus</td>
    <td><a href="https://github.com/rubya87"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a></td>
      <td><a href="https://www.linkedin.com/in/rubya-de-jesus-rodrigues-06335560/"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white" width="90" height="26"></a></td>
  </tr>
</table>


## 🎨 Figma do Projeto

Nosso projeto no Figma contém o escopo, ideias, diagramas de atividades e arquitetura, além de informações gerais e referências. Acesse através do link abaixo:

- **[DevFood no Figma](https://www.figma.com/board/YGJoYlCYBBbk1PQ0R2Nk2O/5---Trabalho-DI?node-id=0-1&p=f)**
---

💡 **Gostou do projeto? Deixe uma ⭐ e contribua para seu crescimento!** 🚀