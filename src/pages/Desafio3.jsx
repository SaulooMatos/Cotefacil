import { useState } from 'react';
import LayoutDesafio from '../components/Layout/LayoutDesafio';
import { useTasks } from '../context/TasksContext';
import './Desafio3.css';

const Desafio3 = () => {
  const { tasks, addTask, updateTaskStatus, deleteTask, getTaskStats } = useTasks();
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    categoria: ''
  });

  const stats = getTaskStats();

  const handleAddTask = (e) => {
    e.preventDefault();
    if (formData.titulo.trim()) {
      addTask({
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        prioridade: formData.prioridade,
        categoria: formData.categoria.trim()
      });
      setFormData({ titulo: '', descricao: '', prioridade: 'media', categoria: '' });
      setShowForm(false);
    }
  };

  const filteredTasks = filterStatus === 'todos' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  return (
    <LayoutDesafio>
      <div className="desafio3-container">
        <h2 className="desafio3-title">Desafio 3 – Dashboard de Tarefas</h2>
        <p className="desafio3-subtitle">
          Dashboard com gerenciamento de estado global usando Context API
        </p>

        {/* Cards de Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.total}</h3>
              <p className="stat-label">Total de Tarefas</p>
            </div>
          </div>

          <div className="stat-card stat-pendente">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.pendente}</h3>
              <p className="stat-label">Pendentes</p>
            </div>
          </div>

          <div className="stat-card stat-progresso">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.emProgresso}</h3>
              <p className="stat-label">Em Progresso</p>
            </div>
          </div>

          <div className="stat-card stat-concluida">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.concluida}</h3>
              <p className="stat-label">Concluídas</p>
            </div>
          </div>
        </div>

        {/* Gráfico de Distribuição */}
        <div className="chart-section">
          <h3 className="section-title">📊 Distribuição de Tarefas</h3>
          <div className="chart-container">
            <BarChart stats={stats} />
          </div>
        </div>

        {/* Filtros e Formulário */}
        <div className="controls-section">
          <div className="filters">
            <h3 className="section-title">🔍 Filtros</h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'todos' ? 'active' : ''}`}
                onClick={() => setFilterStatus('todos')}
              >
                Todos ({stats.total})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'pendente' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pendente')}
              >
                Pendentes ({stats.pendente})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'emProgresso' ? 'active' : ''}`}
                onClick={() => setFilterStatus('emProgresso')}
              >
                Em Progresso ({stats.emProgresso})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'concluida' ? 'active' : ''}`}
                onClick={() => setFilterStatus('concluida')}
              >
                Concluídas ({stats.concluida})
              </button>
            </div>
          </div>

          <div className="add-task-section">
            <button
              className="toggle-form-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? '✖️ Cancelar' : '➕ Adicionar Nova Tarefa'}
            </button>

            {showForm && (
              <form className="task-form" onSubmit={handleAddTask}>
                <div className="form-group">
                  <label htmlFor="titulo" className="form-label">
                    Título <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    className="form-input"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Digite o título da tarefa"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descricao" className="form-label">Descrição</label>
                  <textarea
                    id="descricao"
                    className="form-textarea"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Digite uma descrição"
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="prioridade" className="form-label">Prioridade</label>
                    <select
                      id="prioridade"
                      className="form-select"
                      value={formData.prioridade}
                      onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="categoria" className="form-label">Categoria</label>
                    <input
                      type="text"
                      id="categoria"
                      className="form-input"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      placeholder="Ex: Trabalho, Pessoal..."
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  ➕ Adicionar Tarefa
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="tasks-section">
          <h3 className="section-title">
            📝 Tarefas {filterStatus !== 'todos' && `(${filterStatus})`}
          </h3>

          {filteredTasks.length === 0 ? (
            <div className="empty-tasks">
              <p>Nenhuma tarefa encontrada. Adicione uma nova tarefa para começar!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={updateTaskStatus}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutDesafio>
  );
};

// Componente de Card de Tarefa
const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return '#ffc107';
      case 'emProgresso':
        return '#8b5cf6';
      case 'concluida':
        return '#32cd32';
      default:
        return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendente':
        return '⏳ Pendente';
      case 'emProgresso':
        return '🔄 Em Progresso';
      case 'concluida':
        return '✅ Concluída';
      default:
        return status;
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'alta':
        return '#dc3545';
      case 'media':
        return '#ffc107';
      case 'baixa':
        return '#32cd32';
      default:
        return '#6c757d';
    }
  };

  const handleStatusChange = (e) => {
    onStatusChange(task.id, e.target.value);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja remover esta tarefa?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="task-card" style={{ borderLeftColor: getStatusColor(task.status) }}>
      <div className="task-header">
        <h4 className="task-title">{task.titulo}</h4>
        <div className="task-actions">
          <select
            className="status-select"
            value={task.status}
            onChange={handleStatusChange}
            style={{ borderColor: getStatusColor(task.status) }}
          >
            <option value="pendente">⏳ Pendente</option>
            <option value="emProgresso">🔄 Em Progresso</option>
            <option value="concluida">✅ Concluída</option>
          </select>
          <button className="delete-btn" onClick={handleDelete}>
            🗑️
          </button>
        </div>
      </div>

      {task.descricao && (
        <p className="task-description">{task.descricao}</p>
      )}

      <div className="task-footer">
        <div className="task-meta">
          {task.categoria && (
            <span className="task-category">📁 {task.categoria}</span>
          )}
          <span
            className="task-priority"
            style={{ color: getPriorityColor(task.prioridade) }}
          >
            ⚡ {task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1)}
          </span>
        </div>
        <span className="task-status-badge" style={{ backgroundColor: getStatusColor(task.status) }}>
          {getStatusLabel(task.status)}
        </span>
      </div>
    </div>
  );
};

// Componente de Gráfico de Barras
const BarChart = ({ stats }) => {
  const maxValue = Math.max(stats.total, 1);
  
  const bars = [
    { label: 'Pendentes', value: stats.pendente, color: '#ffc107' },
    { label: 'Em Progresso', value: stats.emProgresso, color: '#8b5cf6' },
    { label: 'Concluídas', value: stats.concluida, color: '#32cd32' }
  ];

  return (
    <div className="bar-chart">
      {bars.map((bar, index) => (
        <div key={index} className="bar-item">
          <div className="bar-label">{bar.label}</div>
          <div className="bar-container">
            <div
              className="bar-fill"
              style={{
                width: `${(bar.value / maxValue) * 100}%`,
                backgroundColor: bar.color
              }}
            >
              <span className="bar-value">{bar.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Desafio3;
