const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin'); // 🔹 TAMBAHAN: Import Firebase Admin
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ========================
// 🔹 Inisialisasi Firebase Admin
// ========================
// Pastikan file serviceAccountKey.json sudah ada di folder yang sama dengan index.js
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
console.log("Firebase Admin initialized successfully");

// ========================
//  Static folder untuk file upload
// ========================
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ========================
//  Create tables database
// ========================
const createTables = require('./config/initTables');
createTables();

// ========================
//  Global Routes (Biasanya Auth)
// ========================
const routes = require('./routes');
app.use('/api', routes);

// ========================
//  Route Fisik (PUNYA FATHIYA)
// ========================
const fisikRoutes = require('./modules/fisik/fisik.routes');
app.use('/api/fisik', fisikRoutes);

// ========================
//  Route Edukasi (PUNYA KAMU)
// ========================
const edukasiRoutes = require('./modules/edukasi/edukasi.routes');
app.use('/api/edukasi', edukasiRoutes);

// ========================
//  Route Upload (Gambar Artikel)
// ========================
const uploadRoutes = require('./modules/upload/upload.routes');
app.use('/api/upload', uploadRoutes.router);

// ========================
//  Root endpoint (Cek Server Jalan)
// ========================
app.get('/', (req, res) => {
  res.send('WellBee API running');
});

// ========================
//  Jalankan Server
// ========================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});