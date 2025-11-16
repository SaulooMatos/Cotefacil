import { useState, useEffect } from 'react';
import LayoutDesafio from '../components/Layout/LayoutDesafio';
import TaskItem from '../components/Todo/TaskItem';
import './Desafio3.css';

const STORAGE_KEY = 'cotefacil_desafio3_tarefas';

const Desafio3 = () => {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [categoria, setCategoria] = useState('');
  const [dataLimite, setDataLimite] = useState('');

  useEffect(() => {
    try {
      const tarefasSalvas = localStorage.getItem(STORAGE_KEY);
      if (tarefasSalvas) {
        const tarefasParseadas = JSON.parse(tarefasSalvas);
        const tarefasComStatus = tarefasParseadas.map(tarefa => {
          let status = tarefa.status || (tarefa.concluida ? 'concluida' : 'pendente');
          if (status === 'standBy') {
            status = 'emProgresso';
          }
          return {
            ...tarefa,
            status: status
          };
        });
        if (tarefasComStatus.length > 0) {
          setTarefas(tarefasComStatus);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const tarefasParaSalvar = JSON.stringify(tarefas);
      localStorage.setItem(STORAGE_KEY, tarefasParaSalvar);
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
      setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
        } catch (retryError) {
          console.error('Erro ao tentar salvar novamente:', retryError);
        }
      }, 100);
    }
  }, [tarefas]);

  const handleAdicionar = (e) => {
    e.preventDefault();
    if (titulo.trim()) {
      const novaTarefa = {
        id: Date.now(),
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        status: 'pendente',
        prioridade: prioridade,
        categoria: categoria.trim(),
        dataLimite: dataLimite || null,
        dataCriacao: new Date().toISOString()
      };
      setTarefas([...tarefas, novaTarefa]);
      setTitulo('');
      setDescricao('');
      setPrioridade('media');
      setCategoria('');
      setDataLimite('');
    }
  };

  const handleEditar = (id, dadosAtualizados) => {
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === id
        ? { ...tarefa, ...dadosAtualizados }
        : tarefa
    ));
  };

  const handleMudarStatus = (id, novoStatus) => {
    setTarefas(tarefas.map(tarefa =>
      tarefa.id === id
        ? { ...tarefa, status: novoStatus }
        : tarefa
    ));
  };

  const handleRemover = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta tarefa?')) {
      setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    }
  };

  const tarefasTotal = tarefas;
  const tarefasConcluidas = tarefas.filter(t => t.status === 'concluida');
  const tarefasPendentes = tarefas.filter(t => t.status === 'pendente');
  const tarefasEmProgresso = tarefas.filter(t => t.status === 'emProgresso');

  return (
    <LayoutDesafio>
      <div className="desafio-container">
        <h2 className="desafio-title">Desafio 3 – Lista de Tarefas</h2>
        
        <div className="desafio-layout">
          <div className="desafio-left">
            <div className="form-card">
              <h3 className="form-card-title">➕ Adicionar Nova Tarefa</h3>
              <form className="todo-form" onSubmit={handleAdicionar}>
                <div className="form-group">
                  <label htmlFor="titulo" className="form-label">
                    Título da Tarefa <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    className="form-input"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descricao" className="form-label">
                    Descrição
                  </label>
                  <textarea
                    id="descricao"
                    className="form-textarea"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Digite uma descrição para a tarefa"
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prioridade" className="form-label">
                      Prioridade
                    </label>
                    <select
                      id="prioridade"
                      className="form-select"
                      value={prioridade}
                      onChange={(e) => setPrioridade(e.target.value)}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="categoria" className="form-label">
                      Categoria
                    </label>
                    <input
                      type="text"
                      id="categoria"
                      className="form-input"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      placeholder="Ex: Trabalho, Pessoal..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="dataLimite" className="form-label">
                    Data Limite
                  </label>
                  <input
                    type="date"
                    id="dataLimite"
                    className="form-input"
                    value={dataLimite}
                    onChange={(e) => setDataLimite(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-add">
                  ➕ Adicionar Tarefa
                </button>
              </form>
            </div>
          </div>

          <div className="desafio-right">
            <div className="status-column">
              <div className="status-header status-total">
                <h3 className="status-title">📋 Total</h3>
                <span className="status-count">{tarefasTotal.length}</span>
              </div>
              <div className="status-list">
                {tarefasTotal.length === 0 ? (
                  <div className="empty-state">
                    <p className="empty-message">📝 Nenhuma tarefa cadastrada</p>
                    <p className="empty-hint">Adicione uma tarefa ao lado para começar!</p>
                  </div>
                ) : (
                  tarefasTotal.map(tarefa => (
                    <TaskItem
                      key={tarefa.id}
                      task={tarefa}
                      onEdit={handleEditar}
                      onDelete={handleRemover}
                      onChangeStatus={handleMudarStatus}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="status-column">
              <div className="status-header status-pendente">
                <h3 className="status-title">⏳ Pendentes</h3>
                <span className="status-count">{tarefasPendentes.length}</span>
              </div>
              <div className="status-list">
                {tarefasPendentes.length === 0 ? (
                  <div className="empty-state-small">
                    <p>Nenhuma tarefa pendente</p>
                  </div>
                ) : (
                  tarefasPendentes.map(tarefa => (
                    <TaskItem
                      key={tarefa.id}
                      task={tarefa}
                      onEdit={handleEditar}
                      onDelete={handleRemover}
                      onChangeStatus={handleMudarStatus}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="status-column">
              <div className="status-header status-em-progresso">
                <h3 className="status-title">🚀 Em Progresso</h3>
                <span className="status-count">{tarefasEmProgresso.length}</span>
              </div>
              <div className="status-list">
                {tarefasEmProgresso.length === 0 ? (
                  <div className="empty-state-small">
                    <p>Nenhuma tarefa em progresso</p>
                  </div>
                ) : (
                  tarefasEmProgresso.map(tarefa => (
                    <TaskItem
                      key={tarefa.id}
                      task={tarefa}
                      onEdit={handleEditar}
                      onDelete={handleRemover}
                      onChangeStatus={handleMudarStatus}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="status-column">
              <div className="status-header status-concluida">
                <h3 className="status-title">✅ Concluídas</h3>
                <span className="status-count">{tarefasConcluidas.length}</span>
              </div>
              <div className="status-list">
                {tarefasConcluidas.length === 0 ? (
                  <div className="empty-state-small">
                    <p>Nenhuma tarefa concluída</p>
                  </div>
                ) : (
                  tarefasConcluidas.map(tarefa => (
                    <TaskItem
                      key={tarefa.id}
                      task={tarefa}
                      onEdit={handleEditar}
                      onDelete={handleRemover}
                      onChangeStatus={handleMudarStatus}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDesafio>
  );
};

export default Desafio3;
