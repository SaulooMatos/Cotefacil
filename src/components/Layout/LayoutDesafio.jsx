import { Link, useLocation } from 'react-router-dom';
import './LayoutDesafio.css';

const LayoutDesafio = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout-desafio">
      <header className="header-fixo">
        <div className="header-container">
          <Link to="/" className="btn-header btn-voltar">
            ← Voltar
          </Link>
          <Link 
            to="/desafio1" 
            className={`btn-header ${location.pathname === '/desafio1' ? 'active' : ''}`}
          >
            Desafio 1 - To-Do List
          </Link>
          <Link 
            to="/desafio2" 
            className={`btn-header ${location.pathname === '/desafio2' ? 'active' : ''}`}
          >
            Desafio 2 - Galeria de Imagens
          </Link>
          <Link 
            to="/desafio3" 
            className={`btn-header ${location.pathname === '/desafio3' ? 'active' : ''}`}
          >
            Desafio 3 - Dashboard de Tarefas
          </Link>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default LayoutDesafio;

