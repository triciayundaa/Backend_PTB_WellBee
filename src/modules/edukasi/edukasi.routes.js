// src/modules/edukasi/edukasi.routes.js
const express = require('express');
const router = express.Router();

const auth = require('../../auth/auth.middleware');
const controller = require('./edukasi.controller');

/// PERBAIKAN: Mengambil properti 'upload' dari objek yang diekspor upload.routes
const { upload } = require('../upload/upload.routes');

// =======================
//  Public route (tanpa login)
// =======================

// Daftar kategori edukasi (list tetap)
router.get('/categories', controller.getCategories);

// =======================
//  Protected routes (wajib login)
// =======================

router.use(auth);

// Artikel publik (static + user uploaded)
router.get('/articles', controller.getPublicArticles);

// Artikel saya
router.get('/my-articles', controller.getMyArticles);

// Buat artikel baru
router.post('/my-articles', controller.createMyArticle);

// Update artikel saya
router.put(
  '/my-articles/:id',
  upload.single('gambar'), // Memanggil .single() dari objek upload yang diimport
  controller.updateMyArticle
);

// Ubah status artikel saya
router.patch('/my-articles/:id/status', controller.updateMyArticleStatus);

// Hapus artikel saya
router.delete('/my-articles/:id', controller.removeMyArticle);

// Bookmark
router.get('/bookmarks', controller.getBookmarks);
router.post('/bookmarks', controller.addBookmark);
router.delete('/bookmarks/:id', controller.deleteBookmark);
router.patch('/bookmarks/:id/read', controller.markBookmarkAsRead);

module.exports = router;