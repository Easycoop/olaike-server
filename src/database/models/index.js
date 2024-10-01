'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const ENV = process.env.NODE_ENV || 'DEV';
const config = require('../config/config.js');
const { logger: logger } = require('../../middlewares/logger.js');
const { Console } = require('console');
const db = {};

let sequelize;

switch (ENV) {
    case 'TEST':
        sequelize = new Sequelize(config.testing.database, config.testing.username, config.testing.password, {
            host: config.testing.host,
            dialect: config.testing.dialect,
            pool: {
                max: 5,
                min: 0,
                idle: 10000,
            },
            logging: false,
        });
        break;
    case 'PROD':
        sequelize = new Sequelize(config.production.database, config.production.username, config.production.password, {
            host: config.production.host,
            dialect: config.production.dialect,
            port: config.production.port,
            pool: {
                max: 5,
                min: 1,
                idle: 10000,
            },
            // ssl: false,
            logging: false,
            dialectOptions: config.production.dialectOptions,
        });
        break;
    default:
        sequelize = new Sequelize(
            config.development.database,
            config.development.username,
            config.development.password,
            {
                host: config.development.host,
                dialect: config.development.dialect,
                port: config.development.port,
                pool: {
                    max: 5,
                    min: 1,
                    idle: 10000,
                },
                ssl: false,
                logging: false,
                dialectOptions: config.development.dialectOptions,
            },
        );
}
fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({ force: false }).then(() => {
    logger.info('re-sync completed');
});

module.exports = db;
