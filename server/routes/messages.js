const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/getMessages', messagesController.getMessages);

module.exports = router;
