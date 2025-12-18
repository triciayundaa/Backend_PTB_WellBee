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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
//  Create tables database
// ========================
const createTables = require('./config/initTables');
createTables();

// ========================
//  Global Routes Wrapper 
// ========================
const routes = require('./routes');
app.use('/api', routes);

// ========================
//  Route Fisik
// ========================
const fisikRoutes = require('./modules/fisik/fisik.routes');
app.use('/api/fisik', fisikRoutes);

// ========================
//  Route Edukasi
// ========================
const edukasiRoutes = require('./modules/edukasi/edukasi.routes');
app.use('/api/edukasi', edukasiRoutes);

// ========================
//  Route Upload (Gambar Artikel)
// ========================
const uploadRoutes = require('./modules/upload/upload.routes');
app.use('/api/upload', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// ========================
//  Root endpoint
// ========================
app.get('/', (req, res) => {
  res.send('WellBee API running');
});

// ========================
//  Start Server
// ========================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
