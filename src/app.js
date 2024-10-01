require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { routeHandler } = require('./routes');
const { errorHandler } = require('./middlewares/error-handler');
const swaggerDocs = require('../swagger');
const swaggerUi = require('swagger-ui-express');

const app = express();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

const corsOptions = {
    origin: ALLOWED_ORIGINS,
    optionsSuccessStatus: 200,
    sameSite: 'none',
    credentials: true, // enable set cookie
};
function initializeMiddlewares(app) {
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(express.json({ limit: '150mb' }));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
}

function initializeRouteHandlers(app) {
    app.get('/', (_req, res) => {
        res.status(200).send({
            status: 'success',
            message: 'Welcome to the API',
        });
    });
    app.use('/api/v1', routeHandler);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use(errorHandler);
    app.all('*', (_req, res) => {
        res.status(404).send({
            status: 'error',
            message: 'Route not found',
        });
    });
}

function initializeExpressServer() {
    initializeMiddlewares(app);
    initializeRouteHandlers(app);
    return app;
}

module.exports = { initializeExpressServer, app };
