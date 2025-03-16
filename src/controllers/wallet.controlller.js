const { Wallet, SubWallet, User, Kyc } = require('../database/models/index');
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/error');
const kegowWalletService = require('../services/kegow.service/wallets');

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
            const wallet = await Wallet.findOne({ where: { userId: userId } });

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

    // Get a user's wallets including subwallets
    static async getUserWallets(req, res, next) {
        const userId = req.params.userId;

        const wallet = await Wallet.findOne({ where: { userId: userId } });

        if (!wallet) {
            throw new NotFoundError(`Wallet not found for user with id ${userId}`);
        }

        const subWallets = await SubWallet.findAll({
            where: { walletId: wallet.id },
        });

        if (!subWallets) {
            throw new NotFoundError(`Wallet not found for user with id ${userId}`);
        }

        res.status(200).json({
            status: 'success',
            data: { wallet: wallet, subWallets: subWallets },
        });
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

    static async generatePaymentWallet(req, res){
        
        
        try {
            await User.update({ kegowPhoneId: 120 }, { where: { id: req.params.id } });
            // return res.status(200).json({ message: 'Kegow phone id updated' });
            const user = await User.findOne({ where: { id: req.params.id } });
            if (!user) {
                return res.status(400).json({ message: 'invalid user id supplied' });
            }
            const kycData = await Kyc.findOne({ where: { userId: user.id, status: "accepted",  } });
            if (!kycData) {
                return res.status(400).json({ message: 'User kyc is not complete' });
            }

            // console.log(user);
            // return res.status(200).json({status:"success", user:user, kyc: kycData});
            
            const generateKegowWallet = await kegowWalletService.create("olaike-"+user.id, "olaike_"+user.firstName+"_"+user.lastName, kycData.kegowId, user.kegowPhoneId);
            if(generateKegowWallet){
                return res.status(200).json({status:"success", data:generateKegowWallet});
                Wallet.update({ kegowAccount: generateKegowWallet.walletId }, { where: { userId: user.id } });
            }
           
        } catch (error) {
            return res.status(400).json({status:"fail", data:error?.message});
        }
    }
}

module.exports = WalletController;
