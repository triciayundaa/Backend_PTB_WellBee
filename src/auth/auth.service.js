const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// UTILITIES
async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  return rows[0];
}

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0];
}

async function createUser({ username, email, passwordHash, phone }) {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)',
    [username, email || null, passwordHash, phone || null]
  );

  const [rows] = await pool.query(
    'SELECT id, username, email, phone, created_at FROM users WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
}

// REGISTER
exports.registerUser = async ({ username, email, password, phone }) => {
  const existing = await findUserByUsername(username);
  if (existing) throw new Error('username already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser({ username, email, passwordHash: hashed, phone });

  return user;
};

// LOGIN (FINAL BENAR)
exports.loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("invalid credentials");

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
};


