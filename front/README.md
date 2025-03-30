# Estruturação Front-End

Organização das pastas do `src` para manter o projeto modular e escalável:

| 📂 Pasta           | Descrição                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **`components`**   | Componentes reutilizáveis, como botões, inputs, modais e cards.                                                           |
| **`helpers`**      | Funções auxiliares para manipulação de dados, formatação de textos, datas, etc.                                           |
| **`connection`**   | Gerencia a comunicação com o backend, incluindo requisições à API e autenticação.                                         |
| **`interfaces`**   | Define tipagens (interfaces e types) para manter o TypeScript organizado.                                                 |
| **`pages`**        | Contém as páginas principais do projeto, geralmente roteadas.                                                             |
| **`uteis`**        | Armazena funções, constantes e configurações globais que podem ser utilizadas em diferentes partes do projeto.            |
| 🎨 **`index.css`** | Arquivo de estilo que combina Tailwind CSS com variáveis personalizadas. **Siga este padrão para manter a consistência.** |

---

# Configuração do `index.css`

O arquivo `index.css` é responsável por definir estilos globais e personalizações para o projeto, garantindo um design consistente em toda a aplicação.

## Estilos Globais

Configuração do corpo da página:

```css
@layer utilities {
  body {
    @apply relative w-4/5 mx-auto bg-white;
  }

  body::before {
    content: "";
    @apply fixed w-full h-full bg-brown-light left-0 top-0 -z-10;
    clip-path: ellipse(50% 100% at left center);
  }
```

## Camada de Utilitários

Estilos padrões aplicados automaticamente às tags especificadas. Não é necessário adicionar classes extras, apenas usar as tags corretamente para que elas recebam os valores já definidos.

```css
  .icon {
    @apply text-brown-normal text-2xl cursor-pointer;
  }

  p, h1, h2, h3, h4, input, select, label, legend, span {
    @apply text-blue;
  }

  h1 {
    @apply text-4xl;
  }

  h2 {
    @apply text-3xl;
  }

  h3 {
    @apply text-2xl;
  }

  h4 {
    @apply text-xl;
  }

  p, legend {
    @apply text-base;
  }

  .modal, .card {
    @apply bg-white rounded-md shadow p-8;
  }
}
```

## Definição de Tema

Abaixo estão as paletas de cores utilizadas na aplicação. Essas cores são aplicadas globalmente e garantem a harmonia visual do projeto.

```css
@theme {
  /* Variáveis de Fonte */
  --font-sans: "Dosis", serif;

  /* Variáveis de Cores */
  --color-gray-light: #f1f1f1;
  --color-gray-medium: #a9a9a9;
  --color-green: #b5c865;
  --color-blue: #374957;
  --color-brown-light: #fdedee;
  --color-brown-light-active: #fac8cb;
  --color-brown-normal: #ee4c58;
  --color-brown-dark: #c0434d;
}
```

# Para Identificar as Cores do CSS no Figma ou uso de imagem

- As cores utilizadas estão `index.css` definidas como variáveis.
- No Figma, a cor selecionada terá um código hexadecimal (exemplo: `#ee4c58`). Compare esse código com as variáveis CSS para garantir que está usando a cor correta.
- As imagem deve ser retira do React Icons

---

# Uso dos Componentes de Botão

Os botões possuem diferentes variações de estilo e funcionalidade:

- **Botão Padrão (`default`)**: Exibe um botão com estilo padrão.

  ```jsx
  <Button color="default" onClick={() => alert("Botão Padrão")}>
    Botão Padrão
  </Button>
  ```

- **Botão Secundário (`secondary`)**: Apresenta um estilo alternativo.

  ```jsx
  <Button color="secondary" onClick={() => console.log("Secundário")}>
    Botão Secundário
  </Button>
  ```

- **Botão Contorno (`outlined`)**: Similar ao secundário, mas com bordas destacadas e sen a cor de fundo.

  ```jsx
  <Button color="outlined" onClick={() => console.log("Secundário")}>
    Botão outlined
  </Button>
  ```

- **Botão Simples (`plain`)**: Exibe um botão sem destaque, sem borda e sem cor de fundo.

  ```jsx
  <Button color="plain">Botão Simples</Button>
  ```

- **Botão Desabilitado (`disabled`)**: Aparece visualmente desativado com a opcinada um pouco baixa e não responde a interações do usuário.
  ```jsx
  <Button color="plain" disabled>
    disabled
  </Button>
  ```

Cada variação é definida pelo atributo `color` dentro do componente `<Button>`, e eventos como `onClick, disabled, type` podem ser adicionados para personalizar a interação.

FIGMA: https://www.figma.com/design/BQSuInzKROscBjBKKd4hak/Clone-ifood?node-id=0-1&p=f&t=UJRn2Gr58uB5HLVs-0
