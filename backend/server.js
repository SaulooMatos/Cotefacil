const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste/health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TODO: No Desafio 2, este backend será usado como proxy para a Unsplash API
// para evitar problemas de CORS e gerenciar a chave de API de forma segura

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

