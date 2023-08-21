const express = require('express');
const authorizationController = require('./controller');

const router = express.Router();

// Route to authenticate and generate JWT token
router.post('/login', authorizationController.login);

module.exports = router;