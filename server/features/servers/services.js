const logger = require('./logger');
const database = require('./database');

const ServerServices = {

  async pushData(server, player_amount, date) {
    try {
      await database.connect();
      const collection = database.db.collection('monitoring');
      
      const document = { host: server.host, player_amount: player_amount, date: date };
      
      const result = await collection.insertOne(document);
      logger.info('Data inserted:', result.insertedId);
      return result.insertedId;
    } catch (error) {
      logger.error('An error occurred:', error);
      throw error;
    } finally {
      database.close();
    }
  }

}

module.exports = ServerServices;