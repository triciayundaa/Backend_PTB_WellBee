// src/auth/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// 🔹 TAMBAHKAN BARIS INI (Pastikan path-nya benar menuju file auth.middleware.js)
const authMiddleware = require('./auth.middleware'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);

// Sekarang authMiddleware sudah didefinisikan dan bisa digunakan
router.get('/me', authMiddleware, authController.getMe); 

module.exports = router;