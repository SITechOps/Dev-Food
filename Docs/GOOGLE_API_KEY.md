# Configurando a API Key do Google

## Passo a Passo para Criar e Configurar sua API Key

### 1. Criar um Projeto no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Clique no menu suspenso no topo da página e selecione **Novo Projeto**.
3. Dê um nome ao projeto e clique em **Criar**.

### 2. Criar uma API Key

1. No menu lateral, vá para **APIs e Serviços** > **Credenciais**.
2. Clique em **Criar credenciais** e selecione **Chave de API**.
3. Uma chave será gerada automaticamente. Copie e guarde-a.

### 3. Revisar Configurações da API Key

1. Clique na API Key recém-criada para abrir suas configurações.
2. Em **Restrições do Aplicativo**, selecione **Nenhum**.
3. Em **Restrições de API**, selecione **Não restringir a chave**, indepedente da sua escolha, valide se as seguintes APIs estão habilitadas:
   - [Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com)
   - [Places API (New)](https://console.cloud.google.com/marketplace/product/google/places.googleapis.com)
   - [Places API (Legado)](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)
   - [Geocoding API](https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com)
   - [Distance Matrix API](https://console.cloud.google.com/marketplace/product/google/distance-matrix-backend.googleapis.com?pli=1)
4. Salve as alterações.

### 4. Configurar a Chave no Projeto

Crie um arquivo `.env` na raiz da pasta <code>front</code> e adicione a seguinte linha:

```env
VITE_GOOGLE_API_KEY=SUA_API_KEY_AQUI
```

Substitua `SUA_API_KEY_AQUI` pela chave gerada no Google Cloud Console.

### 5. Verificar a Conta de Faturamento

- Certifique-se de que sua conta de faturamento está configurada corretamente.
- Não utilize cartões de crédito gerados por sites falsos, pois a conta precisa ser válida.

Após seguir esses passos, sua API Key estará pronta para uso! 🚀

### Links Úteis:

[Como criar uma chave de API Google Maps](https://www.youtube.com/watch?v=zkJlZHsZbTQ)

[Google Maps API e JavaScript no React JS](https://www.youtube.com/watch?v=yc8L7llaYKo)
