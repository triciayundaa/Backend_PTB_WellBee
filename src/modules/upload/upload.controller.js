// src/modules/upload/upload.controller.js
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Pastikan folder /uploads ada di root project (sejajar dengan folder src)
const uploadDir = path.join(__dirname, '../../../uploads');

// kalau belum ada → buat
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '.jpg');
    const fileName = `artikel_${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// Handler upload
async function uploadImageHandler(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file image yang dikirim' });
    }

    // Path yang akan disimpan di database / dikirim ke Android
    const urlPath = `/uploads/${req.file.filename}`;

    return res.json({
      url: urlPath   // ⬅️ Android pakai field "url" ini
    });
  } catch (err) {
    console.error('Error upload image:', err);
    return res.status(500).json({ message: 'Gagal upload gambar' });
  }
}

module.exports = {
  upload,
  uploadImageHandler
};
