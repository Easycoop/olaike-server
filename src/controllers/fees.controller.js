const FeesService = require('../helpers/fees/fees.service');
const db = require('../database/models/index');
const { InternalServerError } = require('../utils/error');
const Wallet = db.Wallet;
const Fees = db.Fees;

class FeesController {
    static async createFee(req, res) {
        const { walletId, amount, type, status } = req.body;
        const { userId } = req.user; // Assuming userId is available in req.user

        try {
            const fee = await FeesService.createFee({ walletId: walletId, amount: amount, type: type, status: status });
            res.status(201).json({
                status: 'success',
                data: fee,
                message: 'Fee created successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }

    static async getFees(req, res) {
        const userId = req.authPayload.user.id;
        const wallet = await Wallet.findOne({
            where: { userId: userId },
        });

        const fees = await Fees.findAll({
            where: {
                walletId: wallet.id,
            },
            order: [['createdAt', 'DESC']],
        });

        if (!fees) throw new InternalServerError('Fees not found');

        res.status(200).json({
            status: 'success',
            data: fees,
        });
    }

    static async deleteFee(req, res) {
        const { id } = req.params;

        try {
            const result = await FeesService.deleteFee(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            });
        }
    }
}

module.exports = FeesController;
