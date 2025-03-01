const dotenv = require('dotenv');
const NODE_ENV = process.env.NODE_ENV || "DEV";

const path =
    NODE_ENV === 'TEST'
        ? __dirname + '/.env.test'
        : NODE_ENV === 'PROD'
          ? __dirname + '/.env.prod'
          : __dirname + '/.env.dev';
dotenv.config({ path });

const { logger: logger } = require('./middlewares/logger');
const { initializeExpressServer } = require('./app');
const { initializeDatabaseConnection } = require('./database');
const { startCrons } = require('./crons/startCrons');
const { initializeSocketIO } = require('./sockets/socket');

const PORT = process.env.PORT;

async function startServer() {
    await initializeDatabaseConnection();
    const app = initializeExpressServer();

    const server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
        logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });

    const io = initializeSocketIO(server);
}

startServer();
startCrons();
