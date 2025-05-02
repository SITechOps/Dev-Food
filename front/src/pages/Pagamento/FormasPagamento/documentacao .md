# 🧪 Guia Rápido: HTTPS Local com mkcert e Ngrok para Certificaçao de ambiente seguro (HTTPS) - mercado pago

Este guia mostra como configurar um ambiente HTTPS local utilizando o `mkcert` e como expor sua aplicação local com HTTPS usando o `Ngrok`.


---

## ✅ Opção 2: Usar Ngrok para HTTPS Público

### 🧑‍🔬 Por que usar o Ngrok?

* Ideal para testes com APIs externas (ex: Mercado Pago, Webhooks, etc).
* Cria um túnel seguro HTTPS apontando para seu servidor local.

---

## 🌐 Instalação do Ngrok

### Via site

Baixe o executável:
[https://ngrok.com/download](https://ngrok.com/download)

### Ou via terminal (Node.js)

```bash
npm install -g ngrok
```

---

## 🚀 Usando o Ngrok

1. Rode seu projeto local normalmente:

```bash
npm run dev
```

2. Em outro terminal, execute:

```bash
ngrok http 5173
```

O terminal mostrará algo como:

```bash
https://abc123.ngrok.io → http://localhost:5173
```

Use essa URL pública no navegador ou em APIs externas.

---

comando para permitir acesso sdm Start-Process powershell -Verb runAs



# 🧪 Passo a Passo para Resolver o Erro de Autenticação

Este guia explica como resolver o erro de autenticação no ngrok e configurar o túnel HTTPS corretamente.

---

## 📋 Criar uma conta no ngrok

1. Acesse o site do [ngrok](https://ngrok.com) e crie uma conta, se você ainda não tiver uma.

---

## 🔑 Obter seu authtoken

1. Após criar sua conta, vá para o painel do ngrok.
2. Copie o authtoken fornecido.

---

## 🔓 Autenticar sua conta no ngrok

1. Abra o terminal e execute o seguinte comando para autenticar sua conta no ngrok:

```bash
ngrok authtoken <SEU_AUTHTOKEN>
```

> Substitua `<SEU_AUTHTOKEN>` pelo valor que você copiou do painel do ngrok.

---

## ▶️ Iniciar o ngrok novamente

Após autenticar sua conta, execute o seguinte comando para expor o seu servidor local:

```bash
ngrok http 5173
```

Agora, com o authtoken configurado, o ngrok deve funcionar corretamente, criando o túnel HTTPS para o seu servidor local.

---

## 🌐 Testar a Integração

Após resolver o erro de autenticação, você poderá usar o link gerado pelo ngrok (no formato `https://xxxxx.ngrok.io`) para testar a integração do Mercado Pago em um ambiente seguro.

---

---

## ✅ Opção 2: Usar Ngrok para HTTPS Público

### 🧑‍🔬 Por que usar o Ngrok?

* Ideal para testes com APIs externas (ex: Mercado Pago, Webhooks, etc).
* Cria um túnel seguro HTTPS apontando para seu servidor local.

---

## 🌐 Instalação do Ngrok

### Via site

Baixe o executável:
[https://ngrok.com/download](https://ngrok.com/download)

### Ou via terminal (Node.js)

```bash
npm install -g ngrok
```

---

## 🚀 Usando o Ngrok

1. Rode seu projeto local normalmente:

```bash
npm run dev
```

2. Em outro terminal, execute:

```bash
ngrok http 5173
```

O terminal mostrará algo como:

```bash
https://abc123.ngrok.io → http://localhost:5173
```

Use essa URL pública no navegador ou em APIs externas.

---

# 🔧 Passos para Liberar o Domínio do Ngrok no Vite

Este guia mostra como permitir o acesso ao domínio do Ngrok na configuração do Vite.

---

## 1. Abrir o Arquivo de Configuração

Abra o arquivo `vite.config.js` ou `vite.config.ts`, dependendo do seu projeto.

---

## 2. Adicionar o Domínio do Ngrok em `allowedHosts`

No bloco `server`, adicione o domínio do Ngrok à propriedade `allowedHosts`.

### Exemplo:

```ts
// vite.config.ts
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

## 🔄 Dica: Usar Regex para Domínios Variáveis

Como o domínio do ngrok muda a cada reinício, pode ser útil usar uma expressão regular para aceitar qualquer domínio do tipo `.ngrok-free.app`.

```ts
allowedHosts: [/\\.ngrok-free\\.app$/]
```

---

## 3. Reiniciar o Servidor Vite

Salve o arquivo e reinicie o servidor com o comando:

```bash
npm run dev
```

---

## ✅ Acessar o Projeto

Agora, acesse o projeto utilizando a URL HTTPS gerada pelo Ngrok.

---
