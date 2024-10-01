const db = require('../database/models/index');
const Transaction = db.Transaction; // Assuming Transaction is a Sequelize model
const Wallet = db.Wallet; // Assuming Wallet is a Sequelize model
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/error');

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

        try {
            const transactions = await Transaction.findAll({ where: { walletId } });

            if (!transactions.length) {
                throw new NotFoundError(`No transactions found for wallet with id ${walletId}`);
            }

            res.status(200).json({
                status: 'success',
                data: { transactions },
            });
        } catch (error) {
            next(error);
        }
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
