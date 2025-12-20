// src/config/initTables.js
const pool = require('./db');

async function createTables() {
    let connection;
    try {
        connection = await pool.getConnection();

        // 1. TABEL USERS
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

        // 2. TABEL FISIK (OLAHRAGA, TIDUR, BERAT BADAN)
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

        // 3. TABEL MENTAL (MOOD & JURNAL)
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
                CONSTRAINT fk_mental_mood_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

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
                CONSTRAINT fk_mental_jurnal_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        // 4. TABEL EDUKASI (ARTIKEL & BOOKMARK)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS edukasi_artikel (
                id INT AUTO_INCREMENT PRIMARY KEY,
                judul VARCHAR(255) NOT NULL,
                isi TEXT NOT NULL,
                kategori VARCHAR(100),
                tag VARCHAR(100),
                waktu_baca VARCHAR(50),
                gambar_url LONGTEXT, -- 🔹 Diubah agar konsisten bisa menampung base64
                tanggal DATE DEFAULT (CURRENT_DATE)
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_artikel (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                judul VARCHAR(255) NOT NULL,
                isi TEXT NOT NULL,
                kategori VARCHAR(100),
                waktu_baca VARCHAR(50),
                tag VARCHAR(100),
                gambar_url LONGTEXT, -- 🔹 Diubah menjadi LONGTEXT
                status ENUM('draft', 'uploaded', 'canceled') DEFAULT 'draft',
                tanggal_upload DATE DEFAULT (CURRENT_DATE),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        // 🔹 MODIFIKASI: Jalankan ALTER TABLE setelah dipastikan tabel user_artikel sudah ada
        try {
            await connection.query("ALTER TABLE user_artikel MODIFY COLUMN gambar_url LONGTEXT;");
            console.log("🛠️ Kolom gambar_url dipastikan LONGTEXT");
        } catch (alterErr) {
            console.log("ℹ️ Kolom gambar_url sudah LONGTEXT atau sedang diproses.");
        }

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

        console.log("✔ Semua tabel berhasil dibuat/siap dipakai");

    } catch (err) {
        console.error("❌ Gagal membuat tabel:", err);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = createTables;