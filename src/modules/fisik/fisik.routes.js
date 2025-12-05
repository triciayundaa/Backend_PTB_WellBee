const express = require('express');
const router = express.Router();
const fisikController = require('./fisik.controller');

// URL akhir: /api/fisik/olahraga
router.post('/olahraga', fisikController.simpanOlahraga);

module.exports = router;