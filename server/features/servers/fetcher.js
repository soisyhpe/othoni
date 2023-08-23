const mc = require('minecraft-protocol');
const logger = require('../../middleware/logger');
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
    const currentDate = new Date();
    currentDate.setSeconds(0, 0); // Reset seconds and milliseconds to 0

    for (const server of servers) {
      try {
        const serverData = await fetchServerData(server);
        const playerCount = serverData.players.online;
        
        await ServerServices.recordServerActivity(server, playerCount, currentDate);
        logger.info(`Recorded activity for server: ${server.host}:${server.port}`);
      } catch (error) {
        logger.error(`Failed to fetch data for server: ${server.host}:${server.port}`, error);
      }
    }

    logger.info('Data fetching and recording completed.');
  } catch (error) {
    logger.error('Failed to fetch and record data for servers:', error);
  }
}

module.exports = {
  fetchServersData,
};