const express = require("express");
const router = express.Router();

const authRoutes = require('./auth/auth.routes');
const fisikRoutes = require('./modules/fisik/fisik.routes');
const mentalRoutes = require('./modules/mental/mental.routes'); 
const edukasiRoutes = require('./modules/edukasi/edukasi.routes');

router.get("/", (req, res) => {
  res.json({ message: "WellBee API routes OK 🐝" });
});

router.use('/auth', authRoutes);
router.use('/fisik', fisikRoutes);
router.use('/mental', mentalRoutes); 
router.use('/edukasi', edukasiRoutes);

module.exports = router;