# 💳 Guia de Integração com Mercado Pago

### 📥 Acessar o Painel do Mercado Pago

1. Acesse o site do [Mercado Pago Developers](https://www.mercadopago.com.br/developers/) e faça login na sua conta.
2. No menu superior, clique em **Suas integrações**.

### Criando um Projeto

1. Na página "Suas integrações", clique em **Criar Aplicação**.
2. Faça a autenticação por SMS, Whatsapp ou Ligação Telefônica
3. Dê um nome ao seu projeto (ex.: "Dev-Food") e preencha as informações necessárias:
   - **Tipo de pagamento:** Pagamentos on-line
   - **Usa plataforma de e-commerce?** Não
   - **Produto:** Checkout Transparent
   - **Modelo de integração:** Não selecione nada
4. Aceite os termos e salve o projeto.

### 🔑 Obter Credenciais de Produção

1. No menu lateral, clique em **Credenciais de Produção**
2. Copie o **Access Token**.

### ⚙️ Atualizar o Arquivo `.env`

As credenciais de produção devem ser configuradas no arquivo `.env` do projeto. Certifique-se de que o arquivo contém a seguinte variável:

```env
MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN_DE_PRODUCAO
```
