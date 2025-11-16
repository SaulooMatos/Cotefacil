require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const UNSPLASH_ACCESS_KEY = (process.env.UNSPLASH_ACCESS_KEY || '').trim();
const isKeyConfigured = UNSPLASH_ACCESS_KEY && 
                         UNSPLASH_ACCESS_KEY.length > 20 && 
                         UNSPLASH_ACCESS_KEY !== 'YOUR_UNSPLASH_ACCESS_KEY';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/images/search', async (req, res) => {
  try {
    const query = req.query.q || 'nature';
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 20;

    if (!isKeyConfigured) {
      const mockImages = Array.from({ length: 20 }, (_, i) => {
        const images = [
          { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', desc: 'Beautiful nature landscape', author: 'John Doe' },
          { id: '2', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400', desc: 'Ocean view at sunset', author: 'Jane Smith' },
          { id: '3', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', desc: 'Forest path in autumn', author: 'Mike Johnson' },
          { id: '4', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', desc: 'Mountain peak with clouds', author: 'Sarah Williams' },
          { id: '5', url: 'https://images.unsplash.com/photo-1501594907352-04c25938ceb8?w=400', desc: 'Desert landscape at dawn', author: 'David Brown' }
        ];
        const img = images[i % images.length];
        return {
          id: `${img.id}-${i}`,
          urls: { 
            small: img.url.replace('w=400', 'w=400'), 
            regular: img.url.replace('w=400', 'w=1080') 
          },
          user: { 
            name: img.author, 
            username: img.author.toLowerCase().replace(/\s+/g, '') 
          },
          description: `${img.desc} - ${query}`,
          alt_description: img.desc,
          tags: query.split(' ').slice(0, 3)
        };
      });
      return res.json({ results: mockImages, total: mockImages.length, total_pages: 1 });
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar imagens na Unsplash');
    }

    const data = await response.json();
    
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

app.get('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isKeyConfigured) {
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
});
