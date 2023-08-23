const cache = require('memory-cache');
const { defaultOffset, defaultLimit } = require('../../config/config');
const logger = require('../../middleware/logger');
const { HTTP_STATUS, SERVER_WITH_PORT_REGEX } = require('../../utils/constantsAndFunctions');
const ServerServices = require('./services');

const ServerController = {

  async addServer(req, res) {
    logger.info("Received request for server addition.");
    const { host, port } = req.body;

    if (!host || !port) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Host and port are required' });
    }

    try {
      await ServerServices.addServer({ host: host, port: port });

      const cachedKey = `servers_${defaultOffset}_${defaultLimit}`;
      const cachedServers = cache.get(cachedKey); // Limit here

      if (cachedServers) {
        cachedServers.push({ host: host, port: port });
        cache.put(cachedKey, cachedServers, 60000); // Update cache for 1 minute
      }

      res.status(HTTP_STATUS.CREATED).json({ message: 'Server added', host: host });
    } catch (error) {
      logger.error('Unable to add server:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Server addition failed' });
    }
  },

  async deleteServer(req, res) {
    try {
      logger.info("Received request for delete server.");
      const server = req.params.server_address_with_port;
      const [host, port] = server.split(':');
      const result = await ServerServices.deleteServer({ host: host, port: port });
      
      if (result > 0) {
        const cachedKey = `servers_${defaultOffset}_${defaultLimit}`;
        const cachedServers = cache.get(cachedKey); // Limit here

        if (cachedServers) {
          const updatedCachedServers = cachedServers.filter(s => s.host !== host || s.port !== port);
          cache.put(cachedKey, updatedCachedServers, 60000); // Update cache for 1 minute
        }

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
      const offset = req.params.offset || defaultOffset;
      const limit = req.params.limit || defaultLimit;

      const cacheKey = `servers_${offset}_${limit}`;
      const cachedResult = cache.get(cacheKey);

      if (cachedResult) {
        logger.info('Retrieved server list from cache.');
        res.status(HTTP_STATUS.OK).json(cachedResult);
      }

      const result = await ServerServices.getServers(offset, limit);
      cache.put(cacheKey, result, 60000); // Cache the result for 1 minute
      res.status(HTTP_STATUS.OK).json(result);
      
      logger.info("Server list sent.");
    } catch (error) {
      logger.error('Failed to get server list:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get servers' });
    }
  },

  async getServer(req, res) {
    logger.info(`Received request for server data: ${serverAddressWithPort}`);
    const serverAddressWithPort = req.params.server_address_with_port;

    if (!serverAddressWithPort.match(SERVER_WITH_PORT_REGEX)) {
      logger.warn(`Invalid server address: ${serverAddressWithPort}`);
      res.status(HTTP_STATUS.BAD_REQUEST).json({ 'Error': `'${serverAddressWithPort}' is not a correct minecraft server address!` });
    }

    const [serverAddress, serverPort] = serverAddressWithPort.split(':');
    const server = { host: serverAddress, port: Number.parseInt(serverPort) || 25565 };

    try {
      const serverData = await ServerServices.getServer(server.host, server.port);
  
      if (!serverData) {
        logger.warn(`Server not registered: ${serverAddressWithPort}`);
        res.status(HTTP_STATUS.NOT_FOUND).json({ 'Error': `'${serverAddressWithPort}' is not registered in our database!` });
      } else {
        logger.info(`Data retrieved for server: ${serverAddressWithPort}`);
        res.status(HTTP_STATUS.OK).json(serverData);
      }
    } catch (error) {
      logger.error(`Failed to retrieve data for server: ${serverAddressWithPort}`, error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 'Error': 'Failed to fetch server data' });
    }
  }
}

module.exports = ServerController;