const express = require('express');
const auth = require('../../auth/auth.middleware');
const upload = require('../../middleware/upload'); // Memanggil middleware Cloudinary yang kita buat tadi

const router = express.Router();

// Middleware Auth (Pastikan user login sebelum upload)
router.use(auth);

/**
 * Endpoint: POST /api/upload/image
 * Deskripsi: Mengunggah gambar langsung ke Cloudinary
 */
router.post('/image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File tidak ditemukan atau format salah' });
        }

        // URL dari Cloudinary ada di req.file.path
        const url = req.file.path;

        res.status(201).json({
            message: 'Upload gambar ke Cloudinary berhasil ☁️',
            url: url
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: 'Gagal memproses gambar' });
    }
});

module.exports = {
    router,
    upload // Tetap export agar bisa dipakai di edukasi.routes.js jika perlu
};