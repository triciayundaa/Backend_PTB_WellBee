const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// ========================
// 1. MIDDLEWARE (FIX URUTAN)
// ========================
app.use(cors());

// ⚠️ PENTING: Hapus 'body-parser' manual, pakai bawaan express saja biar rapi.
// Hapus baris app.use(express.json()) yang polosan (tanpa limit).
// Langsung pasang yang ada limit 50mb di paling atas.

app.use(express.json({ limit: '50mb' })); // ✅ BENAR: Foto besar bisa masuk
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========================
// 2. FIREBASE (HAPUS BAGIAN INI)
// ========================
// ❌ JANGAN inisialisasi di sini lagi, karena sudah dilakukan di file:
//    src/config/firebase.js (yang dipanggil oleh fisik.controller.js)
//    Kalau double init, server bakal CRASH.

// ========================
// 3. STATIC FOLDER
// ========================
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ========================
// 4. DATABASE
// ========================
const createTables = require('./config/initTables');
createTables();

// ========================
// 5. ROUTES
// ========================
// Route Global
const routes = require('./routes');
app.use('/api', routes);

// Route Fisik (PUNYA FATHIYA)
const fisikRoutes = require('./modules/fisik/fisik.routes');
app.use('/api/fisik', fisikRoutes);

// Route Edukasi (PUNYA KAMU)
const edukasiRoutes = require('./modules/edukasi/edukasi.routes');
app.use('/api/edukasi', edukasiRoutes);

// Route Upload (Gambar Artikel)
const uploadRoutes = require('./modules/upload/upload.routes');
app.use('/api/upload', uploadRoutes.router); // Pastikan uploadRoutes meng-export { router }

// ========================
// 6. ROOT & LISTEN
// ========================
app.get('/', (req, res) => {
  res.send('WellBee API running 🐝');
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});