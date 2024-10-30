const { User, Role, Password, Permission, Wallet, SubWallet, Group } = require('../../database/models/index');
const { BadRequestError } = require('../../utils/error');
const { sequelize } = require('../../database/models/index.js');
const FeesService = require('../fees/fees.service.js');

class UserService {
    static async createUser(id, action, firstName, lastName, email, password, group, gender, referral) {
        const t = await sequelize.transaction(); // Start a transaction
        // Generate a random referral string(8 digits)
        const referralCode = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 digit referral code

        try {
            const existingUser = await User.findOne({ where: { email: email } });
            if (existingUser) {
                throw new BadRequestError('Email is already registered');
            }

            const newUser = await User.create(
                {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    gender: gender,
                    groupId: group,
                    referralCode: referralCode,
                },
                { transaction: t },
            );

            if (referral) {
                const referralUser = await User.findOne({ where: { referralCode: referral } });
                if (referralUser) {
                    // Add referral money
                    const referralWallet = await Wallet.findOne({ where: { userId: referralUser.id }, transaction: t });
                    await referralWallet.increment('balance', { by: 500 });
                }
            }

            // Find the EndUser role
            const endUserRole = await Role.findOne({ where: { name: 'EndUser' }, transaction: t });
            if (!endUserRole) {
                throw new Error('EndUser role not found');
            }

            // Assign role to the new user
            await newUser.addRole(endUserRole, { transaction: t });

            // Retrieve role with specific permissions
            const assignedRoleWithPermissions = await Role.findOne({
                where: { id: endUserRole.id },
                include: [
                    {
                        model: Permission,
                        attributes: ['id', 'name'], // Return specific permission fields if needed
                    },
                ],
                transaction: t,
            });

            // Create user password
            await Password.create(
                {
                    userId: newUser.id,
                    password: password,
                },
                { transaction: t },
            );

            // Create wallet for the new user
            const newWallet = await Wallet.create(
                {
                    userId: newUser.id,
                    balance: 0,
                    currency: 'NGN',
                },
                { transaction: t },
            );

            // Create subwallet1 for the new user

            const subWallet1 = await SubWallet.create(
                {
                    walletId: newWallet.id,
                    balance: 0,
                    currency: 'NGN',
                    type: 'typeA',
                    name: 'Savings Wallet',
                },
                { transaction: t },
            );

            // Create subwallet2 for the new user
            const subWallet2 = await SubWallet.create(
                {
                    walletId: newWallet.id,
                    balance: 0,
                    currency: 'NGN',
                    type: 'typeB',
                    name: 'Building',
                },
                { transaction: t },
            );

            // Create subwallet3 for the new user
            const subWallet3 = await SubWallet.create(
                {
                    walletId: newWallet.id,
                    balance: 0,
                    currency: 'NGN',
                    type: 'typeC',
                    name: 'Loan',
                },
                { transaction: t },
            );

            await newUser.update({ walletId: newWallet.id });
            await newUser.save();

            const myGroup = await Group.findOne({ where: { id: group } });

            // Commit the transaction if everything succeeds
            await t.commit();
            await FeesService.createFee('entrance_fee', myGroup.entranceFee, 'paid', newWallet.id);
            return newUser;
        } catch (error) {
            console.error('Failed to create user:', error.message);
            throw new Error('User creation failed');
        }
    }
}

module.exports = UserService;
