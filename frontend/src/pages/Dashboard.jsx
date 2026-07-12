import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Plus, Trash2, Edit2 } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium' });

  const getApiUrl = (path) => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(getApiUrl('/tasks'), {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(getApiUrl('/tasks'), formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setShowModal(false);
      setFormData({ title: '', description: '', status: 'To Do', priority: 'Medium' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(getApiUrl(`/tasks/${id}`), {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(getApiUrl(`/tasks/${id}`), { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">TaskFlow</div>
        <div className="nav-links">
          <span style={{ fontWeight: 500 }}>{user.name}</span>
          <button onClick={logout} className="btn btn-secondary" style={{ padding: '6px 12px' }}>
            <LogOut size={16} style={{ marginRight: '6px' }}/> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-grid">
        <aside className="sidebar">
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ width: '100%', marginBottom: '20px' }}>
            <Plus size={18} style={{ marginRight: '6px' }}/> New Task
          </button>
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>Filters</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 500 }}>All Tasks</li>
              <li style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Assigned to me</li>
              <li style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Created by me</li>
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>My Tasks</h1>
            <span style={{ color: 'var(--text-secondary)' }}>{tasks.length} tasks</span>
          </div>

          <div className="task-list">
            {tasks.map(task => (
              <div key={task._id} className="glass-panel task-card">
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </div>
                </div>
                <p className="task-desc">{task.description}</p>
                
                <div style={{ marginTop: '10px' }}>
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', outline: 'none' }}
                  >
                    <option value="To Do" style={{ color: '#000' }}>To Do</option>
                    <option value="In Progress" style={{ color: '#000' }}>In Progress</option>
                    <option value="Completed" style={{ color: '#000' }}>Completed</option>
                  </select>
                </div>

                <div className="task-footer">
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleDeleteTask(task._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '20px' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
