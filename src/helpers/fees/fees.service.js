const { Fees } = require('../../database/models/index');

class FeesService {
    static async createFee(type, amount, status = 'unpaid', walletId) {
        console.log(type, amount, status, walletId);
        try {
            const fee = await Fees.create({
                walletId: walletId,
                amount: amount,
                type: type,
                status: status,
            });
            return fee;
        } catch (error) {
            console.error('Failed to create fee:', error.message);
            throw new Error('Failed creation failed');
        }
    }

    static async getFees(filter = {}) {
        try {
            const fees = await Fees.findAll({
                where: filter,
                order: [['createdAt', 'DESC']],
            });
            return fees;
        } catch (error) {
            console.error('Failed to fetch fees:', error.message);
            throw new Error('Fee retrieval failed');
        }
    }

    static async deleteFee(feeId) {
        try {
            const fee = await Fees.findByPk(feeId);
            if (!fee) {
                throw new Error('Fee not found');
            }
            await fee.destroy();
            return { message: 'Fee deleted successfully' };
        } catch (error) {
            console.error('Failed to delete fee:', error.message);
            throw new Error('Fee deletion failed');
        }
    }
}

module.exports = FeesService;
