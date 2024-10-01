const env = process.env.NODE_ENV;
const db = require('./models');
const { logger: logger } = require('../middlewares/logger');
const { connectToRedisDatabase } = require('./redis');
require('dotenv').config();

async function initializeDatabaseConnection() {
    // Test the db connection
    db.sequelize
        .authenticate()
        .then(() => {
            logger.info('postgres connection has been established successfully. -- ' + env);
        })
        .catch((err) => {
            logger.error('Unable to connect to the database:', err);
            if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
                logger.error('The database is disconnected. Please check the connection and try again.');
            } else {
                logger.error('An error occured while connecting to the database:', err);
            }
        });

    // Test the Redis connection
    connectToRedisDatabase();

    await logger.info('Connection to databases is established');
}

module.exports = { initializeDatabaseConnection };
