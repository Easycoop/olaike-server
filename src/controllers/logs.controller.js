const LogService = require('../helpers/logs/logs.service');

class LogController {
    static async createLog(req, res) {
        const { action, type, description, details } = req.body;
        const { userId } = req.user; // Assuming userId is available in req.user

        try {
            const log = await LogService.createLog(action, userId, type, description, details);
            res.status(201).json({
                status: 'success',
                data: log,
                message: 'Log created successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    static async getLogs(req, res) {
        const filter = req.query; // You can add more complex filtering

        try {
            const logs = await LogService.getLogs(filter);
            res.status(200).json({
                status: 'success',
                data: logs,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    static async deleteLog(req, res) {
        const { id } = req.params;

        try {
            const result = await LogService.deleteLog(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}

module.exports = LogController;
