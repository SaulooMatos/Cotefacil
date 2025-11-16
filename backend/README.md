# Backend - Desafio 2 (Galeria de Imagens)

Este é o servidor backend para o Desafio 2, que fornece um proxy para a API Unsplash.

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend` e configure:

- **PORT**: Porta do servidor (padrão: 3001)
- **UNSPLASH_ACCESS_KEY**: Chave da API Unsplash (opcional)

### 3. Obter chave da API Unsplash (Opcional)

Para usar a API real da Unsplash:

1. Acesse https://unsplash.com/developers
2. Crie uma conta ou faça login
3. Vá em "Your apps"
4. Clique em "New Application"
5. Preencha os dados e crie o app
6. Copie a "Access Key"
7. Cole no arquivo `.env` na variável `UNSPLASH_ACCESS_KEY`

**Nota**: Se não configurar a chave, o servidor usará dados mockados para desenvolvimento.

## Executar

### Modo desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo produção

```bash
npm start
```

O servidor estará rodando em `http://localhost:3001` (ou na porta configurada).

## Endpoints

### Health Check
```
GET /api/health
```
Retorna `{ "status": "ok" }` se o servidor estiver funcionando.

### Buscar imagens
```
GET /api/images/search?q=nature&page=1&per_page=20
```
- `q`: Termo de busca (obrigatório)
- `page`: Número da página (opcional, padrão: 1)
- `per_page`: Imagens por página (opcional, padrão: 20)

### Buscar imagem por ID
```
GET /api/images/:id
```
- `id`: ID da imagem na Unsplash

## Observações

- Se não tiver chave da Unsplash configurada, o servidor retornará dados mockados
- A chave da Unsplash é gratuita e permite até 50 requisições por hora
- Para produção, use variáveis de ambiente do servidor, não o arquivo `.env`

