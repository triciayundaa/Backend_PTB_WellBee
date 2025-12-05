const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// --- FUNGSI UTILITY ---

// Mencari user berdasarkan username (Digunakan oleh Register untuk cek duplikasi username)
async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  return rows[0];
}

// Mencari user berdasarkan email (Digunakan oleh Login)
async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0];
}

// Fungsi untuk memasukkan data user baru ke database
// DITAMBAH: Menerima 'phone'
async function createUser({ username, email, passwordHash, phone }) { 
  const [result] = await pool.query(
    // DITAMBAH: Kolom 'phone'
    'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)',
    // DITAMBAH: Nilai 'phone'
    [username, email || null, passwordHash, phone || null] 
  );
  
  // SELECT data yang baru dimasukkan (DITAMBAH: 'phone')
  const [rows] = await pool.query('SELECT id, username, email, phone, created_at FROM users WHERE id = ?', [result.insertId]);
  
  return rows[0];
}

// --- FUNGSI UTAMA (EXPORTS) ---

// 1. REGISTRASI
// DITAMBAH: Menerima 'phone'
exports.registerUser = async ({ username, email, password, phone }) => { 
  // Cek jika username sudah ada (kita gunakan findUserByUsername yang lama)
  const existing = await findUserByUsername(username);
  if (existing) {
    const err = new Error('username already exists');
    err.status = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  
  // KIRIM 'phone' ke fungsi createUser
  const user = await createUser({ username, email, passwordHash: hashed, phone }); 
  
  return user;
};

// 2. LOGIN
// DIUBAH: Menerima 'email' dan mencari user berdasarkan email
exports.loginUser = async ({ email, password }) => { 
  // MENCARI user berdasarkan email (karena kita sudah ganti logikanya)
  const user = await findUserByEmail(email); 
  
  if (!user) {
    const err = new Error('invalid credentials');
    err.status = 401;
    throw err;
  }

  // Cek Password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('invalid credentials');
    err.status = 401;
    throw err;
  }

  // Buat Token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  return token;
};