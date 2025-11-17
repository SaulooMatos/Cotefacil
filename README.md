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

### Passo 1: Instalar Dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
# Na raiz do projeto
npm install
```

### Passo 2: Iniciar o Backend

Em um terminal, navegue até a pasta `backend` e execute:

```bash
cd backend
npm run dev
```

O servidor backend estará rodando na porta **3001**.

**Nota:** Antes de iniciar o backend, crie um arquivo chamado .env dentro da pasta backend contendo exatamente estas variáveis, que serão utilizadas para autenticação na Unsplash API:

MINIO_USER_ID 
<INSIRA_AQUI_O_USER_ID>

MINIO_ACCESS_KEY <INSIRA_AQUI_A_ACCESS_KEY>

MINIO_SECRET_KEY <INSIRA_AQUI_A_SECRET_KEY>

### Passo 3: Iniciar o Frontend

Em um **novo terminal**, na raiz do projeto, execute:

```bash
npm start
```

O frontend estará rodando na porta **3000** e abrirá automaticamente no navegador.

**Acesse:** `http://localhost:3000`

## Visão Técnica

### Frontend

O frontend é responsável por todas as telas dos 3 desafios:

- **Tela Inicial (`/`)** - Menu principal com botões de navegação para os desafios
- **Desafio 1 (`/desafio1`)** - Aplicação To-Do List
- **Desafio 2 (`/desafio2`)** - Galeria de Imagens
- **Desafio 3 (`/desafio3`)** - Dashboard de Tarefas

A aplicação utiliza **React Router** para gerenciar a navegação entre as rotas. Todas as páginas de desafios compartilham um layout comum (`LayoutDesafio`) que inclui um cabeçalho fixo com botões de navegação.

## Desafio 1 – To-Do List

### Implementação

O **Desafio 1** é uma aplicação completa de lista de tarefas (To-Do List) implementada na rota `/desafio1`. A aplicação foi desenvolvida utilizando exclusivamente **componentes funcionais** e **hooks do React**.

### Tecnologias e Recursos Utilizados

- **React Hooks:**
  - `useState` - Para gerenciar o estado das tarefas, formulário e filtros
  - `useEffect` - Para carregar e salvar tarefas no localStorage automaticamente

- **LocalStorage:**
  - Persistência automática de dados no navegador
  - Chave utilizada: `"cotefacil_desafio1_tarefas"`
  - As tarefas são salvas automaticamente sempre que a lista é modificada

- **CSS3:**
  - Estilização responsiva com variáveis CSS
  - Design moderno seguindo a paleta de cores do projeto
  - Animações e transições suaves

### Funcionalidades Implementadas

1. **Adicionar Tarefa:**
   - Campo obrigatório para título da tarefa
   - Campo opcional para descrição
   - Botão "Adicionar Tarefa" com validação
   - Limpeza automática dos campos após adicionar

2. **Editar Tarefa:**
   - Modo de edição inline (a tarefa se transforma em um formulário)
   - Permite editar título e descrição
   - Botões "Salvar" e "Cancelar" para confirmar ou descartar alterações

3. **Marcar como Concluída:**
   - Checkbox para alternar entre pendente e concluída
   - Visual diferenciado para tarefas concluídas (texto riscado, opacidade reduzida)
   - Badge de status (Pendente/Concluída) com cores distintas

4. **Remover Tarefa:**
   - Botão de remover com ícone de lixeira
   - Confirmação antes de remover

5. **Filtros:**
   - Botões para filtrar tarefas:
     - **Todas** - Mostra todas as tarefas
     - **Pendentes** - Mostra apenas tarefas não concluídas
     - **Concluídas** - Mostra apenas tarefas concluídas
   - Contador de tarefas em cada filtro

6. **Estatísticas:**
   - Exibição de estatísticas:
     - Total de tarefas
     - Tarefas pendentes
     - Tarefas concluídas

7. **Persistência:**
   - Todas as tarefas são automaticamente salvas no localStorage
   - Ao recarregar a página, as tarefas são restauradas automaticamente

### Estrutura de Componentes

- **`src/pages/Desafio1.jsx`** - Componente principal que gerencia o estado e a lógica da aplicação
- **`src/components/Todo/TaskItem.jsx`** - Componente que renderiza cada tarefa individual
- **`src/pages/Desafio1.css`** - Estilos específicos da página
- **`src/components/Todo/TaskItem.css`** - Estilos do componente de tarefa

### Acesso

Para acessar a aplicação To-Do List:
- Navegue para `http://localhost:3000/desafio1` após iniciar o frontend
- Ou clique no botão "Desafio 1 – To-Do List" na tela inicial

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

