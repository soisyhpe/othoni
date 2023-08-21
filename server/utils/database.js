const { MongoClient } = require('mongodb');
const logger = require('../middleware/logger');

const { dbName, mongoUri } = require('../config/config');

class Database {
  constructor() {
    this.client = new MongoClient(mongoUri, { useUnifiedTopology: true });
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(dbName);
      logger.info('Connected to MongoDB');
    } catch (error) {
      logger.error('Error connecting to MongoDB:', error);
    }
  }

  async close() {
    await this.client.close();
    logger.info('Disconnected from MongoDB');
  }
}

module.exports = new Database();