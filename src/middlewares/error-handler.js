const { CustomAPIError } = require('../utils/error');
const { logger } = require('./logger');
const { ZodError } = require('zod');
const { JsonWebTokenError } = require('jsonwebtoken');

function errorHandler(err, req, res, next) {
    const customError = {
        // set default
        statusCode: err.statusCode || 500,
        msg: err.message || 'Something went wrong, try again later',
    };

    logger.error(err.stack);

    if (err instanceof CustomAPIError && err.statusCode !== 500) {
        return res.status(err.statusCode).send({
            status: 'error',
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).send({
            status: 'error',
            errors: err.errors,
            message: 'Validation Error',
        });
    }

    if (err instanceof JsonWebTokenError) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({
                status: 'error',
                message: 'Token Expired',
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).send({
                status: 'error',
                message: 'Invalid Token',
            });
        }
    }

    // Handle Sequelize duplicate key error
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.statusCode = 400;
    }

    // Handle Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        customError.msg = 'File size is too large. Max size is 1MB';
        customError.statusCode = 400;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        customError.msg = 'Only images are allowed';
        customError.statusCode = 400;
    }

    // Handle Sequelize errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        const errorItem = err.errors[0] ? err.errors[0] : err.errors.ValidationErrorItem;
        customError.msg = errorItem
            ? errorItem.message
            : `The ${Object.keys(err.fields || {}).join(', ')} value provided has already been registered or taken`;
        customError.statusCode = 400;
    } else if (err.name === 'SequelizeValidationError') {
        customError.msg = err.errors.map((e) => e.message).join(', ');
        customError.statusCode = 400;
    }
    if (err.name === 'SequelizeDatabaseError') {
        customError.msg = err.message;
        customError.statusCode = 400;
    }

    // if the error is not one of the specific types above, return a generic internal server error
    return res.status(500).send({ status: 'error', message: 'Ops, Something went wrong' });
}

module.exports = { errorHandler };
