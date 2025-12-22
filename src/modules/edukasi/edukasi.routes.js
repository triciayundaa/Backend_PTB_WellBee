const express = require('express');
const router = express.Router();

const auth = require('../../auth/auth.middleware');
const controller = require('./edukasi.controller');

const upload = require('../../middleware/upload'); 

router.get('/categories', controller.getCategories);

router.use(auth);

router.get('/articles', controller.getPublicArticles);

router.get('/my-articles', controller.getMyArticles);

router.post('/my-articles', upload.single('gambar'), controller.createMyArticle);

router.put(
  '/my-articles/:id',
  upload.single('gambar'), 
  controller.updateMyArticle
);

router.patch('/my-articles/:id/status', controller.updateMyArticleStatus);

router.delete('/my-articles/:id', controller.removeMyArticle);

router.get('/bookmarks', controller.getBookmarks);
router.post('/bookmarks', controller.addBookmark);
router.delete('/bookmarks/:id', controller.deleteBookmark);
router.patch('/bookmarks/:id/read', controller.markBookmarkAsRead);

module.exports = router;