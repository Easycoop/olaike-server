// group.controller.js
const db = require('../database/models/index');
const LogService = require('../helpers/logs/logs.service');
const Group = db.Group;
const User = db.User;
const Wallet = db.Wallet;
const { NotFoundError, InternalServerError, BadRequestError } = require('../utils/error');

class GroupController {
    // Create a new group
    static async createGroup(req, res, next) {
        const { name, description, type } = req.body;
        const t = await db.sequelize.transaction();

        if (!name || !description) {
            return next(new BadRequestError('name and description is required'));
        }

        const newGroup = await Group.create({ name, description }, { transaction: t });

        // Create wallet for the new society
        const newWallet = await Wallet.create(
            {
                groupId: newGroup.id,
                balance: 0,
                currency: 'NGN',
            },
            { transaction: t },
        );

        await newGroup.update({ walletId: newWallet.id });
        await newGroup.save();

        await t.commit();

        LogService.createLog('SERVICE', null, 'system', 'new society created');

        res.status(201).json({
            status: 'success',
            data: { group: newGroup },
        });
    }

    // Update an existing group
    static async updateGroup(req, res, next) {
        const { groupId } = req.params;
        const { name, description, type, isActive } = req.body;

        const group = await Group.findOne({ where: { id: groupId } });

        if (!group) {
            throw new NotFoundError(`Group with id ${groupId} not found`);
        }

        await group.update({ name, description, type, isActive });

        res.status(200).json({
            status: 'success',
            data: { group },
        });
    }

    // Delete a group
    static async deleteGroup(req, res, next) {
        const { groupId } = req.params;

        const group = await Group.findOne({ where: { id: groupId } });

        if (!group) {
            throw new NotFoundError(`Group with id ${groupId} not found`);
        }

        await group.destroy();

        res.status(204).json({
            status: 'success',
            message: `Group with id ${groupId} has been deleted`,
        });
    }

    // Add user to group
    static async addUserToGroup(req, res, next) {
        const { groupId, userId } = req.body;

        const group = await Group.findOne({ where: { id: groupId } });
        const user = await User.findOne({ where: { id: userId } });

        if (!group || !user) {
            throw new NotFoundError('Group or User not found');
        }

        await user.update({ groupId });

        res.status(200).json({
            status: 'success',
            message: `User ${userId} added to group ${groupId}`,
        });
    }

    // Remove user from group
    static async removeUserFromGroup(req, res, next) {
        const { groupId, userId } = req.body;

        const group = await Group.findOne({ where: { id: groupId } });
        const user = await User.findOne({ where: { id: userId, groupId } });

        if (!group || !user) {
            throw new NotFoundError('Group or User not found');
        }

        await user.update({ groupId: null });

        res.status(200).json({
            status: 'success',
            message: `User ${userId} removed from group ${groupId}`,
        });
    }

    // Get all users in a group
    static async getUsersInGroup(req, res, next) {
        const { groupId } = req.params;

        const group = await Group.findOne({ where: { id: groupId }, include: User });

        if (!group) {
            throw new NotFoundError(`Group with id ${groupId} not found`);
        }

        res.status(200).json({
            status: 'success',
            data: { users: group.Users },
        });
    }

    // Calculate group wallet balance
    static async calculateGroupWalletBalance(req, res, next) {
        const { groupId } = req.params;

        const group = await Group.findOne({ where: { id: groupId }, include: Wallet });

        if (!group || !group.Wallet) {
            throw new NotFoundError(`Group with id ${groupId} not found or has no wallet`);
        }

        // Get all users' wallet balances
        const users = await User.findAll({ where: { groupId } });
        const totalBalance = users.reduce((sum, user) => {
            return sum + (user.Wallet ? user.Wallet.balance : 0); //Wallet model associated with User
        }, 0);

        res.status(200).json({
            status: 'success',
            data: {
                groupId,
                totalBalance,
            },
        });
    }

    // Get total user count in a group
    static async getTotalGroupUserCount(req, res, next) {
        const { groupId } = req.params;

        const userCount = await User.count({ where: { groupId } });

        res.status(200).json({
            status: 'success',
            data: {
                groupId,
                totalUserCount: userCount,
            },
        });
    }

    // Get all groups
    static async getAllGroups(req, res, next) {
        const groups = await Group.findAll();
        res.status(200).json({
            status: 'success',
            data: { groups },
        });
    }
}

module.exports = GroupController;
