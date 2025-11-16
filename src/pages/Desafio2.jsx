import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LayoutDesafio from '../components/Layout/LayoutDesafio';
import './Desafio2.css';

const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1';
const USE_PEXELS = !!PEXELS_API_KEY;
const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const Desafio2 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [localImages, setLocalImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageSourceType, setImageSourceType] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  
  const [formData, setFormData] = useState({
    url: '',
    titulo: '',
    autor: '',
    tema: ''
  });

  const searchedImagesRef = useRef(null);
  const localGalleryRef = useRef(null);

  const temasDisponiveis = [
    { value: '', label: 'Selecione um tema' },
    { value: 'Paisagem', label: 'Paisagem' },
    { value: 'Foto de perfil', label: 'Foto de perfil' },
    { value: 'Fotos espontâneas', label: 'Fotos espontâneas' },
    { value: 'Foto em galeria', label: 'Foto em galeria' },
    { value: 'Foto aleatória', label: 'Foto aleatória' }
  ];

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

    if (USE_PEXELS) {
      try {
        const response = await fetch(
          `${PEXELS_API_URL}/search?query=${encodeURIComponent(termo)}&per_page=20`,
          {
            headers: {
              'Authorization': PEXELS_API_KEY
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          
          const formattedResults = (data.photos || []).map((img, index) => ({
            id: `pexels-${img.id || index}`,
            urls: {
              small: img.src.medium,
              regular: img.src.large,
              full: img.src.original
            },
            user: {
              name: img.photographer || 'Fotógrafo Desconhecido',
              username: img.photographer_id || 'unknown'
            },
            description: img.alt || `Foto de ${termo}`,
            alt_description: img.alt || `Foto de ${termo}`,
            tags: []
          }));
          
          setImages(formattedResults);
          
          // Scroll automático para a seção de imagens pesquisadas
          setTimeout(() => {
            if (searchedImagesRef.current) {
              searchedImagesRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
            }
          }, 300);
          
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('Pexels não disponível, usando Lorem Picsum');
      }
    }

    try {
      const backendResponse = await fetch(
        `${BACKEND_API_URL}/api/images/search?q=${encodeURIComponent(termo)}&per_page=20`
      );
      
      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        
        if (backendData.results && backendData.results.length > 0) {
          const formattedResults = backendData.results.map((img) => ({
            id: `unsplash-${img.id}`,
            urls: {
              small: img.urls.small,
              regular: img.urls.regular,
              full: img.urls.full || img.urls.regular
            },
            user: {
              name: img.user.name,
              username: img.user.username
            },
            description: img.description || `Foto de ${termo}`,
            alt_description: img.alt_description || img.description || `Foto de ${termo}`,
            tags: img.tags || []
          }));
          
          setImages(formattedResults);
          
          // Scroll automático para a seção de imagens pesquisadas
          setTimeout(() => {
            if (searchedImagesRef.current) {
              searchedImagesRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
            }
          }, 300);
          
          setLoading(false);
          return;
        }
      }
    } catch (backendErr) {
      console.log('Backend não disponível, usando Lorem Picsum como fallback');
    }

    try {
      const seed = termo.toLowerCase().replace(/\s+/g, '');
      const images = [];
      
      for (let i = 0; i < 20; i++) {
        const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const imageId = (hash + i) % 1000;
        
        images.push({
          id: `picsum-${imageId}-${i}`,
          urls: {
            small: `https://picsum.photos/seed/${seed}${i}/400/300`,
            regular: `https://picsum.photos/seed/${seed}${i}/800/600`,
            full: `https://picsum.photos/seed/${seed}${i}/1920/1080`
          },
          user: {
            name: 'Fotógrafo',
            username: 'picsum'
          },
          description: `Imagem relacionada a ${termo}`,
          alt_description: `Imagem relacionada a ${termo}`,
          tags: []
        });
      }
      
      setImages(images);
      setError('');
      
      setTimeout(() => {
        if (searchedImagesRef.current) {
          searchedImagesRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300);
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
      setError('Erro ao buscar imagens. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarImagens();
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione um arquivo de imagem válido.');
        return;
      }

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
      tema: formData.tema,
      createdAt: new Date().toISOString(),
      createdAtTimestamp: Date.now()
    };

    const novasImagens = [...localImages, novaImagem];
    setLocalImages(novasImagens);
    localStorage.setItem('desafio2_local_images', JSON.stringify(novasImagens));
    
    setFormData({ url: '', titulo: '', autor: '', tema: '' });
    setSelectedFile(null);
    setFilePreview(null);
    setImageSourceType('url');
    setError('');
  };

  const handleSaveImage = (image) => {
    const jaSalva = localImages.some(img => 
      img.id === image.id || 
      (img.urls && img.urls.regular === image.urls.regular)
    );

    if (jaSalva) {
      alert('Esta imagem já está salva na sua galeria!');
      return;
    }

    const imagemParaSalvar = {
      ...image,
      id: `local-${Date.now()}-${image.id}`,
      isLocal: true,
      createdAt: new Date().toISOString(),
      createdAtTimestamp: Date.now(),
      tema: 'Foto aleatória'
    };

    const novasImagens = [...localImages, imagemParaSalvar];
    setLocalImages(novasImagens);
    localStorage.setItem('desafio2_local_images', JSON.stringify(novasImagens));
    
    alert('Imagem salva com sucesso na sua galeria!');
    
    setTimeout(() => {
      if (localGalleryRef.current) {
        localGalleryRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 500);
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
      const novasImagens = localImages.filter(img => img.id !== imageId);
      setLocalImages(novasImagens);
      localStorage.setItem('desafio2_local_images', JSON.stringify(novasImagens));
    }
  };

  const filterLocalImages = (imagesList) => {
    return imagesList.filter(img => {
      if (dateFilter) {
        if (!img.isLocal || !img.createdAt) {
          return false;
        }
        const imageDate = new Date(img.createdAt).toISOString().split('T')[0];
        if (imageDate !== dateFilter) {
          return false;
        }
      }

      if (themeFilter) {
        if (!img.isLocal || !img.tema) {
          return false;
        }
        if (img.tema !== themeFilter) {
          return false;
        }
      }

      return true;
    });
  };

  const imagensLocaisFiltradas = filterLocalImages(localImages);

  return (
    <LayoutDesafio>
      <div className="desafio2-container">
        <h2 className="desafio2-title">Desafio 2 – Galeria de Imagens</h2>
        <p className="desafio2-subtitle">
          Galeria de imagens utilizando APIs reais (Pexels, Unsplash ou Lorem Picsum)
        </p>

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

        <div className="add-image-section">
          <h3 className="section-title">➕ Adicionar Imagem Manualmente</h3>
          
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

        {images.length > 0 && (
          <div className="gallery-section searched-images-section" ref={searchedImagesRef}>
            <div className="gallery-header">
              <h3 className="section-title">
                🔍 Imagens Pesquisadas ({images.length} {images.length === 1 ? 'imagem' : 'imagens'})
              </h3>
            </div>
            
            {loading ? (
              <div className="loading">Carregando imagens...</div>
            ) : (
              <div className="gallery-grid">
                {images.map((image) => {
                  const jaSalva = localImages.some(img => 
                    img.id === image.id || 
                    (img.urls && img.urls.regular === image.urls.regular)
                  );
                  
                  return (
                    <ImageCard 
                      key={image.id} 
                      image={image} 
                      onDelete={null}
                      onSave={!jaSalva ? () => handleSaveImage(image) : null}
                      isSaved={jaSalva}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="gallery-section local-gallery-section" ref={localGalleryRef}>
          <div className="gallery-header">
            <h3 className="section-title">
              💾 Minha Galeria ({imagensLocaisFiltradas.length} {imagensLocaisFiltradas.length === 1 ? 'imagem' : 'imagens'})
            </h3>
            
            {localImages.length > 0 && (
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
            )}
          </div>
          
          {imagensLocaisFiltradas.length === 0 ? (
            <div className="empty-gallery">
              <p>
                {localImages.length === 0 
                  ? 'Nenhuma imagem salva ainda. Adicione imagens usando o formulário acima.'
                  : 'Nenhuma imagem encontrada com os filtros aplicados. Tente remover os filtros.'}
              </p>
            </div>
          ) : (
            <div className="gallery-grid">
              {imagensLocaisFiltradas.map((image) => (
                <ImageCard 
                  key={image.id} 
                  image={image} 
                  onDelete={handleDeleteImage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutDesafio>
  );
};

const ImageCard = ({ image, onDelete, onSave, isSaved }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/desafio2/image/${image.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(image.id);
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave();
    }
  };

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
        {isSaved && !image.isLocal && (
          <span className="saved-badge">Salva</span>
        )}
        <div className="image-actions">
          {onSave && !isSaved && (
            <button
              className="save-image-btn"
              onClick={handleSave}
              title="Salvar na galeria"
            >
              💾
            </button>
          )}
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

        const imageId = id.toString();
        
        if (imageId.startsWith('pexels-') && USE_PEXELS) {
          try {
            const pexelsId = imageId.replace('pexels-', '');
            const response = await fetch(
              `${PEXELS_API_URL}/photos/${pexelsId}`,
              {
                headers: {
                  'Authorization': PEXELS_API_KEY
                }
              }
            );
            
            if (response.ok) {
              const img = await response.json();
              
              const formattedImage = {
                id: img.id,
                urls: {
                  small: img.src.medium,
                  regular: img.src.large,
                  full: img.src.original
                },
                user: {
                  name: img.photographer || 'Fotógrafo Desconhecido',
                  username: img.photographer_id || 'unknown'
                },
                description: img.alt || 'Imagem',
                alt_description: img.alt || 'Imagem',
                tags: []
              };
              
              setImage(formattedImage);
              setLoading(false);
              return;
            }
          } catch (apiError) {
            console.log('Erro ao buscar do Pexels, tentando backend');
          }
        }

        if (imageId.startsWith('unsplash-')) {
          try {
            const unsplashId = imageId.replace('unsplash-', '');
            const response = await fetch(`${BACKEND_API_URL}/api/images/${unsplashId}`);
            
            if (response.ok) {
              const img = await response.json();
              
              const formattedImage = {
                id: img.id,
                urls: {
                  small: img.urls.small || img.urls.regular,
                  regular: img.urls.regular,
                  full: img.urls.full || img.urls.regular
                },
                user: {
                  name: img.user.name,
                  username: img.user.username
                },
                description: img.description || 'Imagem',
                alt_description: img.alt_description || img.description || 'Imagem',
                tags: img.tags || []
              };
              
              setImage(formattedImage);
              setLoading(false);
              return;
            }
          } catch (backendError) {
            console.log('Erro ao buscar do backend, usando fallback');
          }
        }
        
        const picsumId = imageId.replace(/^picsum-/, '').split('-')[0] || '1';
        const formattedImage = {
          id: id,
          urls: {
            small: `https://picsum.photos/id/${picsumId}/400/300`,
            regular: `https://picsum.photos/id/${picsumId}/800/600`,
            full: `https://picsum.photos/id/${picsumId}/1920/1080`
          },
          user: {
            name: 'Fotógrafo',
            username: 'picsum'
          },
          description: 'Imagem',
          alt_description: 'Imagem',
          tags: []
        };
        
        setImage(formattedImage);
      } catch (err) {
        console.error('Erro ao carregar imagem:', err);
        const errorMessage = err.message || err.toString();
        if (errorMessage.includes('Failed to fetch') || 
            errorMessage.includes('NetworkError') || 
            errorMessage.includes('Network request failed') ||
            errorMessage.includes('ERR_INTERNET_DISCONNECTED')) {
          setError('Erro de conexão. Verifique sua internet e tente novamente.');
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
