import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchTasks = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/tasks?${params}`);
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/tasks/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const createTask = async (taskData) => {
    const response = await api.post('/api/tasks', taskData);
    setTasks([response.data.data, ...tasks]);
    fetchStats();
    return response.data.data;
  };

  const updateTask = async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData);
    setTasks(tasks.map(task => task._id === id ? response.data.data : task));
    fetchStats();
    return response.data.data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
    fetchStats();
  };

  const toggleComplete = async (id) => {
    const response = await api.patch(`/api/tasks/${id}/toggle`);
    setTasks(tasks.map(task => task._id === id ? response.data.data : task));
    fetchStats();
    return response.data.data;
  };

  const getTaskBreakdown = async (text) => {
    const response = await api.post('/api/tasks/breakdown', { text });
    return response.data.data;
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const value = {
    tasks,
    loading,
    stats,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getTaskBreakdown
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};