const { MongoClient } = require('mongodb');
const { usersCollection, serversCollection, monitoringCollection } = require('../config/config');
const logger = require('../middleware/logger');

class Database {
  constructor() {
    this.client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
    this.indexes = [
      { collection: usersCollection, keys: { username: 1 }, options: { unique: true, background: true } },
      { collection: serversCollection, keys: { host: 1, port: 1 }, options: { unique: true, background: true } },
      { collection: monitoringCollection, keys: { host: 1, date: 1 }, options: { unique: true } },
      { collection: monitoringCollection, keys: { date: 1 }, options: { background: true } }
    ];
  }

  async createIndexes() {
    for (const index of this.indexes) {
      const { collection, keys, options } = index;
      await this.db.collection(collection).createIndex(keys, options);
    }
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME);

      // Mise en place des index
      await this.createIndexes();

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