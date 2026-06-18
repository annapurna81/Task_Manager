/*
  pages/Login.js
  ───────────────
  Login form.
  Calls POST /api/auth/login
  On success → saves token → redirects to Dashboard
*/

import React, { useState } from 'react';
import { loginUser } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Student Task Manager</h2>
        <p style={styles.subtitle}>Login to manage your tasks</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="email" placeholder="Email"
            type="email" value={form.email} onChange={handleChange} required />
          <input style={styles.input} name="password" placeholder="Password"
            type="password" value={form.password} onChange={handleChange} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          No account?{' '}
          <span style={styles.switchLink} onClick={onSwitch}>Register here</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container:  { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f4f8' },
  card:       { background:'white', padding:'2rem', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'360px' },
  title:      { textAlign:'center', marginBottom:'0.3rem', color:'#1a237e' },
  subtitle:   { textAlign:'center', marginBottom:'1.5rem', color:'#888', fontSize:'14px' },
  input:      { width:'100%', padding:'10px 14px', marginBottom:'12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', boxSizing:'border-box' },
  btn:        { width:'100%', padding:'12px', background:'#1565c0', color:'white', border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer', fontWeight:'bold' },
  error:      { background:'#ffebee', color:'#c62828', padding:'10px', borderRadius:'6px', marginBottom:'12px', fontSize:'14px' },
  link:       { textAlign:'center', marginTop:'1rem', fontSize:'14px', color:'#666' },
  switchLink: { color:'#1565c0', cursor:'pointer', fontWeight:'bold' },
};
