# Padronização do Uso de Git e GitHub

## Pegando a versão mais recente do `develop`
Antes de criar uma nova branch, garanta que seu código está atualizado.
```sh
git checkout develop
git pull origin develop
```

## Criando uma nova branch
Agora você pode criar uma branch para suas mudanças.
```sh
git checkout -b minha-nova-branch
```

## Fazendo alterações e commitando
Após modificar os arquivos necessários, adicione e salve suas mudanças no Git.
```sh
git add .
git commit -m "Descrição das alterações"
```

## Mantendo sua branch atualizada com o `develop`
Manter sua branch sincronizada com o `develop` evita conflitos ao fazer merge ou pull request.
```sh
git merge develop
```
Se houver conflitos, resolva-os e salve as alterações:
```sh
git add .
git commit -m "Resolvendo conflitos"
```
Como alternativa ao merge, você pode usar `rebase`:
```sh
git rebase develop
```

---

# Estruturação Front-End

Organização das pastas do `src` para manter o projeto modular e escalável:

## 📂 `components`
Componentes reutilizáveis, como botões, inputs, modais e cards.

## 📂 `helpers`
Funções auxiliares para manipulação de dados, formatação de textos, datas, etc.

## 📂 `connection`
Gerencia a comunicação com o backend, incluindo requisições à API e autenticação.

## 📂 `interfaces`
Define tipagens (interfaces e types) para manter o TypeScript organizado.

## 📂 `pages`
Contém as páginas principais do projeto, geralmente roteadas.

## 📂 `uteis`
Armazena funções, constantes e configurações globais que podem ser utilizadas em diferentes partes do projeto.

## 🎨 `index.css`
Arquivo de estilo que combina Tailwind CSS com variáveis personalizadas. **Siga este padrão para manter a consistência.**

---

# Configuração do `index.css`

O arquivo `index.css` é responsável por definir estilos globais e personalizações para o projeto, combinando Tailwind CSS com variáveis customizadas.

### Importação do Tailwind CSS
As configurações básicas do Tailwind CSS são importadas da seguinte forma:
```css
@import "tailwindcss";
@import "tailwindcss/theme";
@import "tailwindcss/utilities";
```

### Estilos Globais
Configuração do corpo da página:
```css
body {
  width: 80%;
  margin: auto;
  background-color: white;
}
```

### Camada de Utilitários
Classes utilitárias personalizadas para ícones e tipografia:
```css
@layer utilities {
  .icon {
    @apply text-brown-normal text-[1.5rem] cursor-pointer;
  }
  p, h1, h2, h3, h4, input, select, label, legend {
    @apply text-blue font-Dosis;
  }
  h1 {@apply text-[2.25rem];}
  h2 {@apply text-[1.875rem];}
  h3 {@apply text-[1.5rem];}
  h4 {@apply text-[1.3rem];}
  p, legend {@apply text-[1rem];}
}
```

### Definição de Tema
Criação de variáveis CSS para fontes e cores:
```css
@theme {
  /* Variáveis de Fonte */
  --font-Dosis: "Dosis", serif;

  /* Variáveis de Cores */
  --color-gray-claro: #f1f1f1;
  --color-gray-medio: #a9a9a9;
  --color-green: #b5c865;
  --color-blue: #374957;
  --color-brown-ligth: #fdedee;
  --color-brown-ligth-active: #fac8cb;
  --color-brown-normal: #ee4c58;
  --color-brown-dark: #c0434d;
}
```
# Como Identificar as Cores do CSS no Figma

Para garantir a consistência visual entre o design no Figma e o desenvolvimento front-end, siga este guia para identificar corretamente as cores definidas no `index.css` dentro do Figma.

## Passo 1: Acessar o Painel de Estilos no Figma
1. Abra o arquivo do projeto no Figma.
2. Selecione o elemento cuja cor você deseja verificar.
3. No painel direito, localize a seção **Fill (Preenchimento)**.
4. Clique na cor para abrir o seletor de cores.

## Passo 2: Comparar com as Variáveis CSS
As cores utilizadas no `index.css` estão definidas como variáveis. Aqui estão algumas das principais:

- `--color-gray-claro: #f1f1f1;`
- `--color-gray-medio: #a9a9a9;`
- `--color-green: #b5c865;`
- `--color-blue: #374957;`
- `--color-brown-ligth: #fdedee;`
- `--color-brown-ligth-active: #fac8cb;`
- `--color-brown-normal: #ee4c58;`
- `--color-brown-dark: #c0434d;`

No Figma, a cor selecionada terá um código hexadecimal (exemplo: `#ee4c58`). Compare esse código com as variáveis CSS para garantir que está usando a cor correta.

---

FIGMA: https://www.figma.com/design/BQSuInzKROscBjBKKd4hak/Clone-ifood?node-id=0-1&p=f&t=UJRn2Gr58uB5HLVs-0


