import axios from 'axios';

// ── Auth token helper ────────────────────────────────────────────────────────
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Auth APIs ────────────────────────────────────────────────────────────────
export const registerUser = (data) =>
  axios.post('/api/auth/register', data);

export const loginUser = (data) =>
  axios.post('/api/auth/login', data);

// ── Task APIs ─────────────────────────────────────────────────────────────────
export const fetchTasks = (status = '') =>
  axios.get(`/api/tasks${status ? `?status=${status}` : ''}`, {
    headers: getAuthHeader(),
  });

export const createTask = (data) =>
  axios.post('/api/tasks', data, { headers: getAuthHeader() });

export const updateTask = (id, data) =>
  axios.put(`/api/tasks/${id}`, data, { headers: getAuthHeader() });

export const deleteTask = (id) =>
  axios.delete(`/api/tasks/${id}`, { headers: getAuthHeader() });
