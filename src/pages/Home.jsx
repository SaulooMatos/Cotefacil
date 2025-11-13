import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-background"></div>
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">
            <span className="title-main">Grande Desafio Técnico</span>
            <span className="title-company">Cotefácil</span>
          </h1>
          <div className="home-divider"></div>
          <p className="home-subtitle">
            Desenvolvido por: <span className="author-name">Saulo Henrique de Oliveira Matos</span>
          </p>
        </div>
        
        <div className="home-buttons">
          <Link to="/desafio1" className="btn-desafio btn-desafio-1">
            <span className="btn-icon">✓</span>
            <span className="btn-content">
              <span className="btn-title">Desafio 1</span>
              <span className="btn-subtitle">To-Do List</span>
            </span>
            <span className="btn-arrow">→</span>
          </Link>
          <Link to="/desafio2" className="btn-desafio btn-desafio-2">
            <span className="btn-icon">🖼️</span>
            <span className="btn-content">
              <span className="btn-title">Desafio 2</span>
              <span className="btn-subtitle">Galeria de Imagens</span>
            </span>
            <span className="btn-arrow">→</span>
          </Link>
          <Link to="/desafio3" className="btn-desafio btn-desafio-3">
            <span className="btn-icon">📊</span>
            <span className="btn-content">
              <span className="btn-title">Desafio 3</span>
              <span className="btn-subtitle">Dashboard de Tarefas</span>
            </span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

