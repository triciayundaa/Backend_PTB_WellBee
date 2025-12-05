// src/modules/edukasi/edukasi.service.js
const model = require('./edukasi.model');

function makeError(message, status = 500) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/** ARTIKEL PUBLIK */
async function getPublicArticles() {
  return model.getPublicArticles();
}

/** ARTIKEL SAYA */
async function getMyArticles(userId) {
  return model.getUserArticles(userId);
}

async function createMyArticle(userId, payload) {
  // Terima payload dari Android (nama field sesuai body JSON)
  const {
    judul,
    isi,
    kategori,
    waktu_baca,
    tag,
    gambar_url = null     // 🔹 URL gambar dari Android (optional)
  } = payload;

  if (!judul || !isi) {
    throw makeError('Judul dan isi wajib diisi', 400);
  }

  // Mapping ke field tabel
  const title = judul;
  const content = isi;
  const category = kategori;
  const readTime = waktu_baca;

  const status = 'uploaded'; // otomatis uploaded saat user klik Upload
  const tanggalUpload = new Date();

  const articleId = await model.insertUserArticle({
    userId,
    title,
    content,
    category,
    readTime,
    tag,
    status,
    tanggalUpload,
    gambarUrl: gambar_url   // 🔹 lempar ke model
  });

  return articleId;
}

async function updateMyArticle(userId, articleId, payload) {
  const existing = await model.getUserArticleById(articleId, userId);
  if (!existing) {
    throw makeError('Artikel tidak ditemukan / bukan milik Anda', 404);
  }

  const {
    title = existing.judul,
    content = existing.isi,
    category = existing.kategori,
    readTime = existing.waktuBaca,
    tag = existing.tag,
    gambar_url = existing.gambarUrl || null   // 🔹 kalau ada gambar baru boleh override
  } = payload;

  await model.updateUserArticle({
    articleId,
    userId,
    title,
    content,
    category,
    readTime,
    tag,
    gambarUrl: gambar_url
  });
}

async function updateMyArticleStatus(userId, articleId, status) {
  if (!['draft', 'uploaded', 'canceled'].includes(status)) {
    throw makeError('Status tidak valid', 400);
  }

  const existing = await model.getUserArticleById(articleId, userId);
  if (!existing) {
    throw makeError('Artikel tidak ditemukan / bukan milik Anda', 404);
  }

  let tanggalUpload = existing.tanggalUpload;
  if (status === 'uploaded' && !tanggalUpload) {
    tanggalUpload = new Date();
  }

  await model.updateUserArticleStatus({
    articleId,
    userId,
    status,
    tanggalUpload
  });
}

/** BOOKMARKS */
async function getBookmarks(userId) {
  return model.getBookmarks(userId);
}

async function addBookmark(userId, artikelId, jenis) {
  if (!artikelId || !['static', 'user'].includes(jenis)) {
    throw makeError('artikelId / jenis tidak valid', 400);
  }

  const existing = await model.findBookmark(userId, artikelId, jenis);
  if (existing) {
    return { already: true };
  }

  await model.insertBookmark(userId, artikelId, jenis);
  return { already: false };
}

async function removeBookmark(userId, bookmarkId) {
  const result = await model.deleteBookmark(userId, bookmarkId);
  if (result.affectedRows === 0) {
    throw makeError('Bookmark tidak ditemukan', 404);
  }
}

async function markBookmarkAsRead(userId, bookmarkId) {
  const result = await model.markBookmarkRead(userId, bookmarkId);
  if (result.affectedRows === 0) {
    throw makeError('Bookmark tidak ditemukan', 404);
  }
}

module.exports = {
  getPublicArticles,
  getMyArticles,
  createMyArticle,
  updateMyArticle,
  updateMyArticleStatus,
  getBookmarks,
  addBookmark,
  removeBookmark,
  markBookmarkAsRead
};
