import React, { useEffect, useState, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/api';
import { useAuth } from '../context/AuthContext';
import TaskCard    from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';

const COLUMNS = [
  { key: 'todo',       label: '📋 To Do'       },
  { key: 'inprogress', label: '🔄 In Progress'  },
  { key: 'done',       label: '✅ Done'         },
];

export default function Dashboard() {
  const { user, logout }    = useAuth();
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  // ── Load tasks ──────────────────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchTasks();
      setTasks(res.data.tasks);
    } catch (err) {
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // ── Add task ──────────────────────────────────────────────────────────────
  async function handleAdd(data) {
    const res = await createTask(data);
    setTasks(prev => [res.data.task, ...prev]);
  }

  // ── Update task (change status etc.) ─────────────────────────────────────
  async function handleUpdate(id, data) {
    const res = await updateTask(id, data);
    setTasks(prev => prev.map(t => t._id === id ? res.data.task : t));
  }

  // ── Delete task ───────────────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  }

  // ── Filter tasks by column ────────────────────────────────────────────────
  function tasksByStatus(status) {
    return tasks.filter(t => t.status === status);
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📚 Task Manager</h1>
          <p style={styles.welcome}>Welcome, {user?.name}!</p>
        </div>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      {/* Add task form */}
      <div style={styles.main}>
        <AddTaskForm onAdd={handleAdd} />

        {/* Error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Task summary */}
        <div style={styles.summary}>
          <span style={styles.summaryItem}>Total: {tasks.length}</span>
          <span style={styles.summaryItem}>To Do: {tasksByStatus('todo').length}</span>
          <span style={styles.summaryItem}>In Progress: {tasksByStatus('inprogress').length}</span>
          <span style={styles.summaryItem}>Done: {tasksByStatus('done').length}</span>
        </div>

        {/* Kanban columns */}
        {loading ? (
          <p style={styles.loadingText}>Loading tasks...</p>
        ) : (
          <div style={styles.board}>
            {COLUMNS.map(col => (
              <div key={col.key} style={styles.column}>
                <div style={styles.colHeader}>
                  <span style={styles.colTitle}>{col.label}</span>
                  <span style={styles.colCount}>{tasksByStatus(col.key).length}</span>
                </div>
                {tasksByStatus(col.key).length === 0 ? (
                  <p style={styles.emptyCol}>No tasks here</p>
                ) : (
                  tasksByStatus(col.key).map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page:        { minHeight:'100vh', background:'#f0f4f8', fontFamily:'Arial, sans-serif' },
  header:      { background:'#1a237e', color:'white', padding:'16px 32px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  title:       { margin:0, fontSize:'22px' },
  welcome:     { margin:'4px 0 0 0', fontSize:'14px', opacity:0.8 },
  logoutBtn:   { padding:'8px 18px', background:'rgba(255,255,255,0.2)', color:'white', border:'1px solid rgba(255,255,255,0.4)', borderRadius:'8px', cursor:'pointer', fontSize:'14px' },
  main:        { maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' },
  summary:     { display:'flex', gap:'16px', marginBottom:'20px', flexWrap:'wrap' },
  summaryItem: { background:'white', padding:'8px 16px', borderRadius:'8px', fontSize:'13px', fontWeight:'bold', color:'#1a237e', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' },
  board:       { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' },
  column:      { background:'#e8edf4', borderRadius:'12px', padding:'14px', minHeight:'200px' },
  colHeader:   { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' },
  colTitle:    { fontWeight:'bold', fontSize:'15px', color:'#1a237e' },
  colCount:    { background:'#1565c0', color:'white', borderRadius:'50%', width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'bold' },
  emptyCol:    { color:'#aaa', fontSize:'13px', textAlign:'center', marginTop:'20px' },
  error:       { background:'#ffebee', color:'#c62828', padding:'10px', borderRadius:'8px', marginBottom:'16px' },
  loadingText: { textAlign:'center', color:'#888', marginTop:'40px' },
};
