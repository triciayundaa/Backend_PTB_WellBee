const express = require("express");
const router = express.Router();

// Import semua routes modul
const authRoutes = require('./auth/auth.routes');
const fisikRoutes = require('./modules/fisik/fisik.routes');
const mentalRoutes = require('./modules/mental/mental.routes'); // Punya Nailah
const edukasiRoutes = require('./modules/edukasi/edukasi.routes');

// Cek status API
router.get("/", (req, res) => {
  res.json({ message: "WellBee API routes OK 🐝" });
});

// Daftarkan semua routes
router.use('/auth', authRoutes);
router.use('/fisik', fisikRoutes);
router.use('/mental', mentalRoutes); // Aktifkan Mental
router.use('/edukasi', edukasiRoutes);

module.exports = router;