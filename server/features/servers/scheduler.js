const logger = require('../../middleware/logger');
const { fetchInterval } = require('../../config/config');
const { fetchServersData } = require('./fetcher');

function scheduleTask() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const millisecondsUtilNextExecution = (fetchInterval - (minutes % fetchInterval)) * 60000 - seconds * 1000;

  logger.info(`Scheduling task for data fetching in ${millisecondsUtilNextExecution} milliseconds.`);

  setTimeout(() => {
    logger.info('Executing data fetching task...');
    fetchServersData();
    // TO-DO : push data to database
    logger.info('Data fetching task executed.');
    
    scheduleTask();
  }, millisecondsUtilNextExecution);
}

logger.info('Starting scheduling of data fetching tasks...');
scheduleTask();