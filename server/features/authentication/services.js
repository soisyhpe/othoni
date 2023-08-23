const jwt = require('jsonwebtoken');
const logger = require('../../middleware/logger');
const { withDatabase } = require('../../utils/database');

const AuthenticationServices = {

  async generateToken(userId) {
    try {
      const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
      return token;
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw error;
    }
  },
  
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return decoded.userId;
    } catch (error) {
      logger.error('Error verifying JWT token:', error);
      throw error;
    }
  },

  async createUser(username, password) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection('users');
        const user = { username, password };
        await collection.insertOne(user);
        logger.info('User created:', username);
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  },

  async deleteUser(username) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection('users');
        const result = await collection.deleteOne( { username: username } );

        if (result.deletedCount > 0) {
          logger.info(`User ${username} deleted from the database`);
        } else {
          logger.warn(`User ${username} not found in the database`);
        }

        return result.deletedCount;
      });
    } catch (error) {
      logger.error(`Failed to delete user ${username} from the database:`, error);
      throw error;
    }
  },

  async findUserByUsername(username) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection('users');
        const user = await collection.findOne({ username });
        return user;
      });
    } catch (error) {
      logger.error('Error finding user:', error);
      throw error;
    }
  },

  async getUsers(offset = 0, limit = null) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection('users');
        const query = collection.find({}).skip(offset).limit(limit !== null ? limit : 0);
        const result = await query.toArray();
        logger.info(`Retrieved ${result.length} users from the database`);
        return result;
      });
    } catch (error) {
      logger.error('Failed to get user list:', error);
      throw error;
    }
  },
}

module.exports = AuthenticationServices;