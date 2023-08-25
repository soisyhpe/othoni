const { body, param } = require('express-validator');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const logger = require('../../middleware/logger');
const { USER_PASSWORD_REGEX } = require('../../utils/constantsAndFunctions');
const AuthenticationService = require('./services');

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(`Error details:`, errors.array());
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

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
  ],

  async deleteUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    const username = req.params.username;

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

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
  loginValidationRules: [
    body('username')
      .notEmpty().withMessage('Username is required'),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],

  async loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    logger.info(`User '${username}' is logging in...`);

    try {
      const user = await AuthenticationService.findUserByUsername(username);

      if (!user) {
        logger.error(`Username not found: ${username}`);
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Username not found' });
        return;
      }
      
      if (!bcrypt.compare(password, user.hashedPassword)) {
        logger.error(`Incorrect password for username: ${username}`);
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Incorrect password' });
        return;
      }

      const tokenData = await AuthenticationService.generateToken(user._id);
      logger.info(`Login successful for username: ${username}`);
      res.status(HTTP_STATUS.OK).json(tokenData);

    } catch (error) {
      logger.error(`Login failed for username: ${username}`);
      logger.debug(`Error details:`, error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to authenticate' });
    }
  }
}

module.exports = AuthenticationController;