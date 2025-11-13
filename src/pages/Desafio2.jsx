import LayoutDesafio from '../components/Layout/LayoutDesafio';
import './Desafio.css';

const Desafio2 = () => {
  return (
    <LayoutDesafio>
      <div className="desafio-container">
        <div className="card">
          <h2 className="desafio-title">Desafio 2 – Galeria de Imagens</h2>
          <p className="desafio-subtitle">Galeria de imagens da Unsplash</p>
          <p className="desafio-content">
            Esta página será implementada com a funcionalidade completa de galeria de imagens,
            utilizando o backend como proxy para a API da Unsplash.
          </p>
        </div>
      </div>
    </LayoutDesafio>
  );
};

export default Desafio2;

