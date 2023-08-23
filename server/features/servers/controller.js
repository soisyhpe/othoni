const logger = require('../../middleware/logger');

const {
  HTTP_STATUS,
  SERVER_WITH_PORT_REGEX,
  servers
} = require('../../utils/constantsAndFunctions');

const ServerServices = require('./services');

const ServerController = {

  async addServer(req, res) {
    const { host, port } = req.body;

    if (!host || !port) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Host and port are required' });
    }

    try {
      const result = await ServerServices.addServer({ host: host, port: port });
      res.status(HTTP_STATUS.CREATED).json({ message: 'Server added', host: host });
    } catch (error) {
      logger.error('Unable to add server:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Server addition failed' });
    }
  },

  async deleteServer(req, res) {
    try {
      const server = req.params.server_address_with_port;
      const [ host, port ] = server.split(':');
      const result = await ServerServices.deleteServer({ host: host, port: port });
      
      if (result > 0) {
        res.status(HTTP_STATUS.ACCEPTED).json({ message: 'Server deleted', deletedCount: result });
      } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Server not found' });
      }
    } catch (error) {
      logger.error('Unable to delete server:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Server deletion failed' });
    }
  },

  async getServers(req, res) {
    try {
      logger.info("Received request for server list.");
      const result = await ServerServices.getServers();
      res.status(HTTP_STATUS.OK).json(result);
      logger.info("Server list sent.");
    } catch (error) {
      logger.error('Failed to get server list:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get servers' });
    }
    res.json(servers);
  },

  async getServer(req, res) {
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
}

module.exports = ServerController;