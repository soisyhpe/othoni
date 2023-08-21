const logger = require('../../middleware/logger');

const {
  HTTP_STATUS,
  SERVER_WITH_PORT_REGEX,
  servers
} = require('../../utils/constantsAndFunctions');

function getServer(req, res) {
  const serverAddressWithPort = req.params.server_address_with_port;

  logger.info(`Received request for server data: ${serverAddressWithPort}`);

  // check if serverAddress match regex
  if (!serverAddressWithPort.match(SERVER_WITH_PORT_REGEX)) {
    logger.warn(`Invalid server address: ${serverAddressWithPort}`);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      "Error": `'${serverAddressWithPort}' is not a correct minecraft server address!`
    });
  }

  const [serverAddress, serverPort] = serverAddressWithPort.split(':');
  const server = { host: serverAddress, port: Number.parseInt(serverPort) || 25565 };

  // check if serverAddress is registered
  if (!servers.some(s => s.host === server.host && s.port === server.port)) {
    logger.warn(`Server not registered: ${serverAddressWithPort}`);
    res.status(HTTP_STATUS.NOT_FOUND).json({
        "Error": `'${serverAddressWithPort}' is not registered in our database!`
      });
  } else {
    logger.info(`Fetching data for server: ${serverAddressWithPort}`);
    const [status, serverData] = getServerData(server);
    logger.info(`Data fetched for server: ${serverAddressWithPort}, status: ${status}`);
    res.status(status).json(serverData);
  }
}

function getServers(req, res) {
  logger.info("Received request for server list.");
  res.json(servers);
  logger.info("Server list sent.");
}

module.exports = { getServer, getServers };