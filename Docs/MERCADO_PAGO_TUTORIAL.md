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

# 🌐 Configuração no Frontend com Ngrok

Este guia mostra como expor sua aplicação local com HTTPS usando o `Ngrok`.

---

## ❓ Por que usar o Ngrok?

* Ideal para testes com APIs externas (ex: Mercado Pago, Webhooks, etc).
* Cria um túnel seguro HTTPS apontando para seu servidor local.

---

## 📥 Instalação do Ngrok

### 🔗 Via site

Baixe o executável em:
[https://ngrok.com/download](https://ngrok.com/download)

### 🧰 Via terminal (Node.js)

```bash
npm install -g ngrok
```

---

## 🚀 Executando o Ngrok

Em outro terminal, execute:

```bash
ngrok http 5173
```

Você verá algo como:

```bash
https://abc123.ngrok.io → http://localhost:5173
```

Use essa URL pública no navegador ou em APIs externas.

---

## ⚙️ Configuração no `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acesso externo
    allowedHosts: ['d2a2-177-198-140-44.ngrok-free.app'], // <<< adicione seu domínio ngrok aqui
  },
})
```

---

## 🖥️ Rodando a aplicação

Após a configuração, execute normalmente seu projeto com:

```bash
npm run dev
```

---

## 🔑 Variáveis de Ambiente

Inclua também a chave pública do Mercado Pago no arquivo `.env` na raiz do frontend:

```env
VITE_MERCADO_PAGO_PUBLIC_KEY=SEU_ACCESS_TOKEN_DE_PRODUCAO
```

---
