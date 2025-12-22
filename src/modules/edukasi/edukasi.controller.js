const service = require('./edukasi.service');
const { KATEGORI_LIST } = require('./edukasi.constants');
const admin = require('../../config/firebase'); 

function handleError(res, err, label) {
  console.error(`Error ${label}:`, err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal server error' });
}

async function sendPushNotification(articleId, judul) {
  const payload = {
    notification: {
      title: 'Wellbee: Edukasi Baru!',
      body: `Baca artikel terbaru: ${judul}`
    },
    data: {
      articleId: String(articleId),
      target_screen: "education_detail" 
    },
    android: {
      notification: {
        channelId: "wellbee_channel_id", 
        priority: "high",
        sound: "logo"
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

async function getCategories(req, res) {
  try {
    res.json({ categories: KATEGORI_LIST });
  } catch (err) {
    handleError(res, err, 'getCategories');
  }
}

async function getPublicArticles(req, res) {
  try {
    const articles = await service.getPublicArticles();
    res.json({ articles });
  } catch (err) {
    handleError(res, err, 'getPublicArticles');
  }
}

async function getMyArticles(req, res) {
  try {
    const userId = req.user.id;
    const articles = await service.getMyArticles(userId);
    res.json({ articles });
  } catch (err) {
    handleError(res, err, 'getMyArticles');
  }
}

async function createMyArticle(req, res) {
  try {
    const userId = req.user.id;
    const { judul, status } = req.body; 
    const articleId = await service.createMyArticle(userId, req.body);

    if (status === 'uploaded') {
      sendPushNotification(articleId, judul).catch(err => console.error("FCM Error:", err));
    }

    res.status(201).json({ message: 'Artikel berhasil dibuat', articleId });
  } catch (err) {
    handleError(res, err, 'createMyArticle');
  }
}

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

async function getBookmarks(req, res) {
  try {
    const userId = req.user.id;
    const bookmarks = await service.getBookmarks(userId);
    res.json({ bookmarks });
  } catch (err) {
    handleError(res, err, 'getBookmarks');
  }
}

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

async function updateMyArticleStatus(req, res) {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status wajib diisi' });
    }

    const articleData = await service.updateMyArticleStatus(userId, articleId, status);

    if (status === 'uploaded') {
      sendPushNotification(articleId, articleData.judul).catch(err => console.error("FCM Error:", err));
    }

    return res.json({ message: 'Status artikel berhasil diperbarui' });
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