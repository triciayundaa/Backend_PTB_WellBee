require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Create Tables
const createTables = require('./config/initTables');

const app = express();
const port = process.env.PORT || 3000;

// ========================
// 1. MIDDLEWARE
// ========================
app.use(cors());

// Tambahkan limit pada middleware express.json()
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


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
// 5. PENYESUAIAN VERCEL
// ========================

// Kita tetap jalankan initTables, tapi tidak membungkus app.listen
createTables()
  .then(() => {
    console.log("✅ Database tables initialized");
  })
  .catch((err) => {
    console.error("❌ Init tables error:", err);
  });

// HAPUS atau COMMENT bagian app.listen ini:
/*
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
*/

// WAJIB: Export app untuk Vercel
module.exports = app;