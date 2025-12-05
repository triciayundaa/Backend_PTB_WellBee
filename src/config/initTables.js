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
    // Tabel Edukasi
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
