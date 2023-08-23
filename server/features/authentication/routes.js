const express = require('express');
const AuthenticationController = require('./controller');

const {
  verifyToken
} = require('../../middleware/token');

const router = express.Router();

router.post('/register', AuthenticationController.registerUser);
router.delete('/:username', AuthenticationController.deleteUser);
router.post('/login', AuthenticationController.loginUser);
router.get('', AuthenticationController.getUsers);

module.exports = router;