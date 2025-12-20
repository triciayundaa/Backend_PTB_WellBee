// src/modules/edukasi/edukasi.controller.js
const service = require('./edukasi.service');
const { KATEGORI_LIST } = require('./edukasi.constants');
const admin = require('../../config/firebase'); // 🔹 Tambahkan import ini

function handleError(res, err, label) {
  console.error(`Error ${label}:`, err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}

// 🔹 Fungsi Helper untuk kirim notifikasi FCM (DIUPDATE)
async function sendPushNotification(articleId, judul) {
  const payload = {
    notification: {
      title: 'Wellbee: Edukasi Baru!',
      body: `Baca artikel terbaru: ${judul}`
    },
    data: {
      articleId: String(articleId),
      target_screen: "education_detail" // 🔹 Tambahan agar MainActivity tahu arah navigasinya
    },
    android: {
      notification: {
        channelId: "wellbee_channel_id", // 🔹 Harus sama dengan di MainActivity.kt
        priority: "high",
        sound: "default"
      }
    },
    topic: 'new_articles'
  };

  try {
    const response = await admin.messaging().send(payload);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

/** 0) GET /api/edukasi/categories */
async function getCategories(req, res) {
  try {
    res.json({ categories: KATEGORI_LIST });
  } catch (err) {
    handleError(res, err, 'getCategories');
  }
}

/** 1) GET /api/edukasi/articles */
async function getPublicArticles(req, res) {
  try {
    const articles = await service.getPublicArticles();
    res.json({ articles });
  } catch (err) {
    handleError(res, err, 'getPublicArticles');
  }
}

/** 2) GET /api/edukasi/my-articles */
async function getMyArticles(req, res) {
  try {
    const userId = req.user.id;
    const articles = await service.getMyArticles(userId);
    res.json({ articles });
  } catch (err) {
    handleError(res, err, 'getMyArticles');
  }
}

/** 3) POST /api/edukasi/my-articles */
async function createMyArticle(req, res) {
  try {
    const userId = req.user.id;
    const { judul, status } = req.body; // Ambil judul dan status
    const articleId = await service.createMyArticle(userId, req.body);

    // 🔹 Pemicu Notifikasi jika status langsung 'uploaded'
    if (status === 'uploaded') {
      sendPushNotification(articleId, judul);
    }

    res.status(201).json({
      message: 'Artikel berhasil dibuat',
      articleId
    });
  } catch (err) {
    handleError(res, err, 'createMyArticle');
  }
}

/** 4) PUT /api/edukasi/my-articles/:id */
async function updateMyArticle(req, res) {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;
    const file = req.file || null;
    const payload = req.body;

    const result = await service.updateMyArticle(userId, articleId, payload, file);

    res.json({
      message: 'Artikel berhasil diperbarui',
      data: result
    });
  } catch (err) {
    handleError(res, err, 'updateMyArticle');
  }
}

/** 5) DELETE /api/edukasi/my-articles/:id */
async function removeMyArticle(req, res) {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;
    await service.removeMyArticle(userId, articleId);
    res.json({ message: 'Artikel berhasil dihapus' });
  } catch (err) {
    handleError(res, err, 'removeMyArticle');
  }
}

/** 6) GET /api/edukasi/bookmarks */
async function getBookmarks(req, res) {
  try {
    const userId = req.user.id;
    const bookmarks = await service.getBookmarks(userId);
    res.json({ bookmarks });
  } catch (err) {
    handleError(res, err, 'getBookmarks');
  }
}

/** 7) POST /api/edukasi/bookmarks */
async function addBookmark(req, res) {
  try {
    const userId = req.user.id;
    const { artikelId, jenis } = req.body;
    const result = await service.addBookmark(userId, artikelId, jenis);
    if (result.already) {
      return res.status(200).json({ message: 'Sudah di-bookmark' });
    }
    res.status(201).json({ message: 'Bookmark ditambahkan' });
  } catch (err) {
    handleError(res, err, 'addBookmark');
  }
}

/** 8) DELETE /api/edukasi/bookmarks/:id */
async function deleteBookmark(req, res) {
  try {
    const userId = req.user.id;
    const bookmarkId = req.params.id;
    await service.removeBookmark(userId, bookmarkId);
    res.json({ message: 'Bookmark dihapus' });
  } catch (err) {
    handleError(res, err, 'deleteBookmark');
  }
}

/** 9) PATCH /api/edukasi/bookmarks/:id/read */
async function markBookmarkAsRead(req, res) {
  try {
    const userId = req.user.id;
    const bookmarkId = req.params.id;
    await service.markBookmarkAsRead(userId, bookmarkId);
    res.json({ message: 'Bookmark ditandai sudah dibaca' });
  } catch (err) {
    handleError(res, err, 'markBookmarkAsRead');
  }
}

/** 10) PATCH /api/edukasi/my-articles/:id/status */
async function updateMyArticleStatus(req, res) {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status wajib diisi' });
    }

    const articleData = await service.updateMyArticleStatus(userId, articleId, status);

    // 🔹 Pemicu Notifikasi jika status diubah menjadi 'uploaded'
    if (status === 'uploaded') {
      sendPushNotification(articleId, articleData.judul);
    }

    return res.json({
      message: 'Status artikel berhasil diperbarui'
    });
  } catch (err) {
    handleError(res, err, 'updateMyArticleStatus');
  }
}

module.exports = {
  getCategories,
  getPublicArticles,
  getMyArticles,
  createMyArticle,
  updateMyArticle,
  updateMyArticleStatus,
  getBookmarks,
  addBookmark,
  deleteBookmark,
  markBookmarkAsRead,
  removeMyArticle
};