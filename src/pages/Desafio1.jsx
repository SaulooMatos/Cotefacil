import LayoutDesafio from '../components/Layout/LayoutDesafio';
import './Desafio.css';

const Desafio1 = () => {
  return (
    <LayoutDesafio>
      <div className="desafio-container">
        <div className="card">
          <h2 className="desafio-title">Desafio 1 – To-Do List</h2>
          <p className="desafio-subtitle">Aplicação de lista de tarefas</p>
          <p className="desafio-content">
            Esta página será implementada com a funcionalidade completa de To-Do List.
          </p>
        </div>
      </div>
    </LayoutDesafio>
  );
};

export default Desafio1;

