const db = require('../database/models/index');
const RequestWithdraw = db.RequestWithdraw;

class RequestWithdrawController {
    static async request(req, res) {
        const { userId, amount, reason } = req.body;

        try {
            const newRequest = await RequestWithdraw.create({
                amount,
                reason,
                userId: userId,
            });

            res.status(201).json({
                status: 'success',
                message: 'Request added successfully',
                data: newRequest,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to add request',
                error: error.message,
            });
        }
    }
}

module.exports = RequestWithdrawController;
