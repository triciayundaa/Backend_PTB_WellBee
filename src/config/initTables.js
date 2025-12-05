// src/config/initTables.js
const pool = require('./db');

async function createTables() {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

    // ==========================
    // Tabel Fisik Olahraga
    // ==========================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fisik_olahraga (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        jenisOlahraga VARCHAR(255),
        durasiMenit INT,
        kaloriTerbakar INT,
        tanggal DATE DEFAULT CURRENT_DATE
      );
    `);

    // ==========================
    // Tabel Mental
    // ==========================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mental_jurnal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        isiJurnal TEXT,
        tanggal DATE DEFAULT CURRENT_DATE
      );
    `);

    // ==========================
// Tabel Edukasi - Artikel Bawaan
// ==========================
await connection.query(`
  CREATE TABLE IF NOT EXISTS edukasi_artikel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    kategori VARCHAR(100),
    tag VARCHAR(100),
    waktu_baca VARCHAR(50),
    gambar_url VARCHAR(300),
    tanggal DATE DEFAULT CURRENT_DATE
  );
`);

// ==========================
// Tabel Edukasi - Artikel User
// ==========================
// Tabel Edukasi – Artikel buatan user
await connection.query(`
  CREATE TABLE IF NOT EXISTS user_artikel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    kategori VARCHAR(100),
    waktu_baca VARCHAR(50),
    tag VARCHAR(100),
    gambar_url VARCHAR(500),       -- ❗ tambahkan ini
    status ENUM('draft', 'uploaded', 'canceled') DEFAULT 'draft',
    tanggal_upload DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// ==========================
// Tabel Edukasi - Bookmark
// ==========================
await connection.query(`
  CREATE TABLE IF NOT EXISTS edukasi_bookmark (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    artikelId INT NOT NULL,
    jenis ENUM('static', 'user') NOT NULL,
    sudah_dibaca TINYINT(1) DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);


    connection.release();
    console.log("✔ Semua tabel berhasil dibuat/siap dipakai");

  } catch (err) {
    console.error("❌ Gagal membuat tabel:", err);
  }
}

module.exports = createTables;