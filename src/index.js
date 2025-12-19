const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ========================
//  Static folder untuk file upload
// ========================
// Folder ini penting agar gambar artikel bisa dibuka di HP
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ========================
//  Create tables database
// ========================
const createTables = require('./config/initTables');
// Jalankan fungsi createTables untuk memastikan database siap
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