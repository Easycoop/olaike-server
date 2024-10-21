const db = require('../database/models/index');
const Transaction = db.Transaction;
const Wallet = db.Wallet;
const Group = db.Group;
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/error');
const { getPagingData, getPagination } = require('../utils/pagination');

class TransactionController {
    // Create a new transaction
    static async createTransaction(req, res, next) {
        const { walletId, amount, type } = req.body;

        if (!walletId || amount === undefined || !type) {
            return next(new BadRequestError('walletId, amount and type are required'));
        }

        try {
            const wallet = await Wallet.findOne({ where: { id: walletId } });

            if (!wallet) {
                throw new NotFoundError(`Wallet not found for id ${walletId}`);
            }

            if (type === 'debit' && wallet.balance < amount) {
                return next(new BadRequestError('Insufficient funds for this transaction'));
            }

            const transaction = await Transaction.create({ walletId, amount, type });

            // Update wallet balance
            wallet.balance += type === 'credit' ? amount : -amount;
            await wallet.save();

            res.status(201).json({
                status: 'success',
                data: { transaction },
            });
        } catch (error) {
            next(new InternalServerError('Failed to create transaction'));
        }
    }

    // Get all transactions
    static async getAllTransactions(req, res, next) {
        try {
            const transactions = await Transaction.findAll();

            if (!transactions.length) {
                return res.status(404).json({
                    status: 'success',
                    message: 'No transactions found',
                });
            }

            res.status(200).json({
                status: 'success',
                data: { transactions },
            });
        } catch (error) {
            next(new InternalServerError('Failed to fetch transactions'));
        }
    }

    // Get all transactions by groups
    static async getAllTransactionsByGroups(req, res, next) {
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
        let transactions;

        if (groupId == masterGroup.id) {
            transactions = await Transaction.findAndCountAll({
                where: {},
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        } else {
            transactions = await Transaction.findAndCountAll({
                where: {
                    groupId,
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        }

        const specificCount = transactions.rows.length;

        if (specificCount === 0) return next(new NotFoundError('No transactions found'));

        const response = getPagingData(transactions, page, limit, 'result');

        if (response.totalPages === null) {
            response.totalPages = 1;
        }
        return res.status(200).json({ status: 'success', data: response });
    }

    // Get a transaction by ID
    static async getTransaction(req, res, next) {
        const transactionId = req.params.id;

        try {
            const transaction = await Transaction.findOne({ where: { id: transactionId } });

            if (!transaction) {
                throw new NotFoundError(`Transaction not found with id ${transactionId}`);
            }

            res.status(200).json({
                status: 'success',
                data: { transaction },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all transactions for a wallet
    static async getWalletTransactions(req, res, next) {
        const walletId = req.params.walletId;
        const page = req.query.page ? Number(req.query.page) : 1;
        const size = req.query.size ? Number(req.query.size) : 10;
        if (page < 1 || size < 0) return next(new BadRequestError('Invalid pagination parameters'));

        let limit = null;
        let offset = null;

        if (page && size) {
            ({ limit, offset } = getPagination(page, size));
        }

        const transactions = await Transaction.findAndCountAll({
            where: { walletId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        const specificCount = transactions.rows.length;

        if (specificCount === 0) throw new NotFoundError(`No transactions found for wallet with id ${walletId}`);

        const response = getPagingData(transactions, page, limit, 'result');

        if (response.totalPages === null) {
            response.totalPages = 1;
        }

        return res.status(200).json({ status: 'success', data: response });
    }

    // Get all transactions for a user
    static async getUserTransactions(req, res, next) {
        const userId = req.params.userId;
        const wallet = await Wallet.findOne({ where: { userId: userId } });

        if (!wallet) throw new NotFoundError(`User wallet not found with id ${userId}`);

        const page = req.query.page ? Number(req.query.page) : 1;
        const size = req.query.size ? Number(req.query.size) : 10;
        if (page < 1 || size < 0) return next(new BadRequestError('Invalid pagination parameters'));

        let limit = null;
        let offset = null;

        if (page && size) {
            ({ limit, offset } = getPagination(page, size));
        }

        const transactions = await Transaction.findAndCountAll({
            where: { walletId: wallet.id },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        const specificCount = transactions.rows.length;

        if (specificCount === 0) throw new NotFoundError(`No transactions found for user with id ${userId}`);

        const response = getPagingData(transactions, page, limit, 'result');

        if (response.totalPages === null) {
            response.totalPages = 1;
        }

        return res.status(200).json({ status: 'success', data: response });
    }

    // Delete a transaction
    static async deleteTransaction(req, res, next) {
        const transactionId = req.params.id;

        try {
            const transaction = await Transaction.destroy({ where: { id: transactionId } });

            if (!transaction) {
                throw new NotFoundError(`Transaction not found with id ${transactionId}`);
            }

            // Optionally: Restore wallet balance if necessary
            res.status(204).send();
        } catch (error) {
            next(new InternalServerError('Failed to delete transaction'));
        }
    }
}

module.exports = TransactionController;
