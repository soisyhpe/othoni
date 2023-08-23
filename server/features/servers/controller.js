const cache = require('memory-cache');
const { check, param, validationResult } = require('express-validator');
const { defaultOffset, defaultLimit, cacheExpirationInMilliseconds } = require('../../config/config');
const logger = require('../../middleware/logger');
const { HTTP_STATUS, SERVER_WITH_PORT_REGEX } = require('../../utils/constantsAndFunctions');
const ServerServices = require('./services');

const ServerController = {

  // Validation des données pour l'ajout d'un serveur
  addServerValidations: [
    check('host').notEmpty().withMessage('Host is required'),
    check('port').notEmpty().withMessage('Port is required')
  ],

  // Ajout d'un serveur
  async addServer(req, res) {
    logger.info("Received request for server addition.");

    validationCheck(req, res);

    const { host, port } = req.body;

    try {
      await ServerServices.addServer({ host: host, port: port });

      const cachedKey = `servers_${defaultOffset}_${defaultLimit}`;
      const cachedServers = cache.get(cachedKey);

      if (cachedServers) {
        cachedServers.push({ host: host, port: port });
        cache.put(cachedKey, cachedServers, cacheExpirationInMilliseconds);
        logger.debug(`Added server to cache: ${host}:${port}`);
      }

      res.status(HTTP_STATUS.CREATED).json({ message: 'Server added', host: host });
    } catch (error) {
      if (error.code === 11000) {
        logger.error('Duplicate key error:', error);
        res.status(HTTP_STATUS.CONFLICT).json({ error: 'Server already exists' });
      } else {
        logger.error('Unable to add server:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Server addition failed' });
      }
    }
  },

  // Suppression d'un serveur
  deleteServerValidations: [
    param('server_address_with_port').matches(SERVER_WITH_PORT_REGEX).withMessage((value, { req }) => `'${value}' is not a valid minecraft server address!`)
  ],

  async deleteServer(req, res) {
    logger.info("Received request for delete server.");

    validationCheck(req, res);

    const server = req.params.server_address_with_port;

    try {
      const [host, port] = server.split(':');
      const result = await ServerServices.deleteServer({ host: host, port: port });

      if (result > 0) {
        const cachedKey = `servers_${defaultOffset}_${defaultLimit}`;
        const cachedServers = cache.get(cachedKey);

        if (cachedServers) {
          const updatedCachedServers = cachedServers.filter(s => s.host !== host || s.port !== port);
          cache.put(cachedKey, updatedCachedServers, cacheExpirationInMilliseconds);
          logger.debug(`Removed server from cache: ${host}:${port}`);
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

  // Récupération des serveurs
  async getServers(req, res) {
    logger.info("Received request for server list.");

    validationCheck(req, res);

    const offset = req.params.offset || defaultOffset;
    const limit = req.params.limit || defaultLimit;

    try {
      const cacheKey = `servers_${offset}_${limit}`;
      const cachedResult = cache.get(cacheKey);

      if (cachedResult) {
        logger.debug('Retrieved server list from cache.');
        res.status(HTTP_STATUS.OK).json(cachedResult);
      }

      const result = await ServerServices.getServers(offset, limit);
      cache.put(cacheKey, result, cacheExpirationInMilliseconds);
      res.status(HTTP_STATUS.OK).json(result);

      logger.info("Server list sent.");
    } catch (error) {
      logger.error('Failed to get server list:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to get servers' });
    }
  },

  // Récupération d'un serveur
  getServerValidations: [
    param('server_address_with_port').matches(SERVER_WITH_PORT_REGEX).withMessage((value, { req }) => `'${value}' is not a valid minecraft server address!`)
  ],

  async getServer(req, res) {
    logger.info(`Received request for server data`);

    validationCheck(req, res);

    const serverAddressWithPort = req.params.server_address_with_port;
    const [serverAddress, serverPort] = serverAddressWithPort.split(':');
    const server = { host: serverAddress, port: Number.parseInt(serverPort) || 25565 };

    const cachedKey = `server_${serverAddressWithPort}`;
    const cachedServerData = cache.get(cachedKey);

    if (cachedServerData) {
      logger.debug(`Data retrieved from cache for server: ${serverAddressWithPort}`);
      return res.status(HTTP_STATUS.OK).json(cachedServerData);
    }

    try {
      const serverData = await ServerServices.getServer(server);

      if (!serverData) {
        logger.warn(`Server not registered: ${serverAddressWithPort}`);
        res.status(HTTP_STATUS.NOT_FOUND).json({ 'Error': `Failed to find recorded data for '${serverAddressWithPort}' in our database!` });
      } else {
        cache.put(cachedKey, serverData, cacheExpirationInMilliseconds);
        logger.debug(`Data retrieved for server: ${serverAddressWithPort}`);
        res.status(HTTP_STATUS.OK).json(serverData);
      }
    } catch (error) {
      logger.error(`Failed to retrieve data for server: ${serverAddressWithPort}`, error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 'Error': 'Failed to retrieve server data' });
    }
  }
};

// Fonction pour vérifier les erreurs de validation et renvoyer une réponse en cas d'erreur
function validationCheck(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.debug('Validation errors:', errors.array());
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
  }
} 

module.exports = ServerController;
