const db = require('../database/models/index');
const User = db.User;
const Role = db.Role;
const Password = db.Password;
const Group = db.Group;
const Wallet = db.Wallet;
const { BadRequestError, InternalServerError, NotFoundError } = require('../utils/error');
const { getPagination, getPagingData } = require('../utils/pagination');

async function validateCreateUser({ email }) {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
        throw new BadRequestError('Email is already registered');
    }
    return null;
}

class UserController {
    // Get the currently logged-in user
    static async getLoggedInUser(req, res, next) {
        try {
            const user = await User.findOne({ where: { id: req.authPayload.user.id } });

            if (!user) {
                throw new InternalServerError('User record not found for authenticated request');
            }

            res.status(200).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get a specific user by ID
    static async getUser(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundError(`User with id ${userId} not found`);
            }

            res.status(200).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all users
    static async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll();

            res.status(200).json({
                status: 'success',
                data: { users },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all users
    static async getAllUsersByGroups(req, res, next) {
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
        let users;

        if (groupId == masterGroup.id) {
            users = await User.findAndCountAll({
                where: {},
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        } else {
            users = await User.findAndCountAll({
                groupId,
                where: {
                    groupId,
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        }

        const specificCount = users.rows.length;

        if (specificCount === 0) return next(new NotFoundError('No user applications found'));

        const response = getPagingData(users, page, limit, 'result');

        if (response.totalPages === null) {
            response.totalPages = 1;
        }
        return res.status(200).json({ success: true, data: response });
    }

    // Create a new user
    static async createUser(req, res, next) {
        const { firstName, lastName, email, password, phone, role, country, isActivated, gender, state, group } =
            req.body;
        const t = await db.sequelize.transaction();

        try {
            // Validate user data
            await validateCreateUser({ email }, { transaction: t });

            // Create new user
            const newUser = await User.create(
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    country,
                    isActivated,
                    gender,
                    state,
                    groupId: group,
                },
                { transaction: t },
            );

            // Find the EndUser role
            const userRole = await Role.findOne({ where: { id: `${role}` }, transaction: t });
            if (!userRole) {
                throw new Error('role not found');
            }

            // Assign role to the new user
            await newUser.addRole(userRole, { transaction: t });

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

            res.status(201).json({
                status: 'success',
                data: { user: newUser },
            });
        } catch (error) {
            next(error);
        }
    }

    // Update user information
    static async updateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const { firstName, lastName, email, phone } = req.body;

            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundError(`User with id ${userId} not found`);
            }

            await user.update({ firstName, lastName, email, phone });

            res.status(200).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete a single user
    static async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;

            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundError(`User with id ${userId} not found`);
            }

            await user.destroy();

            res.status(204).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete multiple users (bulk delete)
    static async deleteBulk(req, res, next) {
        try {
            const { userIds } = req.body;

            if (!Array.isArray(userIds) || userIds.length === 0) {
                throw new BadRequestError('Please provide an array of user IDs');
            }

            const usersToDelete = await User.findAll({ where: { id: userIds } });

            if (usersToDelete.length === 0) {
                throw new NotFoundError('No users found for the provided IDs');
            }

            await User.destroy({ where: { id: userIds } });

            res.status(200).json({
                status: 'success',
                message: `${usersToDelete.length} users have been successfully deleted`,
            });
        } catch (error) {
            next(error);
        }
    }

    // Activate a user account
    static async activateUser(req, res, next) {
        try {
            const userId = req.params.id;

            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundError(`User with id ${userId} not found`);
            }

            await user.update({ isActivated: true });

            res.status(200).json({
                status: 'success',
                message: `User with id ${userId} activated successfully`,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    // Deactivate a user account
    static async deactivateUser(req, res, next) {
        try {
            const userId = req.params.id;

            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundError(`User with id ${userId} not found`);
            }

            await user.update({ isActivated: false });

            res.status(200).json({
                status: 'success',
                message: `User with id ${userId} deactivated successfully`,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    // Verify a user's email
    static async verifyUserEmail(req, res, next) {
        try {
            const userId = req.params.id;

            const user = await User.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundError(`User with id ${userId} not found`);
            }

            await user.update({ isVerified: true });

            res.status(200).json({
                status: 'success',
                message: `User with id ${userId} email verified`,
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
