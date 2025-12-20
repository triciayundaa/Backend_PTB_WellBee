const model = require('./edukasi.model');

function makeError(message, status = 500) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function getPublicArticles() {
  return model.getPublicArticles();
}

async function getMyArticles(userId) {
  return model.getUserArticles(userId);
}

async function createMyArticle(userId, payload) {
  const {
    judul,
    isi,
    kategori,
    waktu_baca, // pastikan sesuai CreateArticleRequest di Android
    tag,
    gambar_url = null, 
    status = 'uploaded'
  } = payload;

  if (!judul || !isi) {
    throw makeError('Judul dan isi wajib diisi', 400);
  }

  const tanggalUpload = (status === 'uploaded') ? new Date() : null;

  // 🔹 PASTIKAN properti di bawah ini sama persis dengan yang diharapkan edukasi.model.js
  return model.insertUserArticle({
    userId,
    title: judul,
    content: isi,
    category: kategori,
    readTime: waktu_baca, // 🔹 SESUAIKAN: Harus 'readTime' agar diterima model
    tag,
    status,
    tanggalUpload: (status === 'uploaded') ? new Date() : null,
    gambarUrl: gambar_url   // 🔹 SESUAIKAN: Harus 'gambarUrl' agar diterima model
  });
}

// 🔹 PERBAIKAN: Fungsi update dimodifikasi untuk mendukung Base64 tanpa folder /uploads
async function updateMyArticle(userId, articleId, payload, file) {
  const { judul, isi, kategori, waktu_baca, tag, gambar_base64 } = payload; // 🔹 Ambil gambar_base64 dari body jika ada

  if (!judul || !isi) {
    throw makeError('Judul dan isi wajib diisi', 400);
  }

  const dataToUpdate = {
    title: judul,
    content: isi,
    category: kategori,
    read_time: waktu_baca, // 🔹 Pastikan sesuai dengan penamaan di edukasi.model.js
    tag: tag
  };

  // 🔹 Logika baru: Jika ada file (dari multer) atau string base64, simpan sebagai URL/Teks
  if (file) {
    // Note: Ini tetap akan sulit di Vercel, disarankan kirim via gambar_base64 dari Android
    dataToUpdate.gambar_url = `/uploads/${file.filename}`;
  } else if (gambar_base64) {
    dataToUpdate.gambar_url = gambar_base64; // 🔹 Simpan string panjang Base64 ke database
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

  let tanggalUpload = (status === 'uploaded') ? (existing.tanggalUpload || new Date()) : null;

  await model.updateUserArticleStatus({
    articleId,
    userId,
    status,
    tanggalUpload
  });

  return existing; 
}

async function removeMyArticle(userId, articleId) {
  const result = await model.deleteUserArticle(userId, articleId);
  if (result.affectedRows === 0) {
    throw makeError('Artikel tidak ditemukan', 404);
  }
}

async function getBookmarks(userId) {
  return model.getBookmarks(userId);
}

async function addBookmark(userId, artikelId, jenis) {
  if (!artikelId || !['static', 'user'].includes(jenis)) {
    throw makeError('Data tidak valid', 400);
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
  removeMyArticle,
  getBookmarks,
  addBookmark,
  removeBookmark,
  markBookmarkAsRead
};