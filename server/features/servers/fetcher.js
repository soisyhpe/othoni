const mc = require('minecraft-protocol');
const { monitoringCollection } = require('../../config/config');
const logger = require('../../middleware/logger');
const { withDatabase } = require('../../utils/database');
const ServerServices = require('./services');

async function fetchServerData(server) {
  try {
    logger.info(`Fetching data from ${server.host}:${server.port}`);
    const data = await mc.ping(server);
    logger.info(`Data fetched from ${server.host}:${server.port}`, data);
    return data;
  } catch(error) {
    logger.error(`Error fetching data from ${server.host}:${server.port}`, error);
    return null;
  }
}

async function fetchServersData() {
  try {
    const servers = await ServerServices.getServers();

    const batchOperations = [];
    for (const server of servers) {
      const serverData = await fetchServerData(server);
      
      if (serverData) {
        const playerCount = serverData.players.online;
        const currentDate = new Date();
        currentDate.setSeconds(0, 0);
        batchOperations.push({
          insertOne: {
            document : {
              host: server.host, 
              player_amount: playerCount, 
              date: currentDate
            }
          }
        });
      }
    }

    await withDatabase(async (database) => {
      const collection = database.db.collection(monitoringCollection);
      const session = database.client.startSession();
      session.startTransaction();
      try {
        await collection.bulkWrite(batchOperations, { session });
        await session.commitTransaction();
        logger.info('Data fetching and recording completed.');
      } catch (error) {
        await session.abortTransaction();
        logger.error('Failed to fetch and record data for servers:', error);
        throw error;
      } finally {
        session.endSession();
      }
    });
  } catch (error) {
    logger.error('An error occurred during server data fetching:', error);
  }
}

module.exports = {
  fetchServersData,
};