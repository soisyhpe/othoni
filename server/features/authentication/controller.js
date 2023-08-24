const { body, param } = require('express-validator');
const bcrypt = require('bcrypt');
const logger = require('../../middleware/logger');
const { validationCheck } = require('../../middleware/validation');
const AuthenticationService = require('./services');
const { USER_PASSWORD_REGEX } = require('../../utils/constantsAndFunctions');

const {
  HTTP_STATUS
} = require('../../utils/constantsAndFunctions');

const AuthenticationController = {

  // Validation des données pour l'inscription d'un utilisateur
  registerUserValidations: [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 16 }).withMessage('Username must be between 3 and 16 characters'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .matches(USER_PASSWORD_REGEX).withMessage('Password must be at least 8 characters long and contain at least one digit, one lowercase letter, and one uppercase letter')
  ],

  async registerUser(req, res) {
    const { username, password } = req.body;

    validationCheck(req, res);

    try {
      await AuthenticationService.createUser(username, password);
      logger.info(`User created successfully: ${username}`);
      res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully' });
    } catch (error) {
      if (error.code === 11000) {
        logger.error('Duplicate key error.');
        logger.debug(`Error details:`, error);
        res.status(HTTP_STATUS.CONFLICT).json({ error: 'User with the same username already exists' });
      } else {
        logger.warn(`Failed to create user: ${username}`);
        logger.debug(`Error details:`, error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create user' });
      }
    }
  },

  // Validation des données pour la suppression d'un utilisateur
  deleteUserValidations: [
    param('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 16 }).withMessage('Username must be between 3 and 16 characters')
  ],

  async deleteUser(req, res) {
    const username = req.params.username;

    validationCheck(req, res);

    try {
      const result = await AuthenticationService.deleteUser(username);

      if (result > 0) {
        res.status(HTTP_STATUS.ACCEPTED).json({ message: 'User deleted', deletedCount: result });
      } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error(`Unable to delete user: ${username}`);
      logger.debug(`Error details:`, error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'User deletion failed' });
    }
  },

  async getUsers(req, res) {
    validationCheck(req, res);

    const offset = req.params.offset || 0;
    const limit = req.params.limit || 10;

    try {
      const users = await AuthenticationService.getUsers(offset, limit);
      res.status(HTTP_STATUS.OK).json(users);
    } catch (error) {
      logger.warn('Failed to retrieve all users.')
      logger.debug(`Error details:`, error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve users.' });
    }
  },

  // Validation des données pour la connexion d'un utilisateur
  loginUserValidations: [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 16 }).withMessage('Username must be between 3 and 16 characters'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .matches(USER_PASSWORD_REGEX).withMessage('Password must be at least 8 characters long and contain at least one digit, one lowercase letter, and one uppercase letter')
  ],

  async loginUser(req, res) {
    validationCheck(req, res);

    const { username, password } = req.body;
    logger.info(`User '${username}' is logging in...`);

    try {
      const user = await AuthenticationService.findUserByUsername(username);

      if (!user || !bcrypt.compare(password, user.password)) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        return;
      }

      const token = await AuthenticationService.generateToken(user._id);
      logger.info(`Login successful for username: ${username}`);
      res.status(HTTP_STATUS.OK).json({ token });
    } catch (error) {
      logger.warn(`Login failed for username: ${username}`);
      logger.debug(`Error details:`, error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to authenticate' });
    }
  }
}

module.exports = AuthenticationController;