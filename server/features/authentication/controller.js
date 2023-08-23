const logger = require('../../middleware/logger');
const AuthenticationService = require('./services');

const {
  HTTP_STATUS
} = require('../../utils/constantsAndFunctions');

const AuthenticationController = {

  async registerUser(req, res) {
    const { username, password } = req.body;
    try {
      await AuthenticationService.createUser(username, password);
      logger.info(`User created successfully: ${username}`);
      res.status(HTTP_STATUS.CREATED).json({ message: 'User created successfully' });
    } catch (error) {
      logger.warn(`Failed to create user: ${username}`);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create user' });
    }
  },

  async deleteUser(req, res) {
    try {
      const username = req.params.username;
      const result = await AuthenticationService.deleteUser(username);

      if (result > 0) {
        res.status(HTTP_STATUS.ACCEPTED).json({ message: 'User deleted', deletedCount: result });
      } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error('Unable to delete user:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'User deletion failed' });
    }
  },

  async getUsers(req, res) {
    try {
      const offset = req.params.offset || 0;
      const limit = req.params.limit || 10;
      const users = await AuthenticationService.getUsers(offset, limit);
      res.status(HTTP_STATUS.OK).json(users);
    } catch (error) {
      logger.warn('Failed to retrieve all users.')
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve users.' });
    }
  },

  async loginUser(req, res) {
    const { username, password } = req.body;
    try {
      const user = await AuthenticationService.findUserByUsername(username);
      if (!user || user.password !== password) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        return;
      }
      const token = await AuthenticationService.generateToken(user._id);
      logger.info(`Login successful for username: ${username}`);
      res.status(HTTP_STATUS.OK).json({ token });
    } catch (error) {
      logger.warn(`Login failed for username: ${username}`);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to authenticate' });
    }
  }
}

module.exports = AuthenticationController;