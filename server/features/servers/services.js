const logger = require('../../middleware/logger');
const { serversCollection, monitoringCollection } = require('../../config/config');
const { withDatabase } = require('../../utils/database');

const ServerServices = {

  async addServer(server) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(serversCollection);
        const result = await collection.insertOne(server);
        logger.info(`Server ${server.host}:${server.port} added to the database`);
        return result.insertedId;
      });
    } catch (error) {
      logger.error(`Failed to add server ${server.host}:${server.port} to the database:`, error);
      throw error;
    }
  },
  
  async deleteServer(server) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(serversCollection);
        const result = await collection.deleteOne(server);
        
        if (result.deletedCount > 0) {
          logger.info(`Server ${server.host}:${server.port} deleted from the database`);
        } else {
          logger.warn(`Server ${server.host}:${server.port} not found in the database`);
        }

        return result.deletedCount;
      });
    } catch (error) {
      logger.error(`Failed to delete server ${server.host}:${server.port} from the database:`, error);
      throw error;
    }
  },

  async getServers(offset = 0, limit = null) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(serversCollection);
        const query = collection.find({}).skip(offset).limit(limit !== null ? limit : 0);
        const result = await query.toArray();
        logger.info(`Retrieved ${result.length} servers from the database`);
        return result;
      });
    } catch (error) {
      logger.error('Failed to get servers list:', error);
      throw error;
    }
  },

  async recordServerActivity(server, player_count, date) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(monitoringCollection);
        const document = { host: server.host, player_amount: player_count, date: date };
        const result = await collection.insertOne(document);
        logger.info(`Data inserted for server ${server.host}:${server.port}, ID: ${result.insertedId}`);
        return result.insertedId;
      });
    } catch (error) {
      logger.error('Failed to push data:', error);
      throw error;
    }
  },

  async updateFavicon(server, favicon) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(serversCollection);
  
        const filter = { host: server.host, port: server.port };
        const update = { $set: { favicon: favicon } };
  
        await collection.updateOne(filter, update);
  
        logger.debug(`Favicon updated for server: ${server.host}:${server.port}`);
      });
    } catch (error) {
      logger.error(`Failed to update favicon for server: ${server.host}:${server.port}`);
      logger.debug(`Error details:`, error);
      throw error;
    }
  },

  async getServer(server) {
    try {
      return await withDatabase(async (database) => {
        const collection = database.db.collection(monitoringCollection);
        const result = await collection.find(server).toArray();
        
        if (result.length === 0) {
          logger.warn(`No data found for server ${server.host}:${server.port}`);
          return null;
        }

        logger.info(`Retrieved ${result.length} data entries for server ${server.host}:${server.port}`);
        return result;
      });
    } catch (error) {
      logger.error(`Failed to get data for server ${server.host}:${server.port}:`, error);
      throw error;
    }
  }

}

module.exports = ServerServices;