const express = require('express');
const router = express.Router();
const fisikController = require('./fisik.controller');

// Kita gunakan satu cara import saja yang terbukti berhasil di route lain
const authMiddleware = require('../../auth/auth.middleware');

// =====================
// 🔥 UPDATE TOKEN HP (FCM) - PENTING!
// =====================
// Perbaikan: Gunakan 'authMiddleware' (bukan verifyToken)
router.post('/fcm-token', authMiddleware, fisikController.updateFcmToken);

// =====================
// SPORT
// =====================
router.post('/olahraga', authMiddleware, fisikController.simpanOlahraga);
router.get('/riwayat', authMiddleware, fisikController.getRiwayatOlahraga);
router.delete('/olahraga/:id', authMiddleware, fisikController.hapusOlahraga);
router.put("/olahraga/:id", authMiddleware, fisikController.updateOlahraga);
router.get("/weekly", authMiddleware, fisikController.getWeeklySport);

// =====================
// SLEEP
// =====================
router.post('/sleep', authMiddleware, fisikController.simpanTidur);
router.get('/sleep/riwayat', authMiddleware, fisikController.getRiwayatTidur);
router.delete('/sleep/:id', authMiddleware, fisikController.hapusTidur);
router.put('/sleep/:id', authMiddleware, fisikController.updateTidur);
router.get("/sleep/weekly", authMiddleware, fisikController.getWeeklySleep);

// =====================
// WEIGHT
// =====================
router.post('/weight', authMiddleware, fisikController.simpanWeight);
router.get('/weight/riwayat', authMiddleware, fisikController.getRiwayatWeight);
router.delete('/weight/:id', authMiddleware, fisikController.hapusWeight);
router.put('/weight/:id', authMiddleware, fisikController.updateWeight);

module.exports = router;