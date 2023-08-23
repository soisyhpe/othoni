const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');

const app = express();
const API_PATH = "/api/v1";

logger.info("Starting application...");

// Initialize .env
function initEnvironment() {
  require('dotenv').config();
  logger.info(process.env.PORT);
  logger.info(process.env.MONGO_URI);
}

// Initialize configuration
function initConfig() {
  const config = require('./config/config');
  if (!config.fetchInterval) {
    logger.error('Configuration values are missing.');
    process.exit(1);
  } else {
    logger.info(`Port configuration: ${config.port}`);
    logger.info(`Fetch interval configuration: ${config.fetchInterval} minutes`);
  }
  return config;
}

// Initialize authorization
function initAuthorization() {
  app.use(bodyParser.json());
}

// Initialize scheduled task
function initScheduledTask() {
  const scheduler = require('./features/servers/scheduler');
  logger.info('Scheduled task started.');
}

// Initialize routes
function initRoutes() {
  // authentication routes
  const authenticationRoutes = require('./features/authentication/routes');
  app.use(API_PATH + "/authentication", authenticationRoutes);
  logger.info(`Routes set up for ${API_PATH}/authentication`);

  // servers routes
  const serversRoutes = require('./features/servers/routes');
  app.use(API_PATH + "/servers", serversRoutes);
  logger.info(`Routes set up for ${API_PATH}/servers`);
}

// Initialize error handler middleware
function initErrorHandler() {
  const errorHandler = require('./middleware/errorHandler');
  app.use(errorHandler);
  logger.info('Error handler middleware set up.');
}

// Start the server
function startServer() {
  const port = process.env.PORT;
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

// Initialize the application
function initializeApp() {
  initEnvironment();
  initConfig();
  initAuthorization();
  initScheduledTask();
  initRoutes();
  initErrorHandler();
  startServer();
}

initializeApp();