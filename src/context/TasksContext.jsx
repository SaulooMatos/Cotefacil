import { createContext, useContext, useState, useEffect } from 'react';

const TasksContext = createContext();

const STORAGE_KEY = 'cotefacil_desafio3_tarefas';

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Carregar tarefas do localStorage ao montar
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        if (parsedTasks.length > 0) {
          setTasks(parsedTasks);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage:', error);
    }
  }, []);

  // Salvar tarefas no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
    }
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      status: task.status || 'pendente',
      dataCriacao: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const updateTask = (id, updatedData) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updatedData } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pendente: getTasksByStatus('pendente').length,
      emProgresso: getTasksByStatus('emProgresso').length,
      concluida: getTasksByStatus('concluida').length
    };
  };

  const value = {
    tasks,
    addTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTaskStats
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de TasksProvider');
  }
  return context;
};


