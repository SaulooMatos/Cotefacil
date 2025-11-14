import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutDesafio from '../components/Layout/LayoutDesafio';
import './Desafio2.css';

const API_BASE_URL = 'http://localhost:3001';

const Desafio2 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [localImages, setLocalImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageSourceType, setImageSourceType] = useState('url'); // 'url' ou 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dateFilter, setDateFilter] = useState(''); // Filtro de data (formato YYYY-MM-DD)
  const [themeFilter, setThemeFilter] = useState(''); // Filtro de tema
  
  const [formData, setFormData] = useState({
    url: '',
    titulo: '',
    autor: '',
    tema: ''
  });

  // Opções de tema disponíveis
  const temasDisponiveis = [
    { value: '', label: 'Selecione um tema' },
    { value: 'Paisagem', label: 'Paisagem' },
    { value: 'Foto de perfil', label: 'Foto de perfil' },
    { value: 'Fotos espontâneas', label: 'Fotos espontâneas' },
    { value: 'Foto em galeria', label: 'Foto em galeria' },
    { value: 'Foto aleatória', label: 'Foto aleatória' }
  ];

  // Carregar imagens locais do localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('desafio2_local_images');
    if (savedImages) {
      try {
        setLocalImages(JSON.parse(savedImages));
      } catch (error) {
        console.error('Erro ao carregar imagens locais:', error);
      }
    }
  }, []);

  // Buscar imagens ao carregar a página pela primeira vez
  useEffect(() => {
    buscarImagens('nature');
  }, []);

  const buscarImagens = async (termo = searchTerm) => {
    if (!termo.trim()) {
      setError('Digite um termo para buscar');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/search?q=${encodeURIComponent(termo)}`);
      
      if (!response.ok) {
        // Se o servidor retornar erro, mas não for erro de conexão, mostra mensagem genérica
        if (response.status >= 500) {
          throw new Error('Erro no servidor. Tente novamente mais tarde.');
        } else {
          throw new Error('Não foi possível buscar imagens.');
        }
      }

      const data = await response.json();
      setImages(data.results || []);
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
      // Verifica se é erro de conexão (servidor não está rodando)
      const errorMessage = err.message || err.toString();
      if (errorMessage.includes('Failed to fetch') || 
          errorMessage.includes('NetworkError') || 
          errorMessage.includes('Network request failed') ||
          errorMessage.includes('ERR_INTERNET_DISCONNECTED') ||
          errorMessage.includes('ERR_CONNECTION_REFUSED')) {
        setError('Não foi possível conectar ao servidor. Você pode adicionar imagens manualmente usando a opção abaixo.');
      } else {
        setError(err.message || 'Erro ao buscar imagens.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarImagens();
  };

  // Converter arquivo para base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handler para seleção de arquivo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido.');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB.');
        return;
      }

      setSelectedFile(file);
      try {
        const base64 = await fileToBase64(file);
        setFilePreview(base64);
        setError('');
      } catch (err) {
        console.error('Erro ao processar arquivo:', err);
        setError('Erro ao processar a imagem. Tente novamente.');
      }
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.autor.trim() || !formData.tema) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    let imageUrl = '';

    if (imageSourceType === 'file') {
      if (!selectedFile) {
        setError('Selecione uma imagem do seu computador');
        return;
      }
      imageUrl = filePreview;
    } else {
      if (!formData.url.trim()) {
        setError('Digite uma URL ou selecione uma imagem do seu computador');
        return;
      }
      imageUrl = formData.url;
    }

    const novaImagem = {
      id: `local-${Date.now()}`,
      urls: {
        small: imageUrl,
        regular: imageUrl
      },
      user: {
        name: formData.autor,
        username: formData.autor.toLowerCase().replace(/\s+/g, '')
      },
      description: formData.titulo,
      alt_description: formData.titulo,
      isLocal: true,
      tema: formData.tema, // Salva o tema da imagem
      createdAt: new Date().toISOString(), // Salva a data de criação
      createdAtTimestamp: Date.now() // Timestamp para facilitar comparações
    };

    const novasImagens = [...localImages, novaImagem];
    setLocalImages(novasImagens);
    localStorage.setItem('desafio2_local_images', JSON.stringify(novasImagens));
    
    // Limpar formulário
    setFormData({ url: '', titulo: '', autor: '', tema: '' });
    setSelectedFile(null);
    setFilePreview(null);
    setImageSourceType('url');
    setError('');
  };

  // Função para deletar imagem local
  const handleDeleteImage = (imageId) => {
    if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
      const novasImagens = localImages.filter(img => img.id !== imageId);
      setLocalImages(novasImagens);
      localStorage.setItem('desafio2_local_images', JSON.stringify(novasImagens));
    }
  };

  // Função para filtrar imagens por data e tema
  const filterImages = (imagesList) => {
    return imagesList.filter(img => {
      // Filtro por data (apenas para imagens locais)
      if (dateFilter) {
        if (!img.isLocal || !img.createdAt) {
          return false; // Se há filtro de data, mostra apenas imagens locais com data
        }
        const imageDate = new Date(img.createdAt).toISOString().split('T')[0];
        if (imageDate !== dateFilter) {
          return false;
        }
      }

      // Filtro por tema (apenas para imagens locais)
      if (themeFilter) {
        if (!img.isLocal || !img.tema) {
          return false; // Se há filtro de tema, mostra apenas imagens locais com tema
        }
        if (img.tema !== themeFilter) {
          return false;
        }
      }

      // Se não há filtros, retorna todas as imagens
      // Se há filtros mas a imagem é da API, só mostra se não há filtros aplicados
      if (!dateFilter && !themeFilter) {
        return true; // Mostra todas quando não há filtros
      }
      
      // Se há filtros, mostra apenas imagens locais que passaram nos filtros
      return img.isLocal;
    });
  };

  // Combinar imagens e aplicar filtro
  const todasImagens = filterImages([...images, ...localImages]);

  return (
    <LayoutDesafio>
      <div className="desafio2-container">
        <h2 className="desafio2-title">Desafio 2 – Galeria de Imagens</h2>
        <p className="desafio2-subtitle">
          Galeria de imagens utilizando API pública (Unsplash) via React Router
        </p>

        {/* Formulário de Busca */}
        <div className="search-section">
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar imagens (ex: nature, ocean, city...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? 'Buscando...' : '🔍 Buscar'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Formulário para Adicionar Imagem Manualmente */}
        <div className="add-image-section">
          <h3 className="section-title">➕ Adicionar Imagem Manualmente</h3>
          
          {/* Seletor de tipo de origem */}
          <div className="source-type-selector">
            <button
              type="button"
              className={`source-type-btn ${imageSourceType === 'url' ? 'active' : ''}`}
              onClick={() => {
                setImageSourceType('url');
                setSelectedFile(null);
                setFilePreview(null);
                setError('');
              }}
            >
              🌐 URL
            </button>
            <button
              type="button"
              className={`source-type-btn ${imageSourceType === 'file' ? 'active' : ''}`}
              onClick={() => {
                setImageSourceType('file');
                setFormData({ ...formData, url: '' });
                setError('');
              }}
            >
              💾 Do meu PC
            </button>
          </div>

          <form className="add-image-form" onSubmit={handleAddImage}>
            {imageSourceType === 'url' ? (
              <div className="form-row">
                <input
                  type="url"
                  className="form-input"
                  placeholder="URL da imagem"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Título"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Autor"
                  value={formData.autor}
                  onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                  required
                />
              </div>
            ) : (
              <div className="form-row">
                <div className="file-input-wrapper">
                  <label htmlFor="file-input" className="file-input-label">
                    {selectedFile ? `📷 ${selectedFile.name}` : '📁 Escolher imagem do PC'}
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={handleFileChange}
                  />
                  {filePreview && (
                    <div className="file-preview">
                      <img src={filePreview} alt="Preview" className="preview-image" />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Título"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Autor"
                  value={formData.autor}
                  onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                  required
                />
              </div>
            )}
            {/* Campo de Tema */}
            <div className="theme-selector-row">
              <label htmlFor="tema-select" className="theme-label">
                🎨 Tema da imagem:
              </label>
              <select
                id="tema-select"
                className="theme-select"
                value={formData.tema}
                onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                required
              >
                {temasDisponiveis.map((tema) => (
                  <option key={tema.value} value={tema.value}>
                    {tema.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="add-btn">➕ Adicionar Imagem</button>
          </form>
        </div>

        {/* Galeria de Imagens */}
        <div className="gallery-section">
          <div className="gallery-header">
            <h3 className="section-title">
              📸 Galeria ({todasImagens.length} {todasImagens.length === 1 ? 'imagem' : 'imagens'})
            </h3>
            
            {/* Filtros de Data e Tema */}
            <div className="filters-container">
              <div className="filter-group">
                <label htmlFor="date-filter" className="filter-label">
                  📅 Filtrar por data:
                </label>
                <input
                  id="date-filter"
                  type="date"
                  className="filter-input"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="theme-filter" className="filter-label">
                  🎨 Filtrar por tema:
                </label>
                <select
                  id="theme-filter"
                  className="filter-select"
                  value={themeFilter}
                  onChange={(e) => setThemeFilter(e.target.value)}
                >
                  <option value="">Todos os temas</option>
                  {temasDisponiveis.slice(1).map((tema) => (
                    <option key={tema.value} value={tema.value}>
                      {tema.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {(dateFilter || themeFilter) && (
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={() => {
                    setDateFilter('');
                    setThemeFilter('');
                  }}
                >
                  ✕ Limpar filtros
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Carregando imagens...</div>
          ) : todasImagens.length === 0 ? (
            <div className="empty-gallery">
              <p>Nenhuma imagem encontrada. Faça uma busca ou adicione uma imagem manualmente.</p>
              {(dateFilter || themeFilter) && (
                <p className="filter-info">Tente remover os filtros para ver mais imagens.</p>
              )}
            </div>
          ) : (
            <div className="gallery-grid">
              {todasImagens.map((image) => (
                <ImageCard 
                  key={image.id} 
                  image={image} 
                  onDelete={image.isLocal ? handleDeleteImage : null}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutDesafio>
  );
};

// Componente de Card de Imagem
const ImageCard = ({ image, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/desafio2/image/${image.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Previne que o clique vá para o card
    if (onDelete) {
      onDelete(image.id);
    }
  };

  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="image-card" onClick={handleClick}>
      <div className="image-wrapper">
        <img
          src={image.urls.small || image.urls.regular}
          alt={image.alt_description || image.description || 'Imagem'}
          className="image-thumbnail"
        />
        {image.isLocal && <span className="local-badge">Local</span>}
        {onDelete && (
          <button
            className="delete-image-btn"
            onClick={handleDelete}
            title="Deletar imagem"
          >
            🗑️
          </button>
        )}
      </div>
      <div className="image-info">
        <p className="image-author">📷 {image.user.name}</p>
        <p className="image-description">
          {image.description || image.alt_description || 'Sem descrição'}
        </p>
        {image.createdAt && (
          <p className="image-date">📅 {formatDate(image.createdAt)}</p>
        )}
        {image.tema && (
          <p className="image-theme">🎨 Tema: {image.tema}</p>
        )}
      </div>
    </div>
  );
};

// Componente de Detalhes da Imagem
export const ImageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarImagem = async () => {
      setLoading(true);
      setError('');

      try {
        // Primeiro, verifica se é uma imagem local
        const savedImages = localStorage.getItem('desafio2_local_images');
        if (savedImages) {
          const localImages = JSON.parse(savedImages);
          const localImage = localImages.find(img => img.id === id);
          
          if (localImage) {
            setImage(localImage);
            setLoading(false);
            return;
          }
        }

        // Se não for local, busca na API
        const response = await fetch(`${API_BASE_URL}/api/images/${id}`);
        
        if (!response.ok) {
          throw new Error('Imagem não encontrada');
        }

        const data = await response.json();
        setImage(data);
      } catch (err) {
        console.error('Erro ao carregar imagem:', err);
        // Verifica se é erro de conexão
        const errorMessage = err.message || err.toString();
        if (errorMessage.includes('Failed to fetch') || 
            errorMessage.includes('NetworkError') || 
            errorMessage.includes('Network request failed') ||
            errorMessage.includes('ERR_INTERNET_DISCONNECTED') ||
            errorMessage.includes('ERR_CONNECTION_REFUSED')) {
          setError('Não foi possível conectar ao servidor para carregar esta imagem.');
        } else {
          setError(err.message || 'Erro ao carregar imagem.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarImagem();
    }
  }, [id]);

  if (loading) {
    return (
      <LayoutDesafio>
        <div className="desafio2-container">
          <div className="loading">Carregando detalhes da imagem...</div>
        </div>
      </LayoutDesafio>
    );
  }

  if (error || !image) {
    return (
      <LayoutDesafio>
        <div className="desafio2-container">
          <div className="error-message">{error || 'Imagem não encontrada'}</div>
          <button className="back-btn" onClick={() => navigate('/desafio2')}>
            ← Voltar para galeria
          </button>
        </div>
      </LayoutDesafio>
    );
  }

  return (
    <LayoutDesafio>
      <div className="desafio2-container">
        <button className="back-btn" onClick={() => navigate('/desafio2')}>
          ← Voltar para galeria
        </button>

        <div className="image-details">
          <div className="image-details-image">
            <img
              src={image.urls.regular || image.urls.full}
              alt={image.alt_description || image.description || 'Imagem'}
              className="detail-image"
            />
            {image.isLocal && <span className="local-badge">Local</span>}
          </div>

          <div className="image-details-info">
            <h2 className="detail-title">
              {image.description || image.alt_description || 'Sem título'}
            </h2>
            
            <div className="detail-meta">
              <p className="detail-author">
                <strong>📷 Autor:</strong> {image.user.name}
              </p>
              {image.user.username && (
                <p className="detail-username">
                  <strong>👤 Username:</strong> @{image.user.username}
                </p>
              )}
              {image.createdAt && (
                <p className="detail-date">
                  <strong>📅 Data de adição:</strong> {new Date(image.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
              {image.tema && (
                <p className="detail-theme">
                  <strong>🎨 Tema:</strong> {image.tema}
                </p>
              )}
            </div>

            {image.alt_description && (
              <p className="detail-description">
                <strong>📝 Descrição:</strong> {image.alt_description}
              </p>
            )}

            {image.tags && image.tags.length > 0 && (
              <div className="detail-tags">
                <strong>🏷️ Tags:</strong>
                <div className="tags-list">
                  {image.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutDesafio>
  );
};

export default Desafio2;
