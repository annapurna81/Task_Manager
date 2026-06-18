import React, { useState } from 'react';

export default function AddTaskForm({ onAdd }) {
  const [form, setForm]     = useState({ title: '', description: '', status: 'todo', dueDate: '' });
  const [open, setOpen]     = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setError('');
    setLoading(true);
    try {
      await onAdd({ ...form, dueDate: form.dueDate || null });
      setForm({ title: '', description: '', status: 'todo', dueDate: '' });
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button style={styles.addBtn} onClick={() => setOpen(true)}>
        + Add New Task
      </button>
    );
  }

  return (
    <div style={styles.form}>
      <h3 style={styles.heading}>New Task</h3>
      {error && <p style={styles.error}>{error}</p>}
      <input  style={styles.input} name="title"       placeholder="Task title *"
        value={form.title}       onChange={handleChange} required />
      <textarea style={styles.textarea} name="description" placeholder="Description (optional)"
        value={form.description} onChange={handleChange} rows={3} />
      <select style={styles.input} name="status" value={form.status} onChange={handleChange}>
        <option value="todo">📋 To Do</option>
        <option value="inprogress">🔄 In Progress</option>
        <option value="done">✅ Done</option>
      </select>
      <input  style={styles.input} name="dueDate" type="date"
        value={form.dueDate} onChange={handleChange} />
      <div style={styles.btns}>
        <button style={styles.saveBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
        <button style={styles.cancelBtn} onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

const styles = {
  addBtn:    { padding:'10px 20px', background:'#1565c0', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'14px', marginBottom:'20px' },
  form:      { background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', marginBottom:'20px' },
  heading:   { margin:'0 0 14px 0', color:'#1a237e' },
  input:     { width:'100%', padding:'10px 14px', marginBottom:'10px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box' },
  textarea:  { width:'100%', padding:'10px 14px', marginBottom:'10px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box', resize:'vertical' },
  btns:      { display:'flex', gap:'10px' },
  saveBtn:   { padding:'10px 20px', background:'#1565c0', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' },
  cancelBtn: { padding:'10px 20px', background:'#eee', color:'#333', border:'none', borderRadius:'8px', cursor:'pointer' },
  error:     { background:'#ffebee', color:'#c62828', padding:'8px', borderRadius:'6px', marginBottom:'10px', fontSize:'13px' },
};
