const { User, Role, Password, Permission, Wallet, SubWallet } = require('../../database/models/index');
const { BadRequestError } = require('../../utils/error');
const { sequelize } = require('../../database/models/index.js');

class UserService {
    static async createUser(id, action, firstName, lastName, email, password, group, gender) {
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
                    name: 'Home Savings Wallet',
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
                    name: 'Holiday Wallet',
                },
                { transaction: t },
            );

            // Commit the transaction if everything succeeds
            await t.commit();
            return newUser;
        } catch (error) {
            console.error('Failed to create user:', error.message);
            throw new Error('User creation failed');
        }
    }
}

module.exports = UserService;
