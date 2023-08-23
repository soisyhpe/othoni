const { MongoClient } = require('mongodb');
const logger = require('../middleware/logger');

class Database {
  constructor() {
    this.client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME);
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

async function withDatabase(fn) {
  const database = new Database();

  try {
    await database.connect();
    return await fn(database);
  } catch(error) {
    logger.error('An error occurred:', error);
    throw error;
  } finally {
    await database.close();
  }
}

module.exports = {
  Database,
  withDatabase
};