import { useState, useEffect } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete, onChangeStatus }) => {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.titulo);
  const [editDescricao, setEditDescricao] = useState(task.descricao || '');
  const [editPrioridade, setEditPrioridade] = useState(task.prioridade || 'media');
  const [editCategoria, setEditCategoria] = useState(task.categoria || '');
  const [editDataLimite, setEditDataLimite] = useState(formatDateForInput(task.dataLimite));

  useEffect(() => {
    setEditTitle(task.titulo);
    setEditDescricao(task.descricao || '');
    setEditPrioridade(task.prioridade || 'media');
    setEditCategoria(task.categoria || '');
    setEditDataLimite(formatDateForInput(task.dataLimite));
  }, [task]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(task.id, {
        titulo: editTitle.trim(),
        descricao: editDescricao.trim(),
        prioridade: editPrioridade,
        categoria: editCategoria.trim(),
        dataLimite: editDataLimite || null
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.titulo);
    setEditDescricao(task.descricao || '');
    setEditPrioridade(task.prioridade || 'media');
    setEditCategoria(task.categoria || '');
    setEditDataLimite(formatDateForInput(task.dataLimite));
    setIsEditing(false);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'pendente': 'Pendente',
      'concluida': 'Concluída',
      'emProgresso': 'Em Progresso'
    };
    return statusMap[status] || 'Pendente';
  };

  const getPrioridadeLabel = (prioridade) => {
    const prioridadeMap = {
      'baixa': 'Baixa',
      'media': 'Média',
      'alta': 'Alta'
    };
    return prioridadeMap[prioridade] || 'Média';
  };

  const getPrioridadeClass = (prioridade) => {
    const classMap = {
      'baixa': 'prioridade-baixa',
      'media': 'prioridade-media',
      'alta': 'prioridade-alta'
    };
    return classMap[prioridade] || 'prioridade-media';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isDataLimitePassada = (dataLimite) => {
    if (!dataLimite) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limite = new Date(dataLimite);
    limite.setHours(0, 0, 0, 0);
    return limite < hoje && task.status !== 'concluida';
  };

  if (isEditing) {
    return (
      <div className="task-item task-item-editing">
        <div className="task-edit-form">
          <input
            type="text"
            className="task-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Título da tarefa"
            autoFocus
          />
          <textarea
            className="task-edit-textarea"
            value={editDescricao}
            onChange={(e) => setEditDescricao(e.target.value)}
            placeholder="Descrição (opcional)"
            rows="3"
          />
          <div className="task-edit-row">
            <select
              className="task-edit-select"
              value={editPrioridade}
              onChange={(e) => setEditPrioridade(e.target.value)}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            <input
              type="text"
              className="task-edit-input-small"
              value={editCategoria}
              onChange={(e) => setEditCategoria(e.target.value)}
              placeholder="Categoria"
            />
          </div>
          <input
            type="date"
            className="task-edit-input"
            value={editDataLimite}
            onChange={(e) => setEditDataLimite(e.target.value)}
          />
          <div className="task-edit-actions">
            <button className="btn-save" onClick={handleSave}>
              Salvar
            </button>
            <button className="btn-cancel" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = task.status || (task.concluida ? 'concluida' : 'pendente');

  return (
    <div className={`task-item task-item-${status}`}>
      <div className="task-content">
        <div className="task-info">
          <div className="task-header">
            <h3 className="task-title">{task.titulo}</h3>
            <div className={`prioridade-badge ${getPrioridadeClass(task.prioridade || 'media')}`}>
              {getPrioridadeLabel(task.prioridade || 'media')}
            </div>
          </div>
          {task.descricao && (
            <p className="task-description">{task.descricao}</p>
          )}
          <div className="task-meta">
            {task.categoria && (
              <span className="task-categoria">
                📁 {task.categoria}
              </span>
            )}
            {task.dataLimite && (
              <span className={`task-data-limite ${isDataLimitePassada(task.dataLimite) ? 'data-vencida' : ''}`}>
                📅 {formatDate(task.dataLimite)}
                {isDataLimitePassada(task.dataLimite) && ' ⚠️'}
              </span>
            )}
          </div>
          <div className="task-status-selector">
            <label className="task-status-label">Status:</label>
            <select
              className="task-status-select"
              value={status}
              onChange={(e) => onChangeStatus(task.id, e.target.value)}
            >
              <option value="pendente">⏳ Pendente</option>
              <option value="concluida">✅ Concluída</option>
              <option value="emProgresso">🚀 Em Progresso</option>
            </select>
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => setIsEditing(true)} title="Editar">
          ✏️
        </button>
        <button className="btn-delete" onClick={() => onDelete(task.id)} title="Excluir">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

