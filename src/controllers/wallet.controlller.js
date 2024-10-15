const db = require('../database/models/index');
const Wallet = db.Wallet; // Assuming Wallet is a Sequelize model
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/error');

class WalletController {
    // Create a new wallet
    static async createWallet(req, res, next) {
        const { userId, balance } = req.body;

        if (!userId || balance === undefined) {
            return next(new BadRequestError('userId and balance are required'));
        }

        try {
            const wallet = await Wallet.create({ userId, balance });
            res.status(201).json({
                status: 'success',
                data: { wallet },
            });
        } catch (error) {
            next(new InternalServerError('Failed to create wallet'));
        }
    }

    // Get all wallets
    static async getAllWallets(req, res, next) {
        try {
            const wallets = await Wallet.findAll();

            if (!wallets.length) {
                return res.status(404).json({
                    status: 'success',
                    message: 'No wallets found',
                });
            }

            res.status(200).json({
                status: 'success',
                data: { wallets },
            });
        } catch (error) {
            next(new InternalServerError('Failed to fetch wallets'));
        }
    }

    // Get a user's wallet
    static async getWallet(req, res, next) {
        const userId = req.params.id;

        try {
            const wallet = await Wallet.findOne({ where: { userId } });

            if (!wallet) {
                throw new NotFoundError(`Wallet not found for user with id ${userId}`);
            }

            res.status(200).json({
                status: 'success',
                data: { wallet },
            });
        } catch (error) {
            next(error);
        }
    }

    // Update wallet balance
    static async updateBalance(req, res, next) {
        const userId = req.params.userId;
        const { balance } = req.body;

        if (balance === undefined) {
            return next(new BadRequestError('Balance is required'));
        }

        try {
            const wallet = await Wallet.findOne({ where: { userId } });

            if (!wallet) {
                throw new NotFoundError(`Wallet not found for user with id ${userId}`);
            }

            wallet.balance = balance;
            await wallet.save();

            res.status(200).json({
                status: 'success',
                data: { wallet },
            });
        } catch (error) {
            next(new InternalServerError('Failed to update balance'));
        }
    }

    // Delete wallet
    static async deleteWallet(req, res, next) {
        const userId = req.params.userId;

        try {
            const wallet = await Wallet.destroy({ where: { userId } });

            if (!wallet) {
                throw new NotFoundError(`Wallet not found for user with id ${userId}`);
            }

            res.status(204).send();
        } catch (error) {
            next(new InternalServerError('Failed to delete wallet'));
        }
    }
}

module.exports = WalletController;
