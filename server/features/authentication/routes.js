const express = require('express');
const AuthenticationController = require('./controller');
const { verifyToken } = require('../../middleware/token');

const router = express.Router();

router.post('/register', AuthenticationController.registerUserValidations, AuthenticationController.registerUser);
// TODO: router.delete('/:username', AuthenticationController.deleteUserValidations, AuthenticationController.deleteUser);
// TODO: router.get('', AuthenticationController.getUsers);
router.post('/login', AuthenticationController.loginValidationRules, AuthenticationController.loginUser);

module.exports = router;