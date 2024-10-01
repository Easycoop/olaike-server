require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'DEV';
const JWT_SECRET = process.env.JWT_SECRET;

// Redis
const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

module.exports = {
    NODE_ENV,
    JWT_SECRET,
    REDIS_PASSWORD,
    REDIS_PORT,
    REDIS_HOST,
    REDIS_URL,
};
