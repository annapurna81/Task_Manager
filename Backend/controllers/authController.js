/*
  controllers/authController.js
  ──────────────────────────────
  Handles user registration and login.
  After login, a JWT token is returned to the client.
  Every login/register event is also logged to MySQL (session_logs table).
*/

const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const { getPool } = require('../config/mysql');

// ── Helper: generate JWT token ───────────────────────────────────────────────
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ── Helper: log to MySQL ─────────────────────────────────────────────────────
async function logToMySQL(userId, email, action, ip) {
  try {
    const pool = getPool();
    await pool.execute(
      'INSERT INTO session_logs (user_id, email, action, ip_address) VALUES (?, ?, ?, ?)',
      [userId.toString(), email, action, ip || 'unknown']
    );
  } catch (err) {
    // Log error but don't crash the app — MySQL logging is secondary
    console.error('MySQL log error:', err.message);
  }
}

// ── REGISTER ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Body: { name, email, password }
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password.' });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Create user (password is hashed in the User model's pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT
    const token = generateToken(user._id);

    // Log to MySQL
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await logToMySQL(user._id, email, 'REGISTER', ip);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Log to MySQL
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await logToMySQL(user._id, email, 'LOGIN', ip);

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
}

module.exports = { register, login };
