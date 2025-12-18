const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// --- FUNGSI UTILITY ---
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
    const [rows] = await pool.query('SELECT id, username, email, phone, created_at FROM users WHERE id = ?', [result.insertId]);
    return rows[0];
}

// --- FUNGSI UTAMA (EXPORTS) ---
exports.registerUser = async ({ username, email, password, phone }) => { 
    const existing = await findUserByUsername(username);
    if (existing) {
        const err = new Error('username already exists');
        err.status = 400;
        throw err;
    }
    const hashed = await bcrypt.hash(password, 10);
    return await createUser({ username, email, passwordHash: hashed, phone }); 
};

exports.loginUser = async ({ email, password }) => { 
    const user = await findUserByEmail(email); 
    if (!user) {
        const err = new Error('invalid credentials');
        err.status = 401;
        throw err;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        const err = new Error('invalid credentials');
        err.status = 401;
        throw err;
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { token, user };
};

// Tambahkan ini agar controller tetap bersih
exports.getUserById = async (id) => {
    const [rows] = await pool.query('SELECT id, username, email, phone FROM users WHERE id = ?', [id]);
    return rows[0];
};

exports.resetUserPasswordSimple = async ({ email, newPassword }) => {
    // Gunakan trim untuk menghapus spasi yang tidak sengaja terketik di HP
    const cleanEmail = email.trim(); 

    const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);

    if (rows.length === 0) {
        // Jika ini muncul, berarti email 'cleanEmail' benar-benar tidak ada di kolom email tabel users
        const err = new Error('Email tidak ditemukan di database');
        err.status = 404;
        throw err;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, rows[0].id]);
    return true;
};