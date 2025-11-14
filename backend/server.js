const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Chave da API Unsplash (em produção, usar variável de ambiente)
// Para desenvolvimento, você pode usar uma chave pública ou criar uma conta gratuita
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY';

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rota proxy para buscar imagens na Unsplash API
app.get('/api/images/search', async (req, res) => {
  try {
    const query = req.query.q || 'nature';
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 20;

    // Se não tiver chave configurada, retorna dados mockados
    if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
      // Retorna dados mockados para desenvolvimento
      const mockImages = [
        {
          id: '1',
          urls: { small: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080' },
          user: { name: 'John Doe', username: 'johndoe' },
          description: 'Beautiful nature landscape',
          alt_description: 'Nature landscape with mountains'
        },
        {
          id: '2',
          urls: { small: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400', regular: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1080' },
          user: { name: 'Jane Smith', username: 'janesmith' },
          description: 'Ocean view at sunset',
          alt_description: 'Ocean sunset'
        },
        {
          id: '3',
          urls: { small: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', regular: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080' },
          user: { name: 'Mike Johnson', username: 'mikejohnson' },
          description: 'Forest path in autumn',
          alt_description: 'Autumn forest'
        }
      ];
      return res.json({ results: mockImages, total: mockImages.length });
    }

    // Chama a API real da Unsplash
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar imagens na Unsplash');
    }

    const data = await response.json();
    
    // Retorna apenas os dados necessários
    const formattedResults = data.results.map(img => ({
      id: img.id,
      urls: {
        small: img.urls.small,
        regular: img.urls.regular
      },
      user: {
        name: img.user.name,
        username: img.user.username
      },
      description: img.description,
      alt_description: img.alt_description,
      tags: img.tags?.map(tag => tag.title) || []
    }));

    res.json({
      results: formattedResults,
      total: data.total,
      total_pages: data.total_pages
    });
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens', message: error.message });
  }
});

// Rota para buscar uma imagem específica por ID
app.get('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
      // Retorna dados mockados
      return res.json({
        id: id,
        urls: { regular: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080' },
        user: { name: 'John Doe', username: 'johndoe' },
        description: 'Beautiful nature landscape',
        alt_description: 'Nature landscape',
        tags: ['nature', 'landscape', 'mountains']
      });
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/${id}?client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar imagem na Unsplash');
    }

    const img = await response.json();
    
    res.json({
      id: img.id,
      urls: {
        regular: img.urls.regular,
        full: img.urls.full
      },
      user: {
        name: img.user.name,
        username: img.user.username
      },
      description: img.description,
      alt_description: img.alt_description,
      tags: img.tags?.map(tag => tag.title) || []
    });
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    res.status(500).json({ error: 'Erro ao buscar imagem', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
    console.log('⚠️  Usando dados mockados. Configure UNSPLASH_ACCESS_KEY para usar a API real.');
  }
});

