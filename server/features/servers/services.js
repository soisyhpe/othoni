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
        const document = { host: server.host, port: server.port, player_count: player_count, date: date };
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
        const servers = database.db.collection(serversCollection);
        const monitoring = database.db.collection(monitoringCollection);

        const aggregationPipeline = [
          {
            $match: {
              host: server.host,
              port: server.port
            }
          },
          {
            $lookup: {
              from: monitoring.collectionName,
              localField: 'host',
              foreignField: 'host',
              as: 'monitoringData'
            }
          },
          {
            $unwind: '$monitoringData'
          },
          {
            $group: {
              _id: {
                _id: '$_id',
                host: '$host',
                port: '$port',
                favicon: '$favicon'
              },
              maxPlayerCount: { $max: '$monitoringData.player_count' },
              maxPlayerCountDate: { $max: '$monitoringData.date' }
            }
          },
          {
            $project: {
              _id: '$_id._id',
              host: '$_id.host',
              port: '$_id.port',
              favicon: '$_id.favicon',
              player_count_record: '$maxPlayerCount',
              player_count_record_date: '$maxPlayerCountDate'
            }
          }
        ];

        const result = await servers.aggregate(aggregationPipeline).toArray();

        if (result.length === 0) {
          logger.warn(`No data found for server ${server.host}:${server.port}`);
          return null;
        }

        logger.info(`Retrieved data for server ${server.host}:${server.port}`);
        return result[0]; // Assuming there will be only one result
        
      });
    } catch (error) {
      logger.error(`Failed to get data for server ${server.host}:${server.port}.`);
      logger.debug(`Error details:`, error);
      throw error;
    }
  }

}

module.exports = ServerServices;