# Grande Desafio Técnico Cotefácil – Saulo Henrique de Oliveira Matos

Este projeto foi desenvolvido como parte do Grande Desafio Técnico Cotefácil, contendo uma aplicação completa com frontend em React e backend em Node.js.

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

- **`/backend`** → Servidor Node.js com Express
- **`/frontend`** → Aplicação React (arquivos na raiz `src/`)

## Tecnologias Utilizadas

### Frontend
- **React** (v19.2.0) - Biblioteca JavaScript para construção de interfaces
- **React Router DOM** (v6.20.0) - Roteamento e navegação entre páginas
- **CSS3** - Estilização responsiva com variáveis CSS e media queries

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** (v4.18.2) - Framework web para Node.js
- **CORS** (v2.8.5) - Middleware para habilitar requisições cross-origin
- **Nodemon** (v3.0.1) - Ferramenta de desenvolvimento para reiniciar o servidor automaticamente

## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- npm ou yarn instalado

### Passo 1: Instalar Dependências do Backend

Navegue até a pasta `backend` e instale as dependências:

```bash
cd backend
npm install
```

### Passo 2: Instalar Dependências do Frontend

Na raiz do projeto, instale as dependências do frontend:

```bash
npm install
```

### Passo 3: Iniciar o Backend

No terminal, dentro da pasta `backend`, execute:

```bash
npm run dev
```

O servidor backend estará rodando na porta **3001** (ou na porta definida pela variável de ambiente `PORT`).

Você pode testar se o backend está funcionando acessando:
- `http://localhost:3001/api/health` - Deve retornar `{ "status": "ok" }`

### Passo 4: Iniciar o Frontend

Em um novo terminal, na raiz do projeto, execute:

```bash
npm start
```

O frontend estará rodando na porta **3000** (padrão do Create React App).

Acesse no navegador:
- `http://localhost:3000`

## Visão Técnica

### Frontend

O frontend é responsável por todas as telas dos 3 desafios:

- **Tela Inicial (`/`)** - Menu principal com botões de navegação para os desafios
- **Desafio 1 (`/desafio1`)** - Aplicação To-Do List
- **Desafio 2 (`/desafio2`)** - Galeria de Imagens
- **Desafio 3 (`/desafio3`)** - Dashboard de Tarefas

A aplicação utiliza **React Router** para gerenciar a navegação entre as rotas. Todas as páginas de desafios compartilham um layout comum (`LayoutDesafio`) que inclui um cabeçalho fixo com botões de navegação.

### Backend

O backend foi criado em Node.js com Express para facilitar futuras integrações e comunicação com APIs externas. Atualmente, possui:

- Rota de health check (`GET /api/health`) para verificar o status do servidor
- Configuração de CORS para permitir requisições do frontend
- Estrutura preparada para ser usado como **proxy de API pública** no Desafio 2 (especificamente para a Unsplash API)

O uso do backend como proxy no Desafio 2 ajudará a:
- Evitar problemas de CORS
- Gerenciar chaves de API de forma mais segura
- Controlar e monitorar requisições

## Design

O projeto utiliza um design moderno, limpo e totalmente responsivo com a seguinte paleta de cores:

- **Lime Green** (`#32cd32`) - Para destaques, cores de fundos e títulos
- **Cinza Claro** (`#a0a0a0`) - Para subtítulos
- **Roxo** (`#8b5cf6`) - Para botões e contornos
- **Branco** (`#ffffff`) - Como fundo base das páginas e cards principais

Todas as telas são responsivas e se adaptam a diferentes tamanhos de tela (desktop, tablet e mobile).

## Contato

Em caso de dúvidas sobre o projeto, entre em contato:

- **E-mail:** matossaulo.h@gmail.com
- **WhatsApp:** (14) 99620-4876

---

**Desenvolvido por Saulo Henrique de Oliveira Matos**

