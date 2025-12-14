const express = require('express');
const router = express.Router();
const fisikController = require('./fisik.controller');
const authMiddleware = require('../../auth/auth.middleware');

// SPORT
router.post('/olahraga', authMiddleware, fisikController.simpanOlahraga);
router.get('/riwayat', authMiddleware, fisikController.getRiwayatOlahraga);
router.delete('/olahraga/:id', authMiddleware, fisikController.hapusOlahraga);
router.put("/olahraga/:id", authMiddleware, fisikController.updateOlahraga);

// SLEEP
router.post('/sleep', authMiddleware, fisikController.simpanTidur);
router.get('/sleep/riwayat', authMiddleware, fisikController.getRiwayatTidur);
// DELETE sleep by id
router.delete('/sleep/:id', authMiddleware, fisikController.hapusTidur);
router.put('/sleep/:id', authMiddleware, fisikController.updateTidur);

// WEIGHT
router.post('/weight', authMiddleware, fisikController.simpanWeight);
router.get('/weight/riwayat', authMiddleware, fisikController.getRiwayatWeight);
router.delete('/weight/:id', authMiddleware, fisikController.hapusWeight);
router.put('/weight/:id', authMiddleware, fisikController.updateWeight);

module.exports = router;
