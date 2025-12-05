const express = require('express');
const router = express.Router();
const controller = require('./mental.controller');

router.get('/', controller.getRoot);
router.post('/mood', controller.createMood);

module.exports = router;
