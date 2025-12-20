const pool = require("./db");

async function createTables() {
  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Tabel Users
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

    // 2. Tabel Fisik Olahraga
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

    // 3. Tabel Edukasi Artikel (Konten Statis/Admin)
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

    // 4. Tabel User Artikel (Konten buatan User)
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

    // 5. Tabel Edukasi Bookmark
    await connection.query(`
      CREATE TABLE IF NOT EXISTS edukasi_bookmark (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        artikelId INT NOT NULL,
        jenis ENUM('static', 'user') NOT NULL,
        sudah_dibaca TINYINT(1) DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);

    // 6. Tabel Mental Mood
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mental_mood (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        emoji VARCHAR(10) NOT NULL,
        moodLabel VARCHAR(50) NOT NULL,
        moodScale INT NOT NULL,
        tanggal DATE NOT NULL DEFAULT (CURRENT_DATE),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mental_mood_user_tanggal (userId, tanggal),
        CONSTRAINT fk_mental_mood_user
          FOREIGN KEY (userId) REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    // 7. Tabel Mental Jurnal (DIPERBARUI)
    // Menambahkan kolom 'audio' untuk sinkron dengan audioPath di Android
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mental_jurnal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        triggerLabel VARCHAR(100),
        isiJurnal TEXT NOT NULL,
        foto LONGTEXT,
        audio LONGTEXT, 
        tanggal DATE NOT NULL DEFAULT (CURRENT_DATE),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mental_jurnal_user_tanggal (userId, tanggal),
        CONSTRAINT fk_mental_jurnal_user
          FOREIGN KEY (userId) REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    console.log("✔ Semua tabel berhasil dibuat/siap dipakai");
  } catch (err) {
    console.error("❌ Gagal membuat tabel:", err);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = createTables;