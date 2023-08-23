const express = require('express');
const AuthenticationController = require('./controller');

const {
  verifyToken
} = require('../../middleware/token');

const router = express.Router();

router.post('/register', AuthenticationController.registerUserValidations, AuthenticationController.registerUser);
router.delete('/:username', AuthenticationController.deleteUserValidations, AuthenticationController.deleteUser);
router.get('', AuthenticationController.getUsers);
router.post('/login', AuthenticationController.loginUserValidations, AuthenticationController.loginUser);

module.exports = router;