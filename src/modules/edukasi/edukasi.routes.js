const express = require('express');
const router = express.Router();
const controller = require('./edukasi.controller');

router.get('/', controller.getRoot);
router.get('/articles', controller.listArticles);

module.exports = router;
