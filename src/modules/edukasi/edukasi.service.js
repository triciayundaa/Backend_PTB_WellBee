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

// 🔹 PERBAIKAN: Menjamin status 'uploaded' agar tampil di Education Screen
async function createMyArticle(userId, payload) {
  const {
    judul,
    isi,
    kategori,
    waktu_baca, 
    tag,
    gambar_url, // Berisi Base64 dari Android
    status
  } = payload;

  if (!judul || !isi) {
    throw makeError('Judul dan isi wajib diisi', 400);
  }

  // Jika status kosong dari Android, paksa jadi 'uploaded' agar muncul di halaman Publik
  const finalStatus = status || 'uploaded';

  return model.insertUserArticle({
    userId,
    title: judul,
    content: isi,
    category: kategori,
    readTime: waktu_baca,
    tag,
    status: finalStatus,
    tanggalUpload: new Date(),
    gambarUrl: gambar_url // Pastikan model menerima properti ini
  });
}

// 🔹 PERBAIKAN: Sinkronisasi update gambar Base64
async function updateMyArticle(userId, articleId, payload, file) {
  const { judul, isi, kategori, waktu_baca, tag, gambar_base64 } = payload;

  if (!judul || !isi) {
    throw makeError('Judul dan isi wajib diisi', 400);
  }

  const dataToUpdate = {
    title: judul,
    content: isi,
    category: kategori,
    read_time: waktu_baca, // Samakan dengan create (camelCase)
    tag: tag
  };

  if (file) {
    dataToUpdate.gambarUrl = file.path; // Cloudinary menyimpan URL di property .path
  } else if (payload.gambar_url) {
    // Jika tidak ada file baru, tetap gunakan URL yang lama (agar tidak hilang)
    dataToUpdate.gambar_url = payload.gambar_url;
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