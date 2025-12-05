const express = require('express');
const router = express.Router();
const fisikController = require('./fisik.controller');
const authMiddleware = require('../../auth/auth.middleware');

// URL akhir: /api/fisik/olahraga
router.post('/olahraga', authMiddleware, fisikController.simpanOlahraga);
router.get('/riwayat', authMiddleware, fisikController.getRiwayatOlahraga);

module.exports = router;