import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LayoutDesafio.css';

const LayoutDesafio = ({ children }) => {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <div className={`layout-desafio ${menuAberto ? 'menu-aberto' : ''}`}>
      {/* Overlay escuro quando menu mobile está aberto */}
      {menuAberto && (
        <div 
          className="menu-overlay"
          onClick={fecharMenu}
          aria-label="Fechar menu"
        />
      )}
      
      <header className="header-fixo">
        <div className="header-container">
          <Link to="/" className="btn-header btn-voltar" onClick={fecharMenu}>
            ← Voltar
          </Link>
          
          {/* Menu Desktop - sempre visível */}
          <nav className="nav-desktop">
            <Link 
              to="/desafio1" 
              className={`btn-header ${location.pathname === '/desafio1' ? 'active' : ''}`}
              onClick={fecharMenu}
            >
              Desafio 1 - To-Do List
            </Link>
            <Link 
              to="/desafio2" 
              className={`btn-header ${location.pathname === '/desafio2' ? 'active' : ''}`}
              onClick={fecharMenu}
            >
              Desafio 2 - Galeria de Imagens
            </Link>
            <Link 
              to="/desafio3" 
              className={`btn-header ${location.pathname === '/desafio3' ? 'active' : ''}`}
              onClick={fecharMenu}
            >
              Desafio 3 - Dashboard de Tarefas
            </Link>
          </nav>

          {/* Botão Hambúrguer Mobile */}
          <button 
            className={`menu-hamburguer ${menuAberto ? 'ativo' : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span className="hamburguer-line"></span>
            <span className="hamburguer-line"></span>
            <span className="hamburguer-line"></span>
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        <nav className={`nav-mobile ${menuAberto ? 'aberto' : ''}`}>
          <div className="nav-mobile-content">
            <Link 
              to="/desafio1" 
              className={`nav-mobile-link ${location.pathname === '/desafio1' ? 'active' : ''}`}
              onClick={fecharMenu}
            >
              <span className="nav-icon">✓</span>
              <div className="nav-text-wrapper">
                <span className="nav-title">Desafio 1</span>
                <span className="nav-subtitle">To-Do List</span>
              </div>
            </Link>
            <Link 
              to="/desafio2" 
              className={`nav-mobile-link ${location.pathname === '/desafio2' ? 'active' : ''}`}
              onClick={fecharMenu}
            >
              <span className="nav-icon">🖼️</span>
              <div className="nav-text-wrapper">
                <span className="nav-title">Desafio 2</span>
                <span className="nav-subtitle">Galeria de Imagens</span>
              </div>
            </Link>
            <Link 
              to="/desafio3" 
              className={`nav-mobile-link ${location.pathname === '/desafio3' ? 'active' : ''}`}
              onClick={fecharMenu}
            >
              <span className="nav-icon">📊</span>
              <div className="nav-text-wrapper">
                <span className="nav-title">Desafio 3</span>
                <span className="nav-subtitle">Dashboard de Tarefas</span>
              </div>
            </Link>
          </div>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default LayoutDesafio;

