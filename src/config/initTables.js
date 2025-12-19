// src/config/initTables.js
const pool = require('./db');

async function createTables() {
  try {
    const connection = await pool.getConnection();

    // 1. Tabel Users (Gabungan)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(50),
        fcm_token TEXT,  
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ==========================
    // Tabel Fisik (PUNYA FATHIYA - VERSI LENGKAP)
    // ==========================
    
    // Olahraga
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fisik_olahraga (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        jenisOlahraga VARCHAR(255),
        durasiMenit INT,
        kaloriTerbakar INT,
        tanggal DATE NOT NULL,
        foto LONGTEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Sleep / Tidur
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fisik_sleep (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        jamTidur VARCHAR(10),
        jamBangun VARCHAR(10),
        durasiTidur DOUBLE,
        kualitasTidur INT,
        tanggal DATE NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Weight / Berat Badan
    await connection.query(`
      CREATE TABLE IF NOT EXISTS fisik_weight (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        beratBadan DOUBLE NOT NULL,
        tinggiBadan DOUBLE NOT NULL,
        bmi DOUBLE NOT NULL,
        kategori VARCHAR(30) NOT NULL,
        tanggal DATE NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // ==========================
    // Tabel Mental (PUNYA FATHIYA/GABUNGAN)
    // ==========================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mental_jurnal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        isiJurnal TEXT,
        tanggal DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // ==========================
    // Tabel Edukasi (PUNYA KAMU - VERSI LENGKAP)
    // ==========================

    // Artikel Bawaan (Static/Admin)
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

    // Artikel User (My Articles)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_artikel (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        judul VARCHAR(255) NOT NULL,
        isi TEXT NOT NULL,
        kategori VARCHAR(100),
        waktu_baca VARCHAR(50),
        tag VARCHAR(100),
        gambar_url VARCHAR(500),
        status ENUM('draft', 'uploaded', 'canceled') DEFAULT 'draft',
        tanggal_upload DATE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Bookmark
    await connection.query(`
      CREATE TABLE IF NOT EXISTS edukasi_bookmark (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        artikelId INT NOT NULL,
        jenis ENUM('static', 'user') NOT NULL,
        sudah_dibaca TINYINT(1) DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    connection.release();
    console.log("✔ Semua tabel berhasil dibuat/siap dipakai");

  } catch (err) {
    console.error("❌ Gagal membuat tabel:", err);
  }
}

module.exports = createTables;