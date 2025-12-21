// src/modules/edukasi/edukasi.routes.js
const express = require('express');
const router = express.Router();

const auth = require('../../auth/auth.middleware');
const controller = require('./edukasi.controller');


const upload = require('../../middleware/upload'); // Langsung ke file upload.js yang baru



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
router.post('/my-articles', upload.single('gambar'), controller.createMyArticle);

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