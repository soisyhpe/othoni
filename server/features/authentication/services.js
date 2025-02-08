const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { usersCollection } = require('../../config/config');
const logger = require('../../middleware/logger');
const { withDatabase } = require('../../utils/database');

const AuthenticationServices = {

  async generateToken(userId) {
    try {
      const expiresIn = '1h';
      const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn });

      const expirationTimestamp = Math.floor(Date.now() / 1000) + parseInt(expiresIn, 10);
      const expirationDate = new Date(expirationTimestamp * 1000).toISOString();
  
      return { token, expirationDate: expirationDate };
    } catch (error) {
      logger.error('Error generating JWT token.');
      logger.debug(`Error details:`, error);
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
      const hashedPassword = await bcrypt.hash(password, 10);
      return await withDatabase(async (database) => {
        const collection = database.db.collection(usersCollection);
        const user = { username, hashedPassword };
        await collection.insertOne(user);
        logger.info('User created:', username);
      });
    } catch (error) {
      logger.error(`Error creating user with username ${username}`);
      logger.debug(`Error details:`, error);
      throw error;
    }
  },

  async deleteUser(username) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(usersCollection);
        const result = await collection.deleteOne( { username: username } );

        if (result.deletedCount > 0) {
          logger.info(`User ${username} deleted from the database`);
        } else {
          logger.warn(`User ${username} not found in the database`);
        }

        return result.deletedCount;
      });
    } catch (error) {
      logger.error(`Failed to delete user ${username} from the database.`);
      logger.debug(`Error details:`, error);
      throw error;
    }
  },

  async findUserByUsername(username) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(usersCollection);
        const user = await collection.findOne({ username });
        return user;
      });
    } catch (error) {
      logger.error(`Error finding user with username ${username}`);
      logger.debug(`Error details:`, error);
      throw error;
    }
  },

  async getUsers(offset = 0, limit = null) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(usersCollection);
        const query = collection.find({}).skip(offset).limit(limit !== null ? limit : 0);
        const result = await query.toArray();
        logger.info(`Retrieved ${result.length} users from the database`);
        return result;
      });
    } catch (error) {
      logger.error('Failed to get user list.');
      logger.debug(`Error details:`, error);
      throw error;
    }
  },
}

module.exports = AuthenticationServices;