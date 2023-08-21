const logger = require('../../middleware/logger');
const mc = require('minecraft-protocol');

const { 
  HTTP_STATUS, 
  servers
} = require('../../utils/constantsAndFunctions');

const serversData = new Map();

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

function getServerData(requestedServer) {
  var serverData;
  for (const server of serversData) {
    if (server[0].host === requestedServer.host && server[0].port === requestedServer.port) serverData = server[1];
  }

  if (serverData) {
    logger.info(`Retrieved data for ${requestedServer.host}:${requestedServer.port}`);
    return [HTTP_STATUS.OK, serverData]
  } else {
    logger.warn(`No data found for ${requestedServer.host}:${requestedServer.port}`);
    return [HTTP_STATUS.BAD_REQUEST, { "Error": `'${requestedServer.host}:${requestedServer.port}' is registered but has no data in our database!` }];
  }
}

function fetchServersData() {
  logger.info("Fetching data from all servers...");
  
  const requests = servers.map(fetchServerData);
  const result = Promise.all(requests);

  result.then((data) => {
    servers.forEach((server, index) => {
      serversData.set( { 'host': server.host, 'port': server.port } , data[index]);
    })

    logger.info("Data fetched and updated for all servers.");
  });
}

module.exports = {
  fetchServersData,
  getServerData,
};