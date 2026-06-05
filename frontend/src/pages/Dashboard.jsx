import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();  // removed logout here
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 6 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const { data } = await API.get('/tasks', { params });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await API.post('/tasks', form);
      setForm({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/tasks/${editTask._id}`, editTask);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/tasks/${id}/toggle`);
      fetchTasks();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const stats = {
    total: pagination.total || 0,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  return (
    <div className="dashboard">

      {/* ✅ Navbar component replaces old inline <nav> */}
      <Navbar />

      <div className="dashboard-body">
        {error && <div className="alert alert-error">{error}</div>}

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat">Total: <strong>{stats.total}</strong></div>
          <div className="stat">Completed: <strong>{stats.completed}</strong></div>
          <div className="stat">Pending: <strong>{stats.pending}</strong></div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="add-form">
          <input
            type="text"
            placeholder="Task title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" className="btn-primary">Add Task</button>
        </form>

        {/* Search & Filter */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Edit Modal */}
        {editTask && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Task</h3>
              <input
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              />
              <input
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              />
              <select
                value={editTask.status}
                onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <div className="modal-actions">
                <button onClick={handleUpdate} className="btn-primary">Save</button>
                <button onClick={() => setEditTask(null)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Task Grid */}
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty">No tasks found. Add your first task above!</div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => setEditTask({ ...task })}
                onDelete={() => handleDelete(task._id)}
                onToggle={() => handleToggle(task._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
            <span>Page {page} of {pagination.pages}</span>
            <button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}