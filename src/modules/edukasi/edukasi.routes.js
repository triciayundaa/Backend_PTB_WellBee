// src/modules/edukasi/edukasi.routes.js
const express = require('express');
const router = express.Router();

const auth = require('../../auth/auth.middleware');
const controller = require('./edukasi.controller');

// pakai multer yang sudah dikonfigurasi di upload.controller
const { upload } = require('../upload/upload.controller');

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

// Buat artikel baru (JSON body, gambar diupload via /api/upload/image)
router.post('/my-articles', controller.createMyArticle);

// Update artikel saya (judul, isi, kategori, waktu_baca, tag + optional gambar baru)
router.put(
  '/my-articles/:id',
  upload.single('gambar'),      // field "gambar" harus sama dg @Part("gambar") di Android
  controller.updateMyArticle
);

// Ubah status artikel saya (draft / uploaded / canceled)
router.patch('/my-articles/:id/status', controller.updateMyArticleStatus);

// Hapus artikel saya
router.delete('/my-articles/:id', controller.removeMyArticle);

// Bookmark
router.get('/bookmarks', controller.getBookmarks);
router.post('/bookmarks', controller.addBookmark);
router.delete('/bookmarks/:id', controller.deleteBookmark);
router.patch('/bookmarks/:id/read', controller.markBookmarkAsRead);

module.exports = router;
