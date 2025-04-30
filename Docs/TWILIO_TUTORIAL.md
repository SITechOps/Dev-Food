## 📞 Guia de Integração com Twilio

#### 📥 Acessar o Painel do Twilio

1. Acesse o site do [Twilio](https://www.twilio.com/) e faça login na sua conta.
2. No painel principal (Dashboard), você verá as seguintes informações:
   - **Account SID**: Identificador único da sua conta.
   - **Auth Token**: Token de autenticação para acessar a API.
   - **Twilio Phone Number**: Número de telefone fornecido pelo Twilio para envio de SMS.

#### ⚙️ Atualizar o arquivo `.env`

Adicione as credenciais no arquivo `.env` do projeto:

```env
TWILIO_ACCOUNT_SID=SEU_ACCOUNT_SID
TWILIO_AUTH_TOKEN=SEU_AUTH_TOKEN
TWILIO_PHONE_NUMBER=SEU_NUMERO_TWILIO
```
