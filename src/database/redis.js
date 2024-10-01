const Redis = require('ioredis');
const { REDIS_URL } = require('../config');
const { REDIS_PORT } = require('../config');
const { REDIS_HOST } = require('../config');
const { REDIS_PASSWORD } = require('../config');

const { logger: logger } = require('../middlewares/logger');

// const redisClient = new Redis(REDIS_URL);

const redisClient = new Redis({ port: REDIS_PORT, host: REDIS_HOST, password: REDIS_PASSWORD });

function connectToRedisDatabase() {
    return redisClient;
}

redisClient.on('error', (error) => {
    logger.info('An error occurred while connecting to REDIS');
    logger.error(error);
    process.exit(1);
});

redisClient.on('connect', () => {
    logger.info('Connection to REDIS database successful');
});

module.exports = {
    connectToRedisDatabase,
    redisClient,
};
