/*
  server.js — Main entry point for the backend
  ─────────────────────────────────────────────
  - Loads environment variables from .env
  - Connects to MongoDB (user profiles + tasks)
  - Connects to MySQL  (login/session history)
  - Registers all API routes
  - Starts Express server on PORT 5000
*/

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const connectMongo = require('./config/mongodb');
const connectMySQL = require('./config/mysql');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());                    // allow requests from React frontend
app.use(express.json());            // parse JSON request bodies

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);   // /api/auth/register  /api/auth/login
app.use('/api/tasks', taskRoutes);  // /api/tasks  (CRUD)

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running!' });
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function start() {
  await connectMongo();
  await connectMySQL();
  app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`   MongoDB : connected`);
    console.log(`   MySQL   : connected`);
  });
}

start();
