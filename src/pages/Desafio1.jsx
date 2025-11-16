import { useState, useEffect } from 'react';
import LayoutDesafio from '../components/Layout/LayoutDesafio';
import './Desafio1.css';

const STORAGE_KEY = 'cotefacil_desafio1_tarefas';

const Desafio1 = () => {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState('');

  useEffect(() => {
    try {
      const tarefasSalvas = localStorage.getItem(STORAGE_KEY);
      let tarefasExistentes = [];
      
      if (tarefasSalvas) {
        tarefasExistentes = JSON.parse(tarefasSalvas);
      }

      const tarefasExemplo = [
        {
          id: 1,
          texto: 'Estudar React e hooks',
          concluida: false,
          dataCriacao: new Date().toISOString(),
          dataConclusao: null
        },
        {
          id: 2,
          texto: 'Ler um capítulo do livro',
          concluida: true,
          dataCriacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          dataConclusao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      const tarefa1Existe = tarefasExistentes.some(t => t.id === 1);
      const tarefa2Existe = tarefasExistentes.some(t => t.id === 2);

      const tarefasFinais = [...tarefasExistentes];
      
      if (!tarefa1Existe) {
        tarefasFinais.push(tarefasExemplo[0]);
      }
      
      if (!tarefa2Existe) {
        tarefasFinais.push(tarefasExemplo[1]);
      }

      tarefasFinais.sort((a, b) => {
        if (a.id === 1 || a.id === 2) {
          if (b.id === 1 || b.id === 2) {
            return a.id - b.id;
          }
          return -1;
        }
        if (b.id === 1 || b.id === 2) {
          return 1;
        }
        return b.id - a.id;
      });

      setTarefas(tarefasFinais);
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
    }
  }, [tarefas]);

  const handleAdicionar = (e) => {
    e.preventDefault();
    if (novaTarefa.trim()) {
      const tarefa = {
        id: Date.now(),
        texto: novaTarefa.trim(),
        concluida: false,
        dataCriacao: new Date().toISOString(),
        dataConclusao: null
      };
      setTarefas([...tarefas, tarefa]);
      setNovaTarefa('');
    }
  };

  const handleToggleConcluida = (id) => {
    setTarefas(tarefas.map(tarefa => {
      if (tarefa.id === id) {
        const novaConcluida = !tarefa.concluida;
        return {
          ...tarefa,
          concluida: novaConcluida,
          dataConclusao: novaConcluida ? new Date().toISOString() : null
        };
      }
      return tarefa;
    }));
  };

  const handleIniciarEdicao = (tarefa) => {
    setTarefaEditando(tarefa.id);
    setTextoEditando(tarefa.texto);
  };

  const handleSalvarEdicao = (id) => {
    if (textoEditando.trim()) {
      setTarefas(tarefas.map(tarefa =>
        tarefa.id === id
          ? { ...tarefa, texto: textoEditando.trim() }
          : tarefa
      ));
      setTarefaEditando(null);
      setTextoEditando('');
    }
  };

  const handleCancelarEdicao = () => {
    setTarefaEditando(null);
    setTextoEditando('');
  };

  const handleRemover = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta tarefa?')) {
      setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    }
  };

  const tarefasPendentes = tarefas.filter(t => !t.concluida);
  const tarefasConcluidas = tarefas.filter(t => t.concluida);

  return (
    <LayoutDesafio>
      <div className="desafio1-container">
        <h2 className="desafio1-title">Desafio 1 – Lista de Tarefas</h2>
        <p className="desafio1-subtitle">
          Gerencie suas tarefas de forma simples e eficiente
        </p>

        <div className="todo-form-container">
          <form className="todo-form" onSubmit={handleAdicionar}>
            <input
              type="text"
              className="todo-input"
              placeholder="Digite uma nova tarefa..."
              value={novaTarefa}
              onChange={(e) => setNovaTarefa(e.target.value)}
              required
            />
            <button type="submit" className="btn-add-task">
              ➕ Adicionar
            </button>
          </form>
        </div>

        {tarefas.length > 0 && (
          <div className="todo-stats">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{tarefas.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pendentes:</span>
              <span className="stat-value stat-pendente">{tarefasPendentes.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Concluídas:</span>
              <span className="stat-value stat-concluida">{tarefasConcluidas.length}</span>
            </div>
          </div>
        )}

        <div className="todo-list-container">
          {tarefas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-message">Nenhuma tarefa cadastrada</p>
              <p className="empty-hint">Adicione uma tarefa acima para começar!</p>
            </div>
          ) : (
            <div className="todo-list">
              {tarefasPendentes.length > 0 && (
                <div className="todo-section">
                  <h3 className="section-title">⏳ Pendentes ({tarefasPendentes.length})</h3>
                  <div className="tasks-group">
                    {tarefasPendentes.map(tarefa => (
                      <TodoItem
                        key={tarefa.id}
                        tarefa={tarefa}
                        isEditing={tarefaEditando === tarefa.id}
                        textoEditando={textoEditando}
                        onToggleConcluida={() => handleToggleConcluida(tarefa.id)}
                        onIniciarEdicao={() => handleIniciarEdicao(tarefa)}
                        onSalvarEdicao={() => handleSalvarEdicao(tarefa.id)}
                        onCancelarEdicao={handleCancelarEdicao}
                        onRemover={() => handleRemover(tarefa.id)}
                        onTextoEditandoChange={setTextoEditando}
                      />
                    ))}
                  </div>
                </div>
              )}

              {tarefasConcluidas.length > 0 && (
                <div className="todo-section">
                  <h3 className="section-title">✅ Concluídas ({tarefasConcluidas.length})</h3>
                  <div className="tasks-group">
                    {tarefasConcluidas.map(tarefa => (
                      <TodoItem
                        key={tarefa.id}
                        tarefa={tarefa}
                        isEditing={tarefaEditando === tarefa.id}
                        textoEditando={textoEditando}
                        onToggleConcluida={() => handleToggleConcluida(tarefa.id)}
                        onIniciarEdicao={() => handleIniciarEdicao(tarefa)}
                        onSalvarEdicao={() => handleSalvarEdicao(tarefa.id)}
                        onCancelarEdicao={handleCancelarEdicao}
                        onRemover={() => handleRemover(tarefa.id)}
                        onTextoEditandoChange={setTextoEditando}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </LayoutDesafio>
  );
};

const TodoItem = ({
  tarefa,
  isEditing,
  textoEditando,
  onToggleConcluida,
  onIniciarEdicao,
  onSalvarEdicao,
  onCancelarEdicao,
  onRemover,
  onTextoEditandoChange
}) => {
  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isEditing) {
    return (
      <div className="todo-item todo-item-editing">
        <input
          type="text"
          className="todo-edit-input"
          value={textoEditando}
          onChange={(e) => onTextoEditandoChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSalvarEdicao();
            } else if (e.key === 'Escape') {
              onCancelarEdicao();
            }
          }}
          autoFocus
        />
        <div className="todo-edit-actions">
          <button
            className="btn-save"
            onClick={onSalvarEdicao}
            title="Salvar (Enter)"
          >
            ✓
          </button>
          <button
            className="btn-cancel"
            onClick={onCancelarEdicao}
            title="Cancelar (Esc)"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${tarefa.concluida ? 'todo-item-concluida' : ''}`}>
      <div className="todo-item-content">
        <label className="todo-checkbox-wrapper">
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={tarefa.concluida}
            onChange={onToggleConcluida}
          />
          <span className="todo-checkbox-custom"></span>
        </label>
        <div className="todo-text-wrapper">
          <span className="todo-text">{tarefa.texto}</span>
          <div className="todo-dates">
            <span className="todo-date-item">
              📅 Criada em: {formatarData(tarefa.dataCriacao)}
            </span>
            {tarefa.concluida && tarefa.dataConclusao && (
              <span className="todo-date-item todo-date-conclusao">
                ✅ Concluída em: {formatarData(tarefa.dataConclusao)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="todo-actions">
        <button
          className="btn-edit"
          onClick={onIniciarEdicao}
          title="Editar tarefa"
        >
          ✏️
        </button>
        <button
          className="btn-delete"
          onClick={onRemover}
          title="Excluir tarefa"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Desafio1;
