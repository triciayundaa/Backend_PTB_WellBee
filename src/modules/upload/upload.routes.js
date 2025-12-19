const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../../auth/auth.middleware');

const router = express.Router();

/** * Path: __dirname ada di src/modules/upload
 * .. (1) -> src/modules
 * .. (2) -> src
 * .. (3) -> Root (Lokasi folder uploads)
 */
const uploadDir = path.join(__dirname, '../../../uploads');

// Buat folder jika belum ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req, file, cb) {
        // Format: timestamp-angkaRandom.jpg agar unik
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname || '.jpg');
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

// Middleware Auth
router.use(auth);

// Endpoint Upload
router.post('/image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    // URL ini yang disimpan di Database (Path Relatif)
    const url = `/uploads/${req.file.filename}`;

    res.status(201).json({
        message: 'Upload gambar berhasil',
        url: url
    });
});

// PERBAIKAN: Export sebagai objek agar 'upload' bisa dipakai di edukasi.routes.js
module.exports = {
    router,
    upload
};