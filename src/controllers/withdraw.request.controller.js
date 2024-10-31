const db = require('../database/models/index');
const { getPagination, getPagingData } = require('../utils/pagination');
const WithdrawRequest = db.WithdrawRequest;
const Group = db.Group;

class WithdrawRequestController {
    static async request(req, res) {
        const { userId, amount, reason } = req.body;

        try {
            const newRequest = await WithdrawRequest.create({
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

    static async getRequest(req, res) {
        const requestId = req.params.requestId;
        if (!requestId) throw new BadRequestError('Invalid request id');

        const request = await WithdrawRequest.findOne({ where: { id: requestId } });

        if (!request) throw new InternalServerError(`Withdraw request with ID: ${requestId} not found`);

        res.status(200).json({
            status: 'success',
            data: request,
        });
    }

    static async deleteRequest(req, res, next) {
        const { requestId } = req.params;

        const request = await WithdrawRequest.findOne({ where: { id: requestId } });

        if (!request) {
            throw new NotFoundError(`request with id ${requestId} not found`);
        }

        await request.destroy();

        res.status(204).json({
            status: 'success',
            message: `Withdraw request with id ${requestId} has been deleted`,
        });
    }

    static async getAllWithdrawRequestsByGroups(req, res, next) {
        const groupId = req.authPayload.user.groupId;

        const page = req.query.page ? Number(req.query.page) : 1;
        const size = req.query.size ? Number(req.query.size) : 10;

        if (page < 1 || size < 0) return next(new BadRequestError('Invalid pagination parameters'));

        let limit = null;
        let offset = null;

        if (page && size) {
            ({ limit, offset } = getPagination(page, size));
        }

        const masterGroup = await Group.findOne({
            where: {
                name: 'master',
            },
        });

        if (!masterGroup) {
            throw new InternalServerError('Internal server error');
        }

        let requests;

        if (groupId == masterGroup.id) {
            requests = await WithdrawRequest.findAndCountAll({
                where: {},
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        } else {
            requests = await WithdrawRequest.findAndCountAll({
                where: {
                    groupId,
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        }

        const specificCount = requests.rows.length;

        if (specificCount === 0) return next(new NotFoundError('No loan applications found'));

        const response = getPagingData(requests, page, limit, 'result');

        if (response.totalPages === null) {
            response.totalPages = 1;
        }
        return res.status(200).json({ success: true, data: response });
    }

    static async updateRequest(req, res) {
        const { id, userId, amount, action } = req.body;
        await sequelize.transaction(async (t) => {
            if (action == 'accept') {
                await WithdrawRequest.update(
                    { status: 'successful' },
                    {
                        where: {
                            id: id,
                        },
                    },
                );

                const userWallet = await Wallet.findOne({ where: { userId: userId } });

                if (!userWallet) {
                    throw new NotFoundError(`Wallet not found for user with id ${userId}`);
                }

                const subWallet = await SubWallet.findOne({
                    where: { walletId: userWallet.id, name: 'Savings Wallet' },
                });

                if (!subWallet) {
                    throw new InternalServerError('Savings wallet not found');
                }

                await subWallet.increment('balance', { by: amount, transaction: t });
            } else if (action == 'reject') {
                await WithdrawRequest.update(
                    { status: 'unsuccessful' },
                    {
                        where: {
                            id: id,
                        },
                    },
                );
            } else {
                throw new BadRequestError('failed');
            }

            return res.status(200).json({
                success: true,
                message: 'successful',
            });
        });
    }
}

module.exports = WithdrawRequestController;
