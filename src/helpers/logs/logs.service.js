const { Logs } = require('../../database/models/index');

class LogService {
    static async createLog(
        action = 'SYSTEM',
        userId = null,
        type = 'system',
        description = 'log for specified action',
        details = null,
    ) {
        try {
            const log = await Logs.create({
                userId,
                action,
                type,
                description,
                details,
            });
            return log;
        } catch (error) {
            console.error('Failed to create log:', error.message);
            throw new Error('Log creation failed');
        }
    }

    static async getLogs(filter = {}) {
        try {
            const logs = await Logs.findAll({
                where: filter,
                order: [['createdAt', 'DESC']],
            });
            return logs;
        } catch (error) {
            console.error('Failed to fetch logs:', error.message);
            throw new Error('Log retrieval failed');
        }
    }

    static async deleteLog(logId) {
        try {
            const log = await Logs.findByPk(logId);
            if (!log) {
                throw new Error('Log not found');
            }
            await log.destroy();
            return { message: 'Log deleted successfully' };
        } catch (error) {
            console.error('Failed to delete log:', error.message);
            throw new Error('Log deletion failed');
        }
    }
}

module.exports = LogService;

// EXAMPLE USAGE

// Log an action performed by a user
// const LogService = require('./services/logService');

// await LogService.createLog('User registered', userId, 'user', 'New user registration', { additionalInfo: 'Details about the registration' });
