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

/**
 * Buat artikel user baru.
 * Sekarang bisa terima status dari Android:
 *  - "draft"
 *  - "uploaded"
 */
async function createMyArticle(userId, payload) {
  // Terima payload dari Android
  const {
    judul,
    isi,
    kategori,
    waktu_baca,
    tag,
    gambar_url = null,
    status = 'uploaded'   // ⬅️ default kalau tidak dikirim
  } = payload;

  if (!judul || !isi) {
    throw makeError('Judul dan isi wajib diisi', 400);
  }

  const title = judul;
  const content = isi;
  const category = kategori;
  const readTime = waktu_baca;

  // hanya isi tanggal_upload jika status = uploaded
  const tanggalUpload = (status === 'uploaded') ? new Date() : null;

  const articleId = await model.insertUserArticle({
    userId,
    title,
    content,
    category,
    readTime,
    tag,
    status,
    tanggalUpload,
    gambarUrl: gambar_url
  });

  return articleId;
}

async function updateMyArticle(userId, articleId, payload, file) {
  const {
    judul,
    isi,
    kategori,
    waktu_baca,
    tag
  } = payload;

  if (!judul || !isi) {
    throw makeError('Judul dan isi wajib diisi', 400);
  }

  const dataToUpdate = {
    title: judul,
    content: isi,
    category: kategori,
    read_time: waktu_baca,
    tag: tag
  };


  if (file) {
    const gambarUrl = `/uploads/${file.filename}`;
    dataToUpdate.gambar_url = gambarUrl;
  }

  const updated = await model.updateUserArticle(userId, articleId, dataToUpdate);

  if (!updated) {
    throw makeError('Artikel tidak ditemukan atau bukan milik Anda', 404);
  }

  return updated;
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
  if (status !== 'uploaded') {
    // kalau status draft / canceled → tanggal_upload boleh null
    tanggalUpload = null;
  }

  await model.updateUserArticleStatus({
    articleId,
    userId,
    status,
    tanggalUpload
  });
}

async function removeMyArticle(userId, articleId) {
  const result = await model.deleteUserArticle(userId, articleId);
  if (result.affectedRows === 0) {
    throw makeError('Artikel tidak ditemukan / bukan milik Anda', 404);
  }
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
  // artikel
  getPublicArticles,
  getMyArticles,
  createMyArticle,
  updateMyArticle,
  updateMyArticleStatus,
  removeMyArticle,

  // bookmark
  getBookmarks,
  addBookmark,
  removeBookmark,
  markBookmarkAsRead
};
