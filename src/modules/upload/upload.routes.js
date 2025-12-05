// src/modules/upload/upload.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../auth/auth.middleware');

const router = express.Router();

// Konfigurasi storage multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Semua endpoint upload butuh login
router.use(auth);

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File tidak ditemukan' });
  }

  const url = `/uploads/${req.file.filename}`;

  res.status(201).json({
    message: 'Upload gambar berhasil',
    url
  });
});

module.exports = router;
