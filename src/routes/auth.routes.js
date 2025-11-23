const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    const [exist] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exist.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    );

    const newUser = { id: result.insertId, name, email };
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email dan password baru wajib diisi' });
  }

  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email tidak ditemukan' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.query(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [passwordHash, email]
    );

    res.json({ message: 'Password berhasil direset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
