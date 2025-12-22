const express = require('express');
const auth = require('../../auth/auth.middleware');
const upload = require('../../middleware/upload'); 

const router = express.Router();

router.use(auth);

router.post('/image', upload.single('gambar'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File tidak ditemukan atau format salah' });
        }

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
    upload 
};