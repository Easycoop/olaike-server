const db = require('../database/models/index');
const SubWallet = db.SubWallet;
const Wallet = db.Wallet;
const { NotFoundError, BadRequestError } = require('../utils/error');

class SubWalletController {
    // Create a new sub-wallet
    static async createSubWallet(req, res, next) {
        const { userId } = req.authPayload.user;
        const { walletId, name } = req.body;

        const mainWallet = await Wallet.findOne({ where: { id: walletId, userId } });

        if (!mainWallet) {
            throw new NotFoundError('Main wallet not found.');
        }

        const subWallet = await SubWallet.create({
            userId,
            walletId: mainWallet.id,
            name,
        });

        res.status(201).json({
            status: 'success',
            data: { subWallet },
        });
    }

    // Get all sub-wallets for a user's wallet
    static async getAllSubWallets(req, res, next) {
        const { userId } = req.authPayload.user;
        const { walletId } = req.params;

        const subWallets = await SubWallet.findAll({
            where: { walletId, userId },
        });

        if (!subWallets || subWallets.length === 0) {
            throw new NotFoundError('No sub-wallets found.');
        }

        res.status(200).json({
            status: 'success',
            data: { subWallets },
        });
    }

    // Get total balance for a main wallet, including sub-wallets
    static async getTotalBalance(req, res, next) {
        const { userId } = req.authPayload.user;
        const { walletId } = req.params;

        const mainWallet = await Wallet.findOne({
            where: { id: walletId, userId },
            include: [{ model: SubWallet }],
        });

        if (!mainWallet) {
            throw new NotFoundError('Main wallet not found.');
        }

        const totalBalance = mainWallet.sub_wallets.reduce((sum, subWallet) => {
            return sum + parseFloat(subWallet.balance);
        }, parseFloat(mainWallet.balance));

        res.status(200).json({
            status: 'success',
            data: { totalBalance },
        });
    }

    // Transfer funds to a sub-wallet
    static async transferFunds(req, res, next) {
        const { subWalletId } = req.params;
        const { amount } = req.body;

        const subWallet = await SubWallet.findOne({ where: { id: subWalletId } });

        if (!subWallet) {
            throw new NotFoundError(`Sub-wallet with id ${subWalletId} not found`);
        }

        if (amount <= 0) {
            throw new BadRequestError('Invalid amount.');
        }

        subWallet.balance = parseFloat(subWallet.balance) + parseFloat(amount);
        await subWallet.save();

        res.status(200).json({
            status: 'success',
            message: `Funds successfully transferred to sub-wallet ${subWalletId}`,
            data: { subWallet },
        });
    }

    // Get default sub-wallet
    static async getDefaultSubWallet(req, res, next) {
        const { userId } = req.authPayload.user;
        const { walletId } = req.params;

        const defaultSubWallet = await SubWallet.findOne({
            where: { walletId, userId, isDefault: true },
        });

        if (!defaultSubWallet) {
            throw new NotFoundError('Default sub-wallet not found.');
        }

        res.status(200).json({
            status: 'success',
            data: { defaultSubWallet },
        });
    }

    // Get a specific sub-wallet by ID
    static async getSubWallet(req, res, next) {
        const { userId } = req.authPayload.user;
        const { subWalletId, walletId } = req.params;

        const subWallet = await SubWallet.findOne({
            where: { id: subWalletId, walletId, userId },
        });

        if (!subWallet) {
            throw new NotFoundError(`Sub-wallet with id ${subWalletId} not found`);
        }

        res.status(200).json({
            status: 'success',
            data: { subWallet },
        });
    }

    // Update a specific sub-wallet by ID
    static async updateSubWallet(req, res, next) {
        const { userId } = req.authPayload.user;
        const { subWalletId, walletId } = req.params;
        const { name, isDefault } = req.body;

        const subWallet = await SubWallet.findOne({
            where: { id: subWalletId, walletId, userId },
        });

        if (!subWallet) {
            throw new NotFoundError(`Sub-wallet with id ${subWalletId} not found`);
        }

        subWallet.name = name || subWallet.name;
        subWallet.isDefault = isDefault !== undefined ? isDefault : subWallet.isDefault;

        await subWallet.save();

        res.status(200).json({
            status: 'success',
            message: `Sub-wallet ${subWalletId} updated successfully`,
            data: { subWallet },
        });
    }

    // Delete a specific sub-wallet by ID
    static async deleteSubWallet(req, res, next) {
        const { userId } = req.authPayload.user;
        const { subWalletId, walletId } = req.params;

        const subWallet = await SubWallet.findOne({
            where: { id: subWalletId, walletId, userId },
        });

        if (!subWallet) {
            throw new NotFoundError(`Sub-wallet with id ${subWalletId} not found`);
        }

        await subWallet.destroy();

        res.status(200).json({
            status: 'success',
            message: `Sub-wallet ${subWalletId} deleted successfully`,
        });
    }

    // Transfer funds between sub-wallets
    static async transferFundsBetweenSubWallets(req, res, next) {
        const { subWalletId, walletId } = req.params;
        const { targetSubWalletId, amount } = req.body;

        const subWallet = await SubWallet.findOne({ where: { id: subWalletId, walletId } });
        const targetSubWallet = await SubWallet.findOne({ where: { id: targetSubWalletId, walletId } });

        if (!subWallet || !targetSubWallet) {
            throw new NotFoundError(`One or both sub-wallets not found`);
        }

        if (amount <= 0 || subWallet.balance < amount) {
            throw new BadRequestError('Invalid amount or insufficient balance.');
        }

        subWallet.balance = parseFloat(subWallet.balance) - parseFloat(amount);
        targetSubWallet.balance = parseFloat(targetSubWallet.balance) + parseFloat(amount);

        await subWallet.save();
        await targetSubWallet.save();

        res.status(200).json({
            status: 'success',
            message: `Funds transferred from sub-wallet ${subWalletId} to sub-wallet ${targetSubWalletId}`,
            data: { subWallet, targetSubWallet },
        });
    }
}

module.exports = SubWalletController;
