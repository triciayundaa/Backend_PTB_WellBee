// src/config/initTables.js
const pool = require('./db');

async function createTables() {
  try {
    const connection = await pool.getConnection();

    // 1. Tabel Users (Induk)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        tanggal DATE NOT NULL,
        foto LONGTEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // ==========================
    // Tabel Fisik Sleep
    // ==========================
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

    // ==========================
    // Tabel Fisik Weight
    // ==========================
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
    // Tabel Mental
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
    // Tabel Edukasi (Artikel biasanya admin, jadi opsional pakai FK user)
    // ==========================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS edukasi_artikel (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul VARCHAR(255),
        isi TEXT,
        tanggal DATE DEFAULT CURRENT_DATE
      );
    `);

    connection.release();
    console.log("✔ Semua tabel berhasil dibuat/siap dipakai");

  } catch (err) {
    console.error("❌ Gagal membuat tabel:", err);
  }
}

module.exports = createTables;