const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Create Tables
const createTables = require('./config/initTables');

const app = express();
const port = process.env.PORT || 3000;

// ========================
// 1. MIDDLEWARE
// ========================
app.use(cors());

// ✅ PENTING: Limit 50MB (Punya Kamu) - Supaya Foto Base64 Aman
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========================
// 2. STATIC FOLDER
// ========================
// ✅ PENTING: Folder Uploads (Punya Kamu)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ========================
// 3. ROUTES
// ========================
const routes = require('./routes');
app.use('/api', routes);

// Note: Kita sudah memanggil routes gabungan di atas, 
// jadi tidak perlu memanggil fisik/edukasi secara terpisah lagi di sini 
// karena sudah ada di dalam file src/routes.js

// Route Upload (Khusus Gambar Artikel)
const uploadRoutes = require('./modules/upload/upload.routes');
app.use('/api/upload', uploadRoutes.router); 

// ========================
// 4. ROOT ENDPOINT
// ========================
app.get('/', (req, res) => {
  res.send('WellBee API running 🐝');
});

// ========================
// 5. START SERVER (Gaya Nailah - Async)
// ========================
// ✅ LEBIH AMAN: Pastikan tabel dibuat dulu, baru server jalan.
(async () => {
  try {
    await createTables();

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ BOOT ERROR:", err);
    process.exit(1);
  }
})();