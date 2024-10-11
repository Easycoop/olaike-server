const { User, Role, Password, Permission, Wallet } = require('../../database/models/index');
const { BadRequestError } = require('../../utils/error');
const { sequelize } = require('../../database/models/index.js');

class UserService {
    static async createUser(id, action, firstName, lastName, email, password, group) {
        console.log('james', group);
        const t = await sequelize.transaction(); // Start a transaction
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
                    groupId: group,
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
