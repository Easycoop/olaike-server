const db = require('../../database/models/index');
const User = db.User;
const Wallet = db.Wallet;
const Group = db.Group;
const UserApplication = db.UserApplication;
const { BadRequestError, InternalServerError } = require('../../utils/error');
const path = require('path');
const { sequelize } = require('../../database/models/index.js');
const { AuthMailService } = require('../../services/mail.service/mail/index.js');
const { getPagination, getPagingData } = require('../../utils/pagination.js');
const LogService = require('../../helpers/logs/logs.service.js');
const UserService = require('../../helpers/user/user.service.js');
const NotificationService = require('../../helpers/notification/notification.service.js');
const FeesService = require('../../helpers/fees/fees.service.js');

class UserApplicationsController {
    static async newUserApplication(req, res) {
        await sequelize.transaction(async (t) => {
            const { firstName, lastName, email, password, phone, group, gender, referralCode } = req.body;

            let _referralCode = null;
            if (referralCode) _referralCode = referralCode;
            if (!firstName || !lastName || !email || !password || !phone || !group) {
                throw new BadRequestError('Missing required fields');
            }

            try {
                const newApplication = await UserApplication.create({
                    firstName,
                    lastName,
                    email,
                    password,
                    gender,
                    phone,
                    group,
                    referralCode: _referralCode,
                    status: 'pending',
                });

                const wallet = await Wallet.findOne({ where: { groupId: group } });

                await wallet.increment('balance', { by: wallet.entranceFee });

                LogService.createLog('SERVICE', null, 'user', 'new user registration');
                AuthMailService.sendRegistrationComplete({ email, firstName, lastName });

                res.status(200).send({
                    status: 'success',
                    message: 'User application successful',
                    data: null,
                });
            } catch (error) {
                console.error('Error creating new application:', error);
            }
        });
    }

    static async getSingleUserApplication(req, res) {
        const id = req.params.applicationId;

        await sequelize.transaction(async (t) => {
            const singleUserApplication = await UserApplication.findOne({ where: { id: id } });
            if (!singleUserApplication) {
                throw new NotFoundError(`User application with id ${id} not found`);
            }
            return res.status(200).json({
                success: true,
                data: singleUserApplication,
            });
        });
    }

    static async getTotalPendingUserApplications(req, res) {
        const pendingUserApp = await UserApplication.findAll({
            where: {
                status: 'pending',
            },
        });
        if (!pendingUserApp) {
            return next(new NotFoundError('No pending user applications found'));
        }

        const totalApplications = pendingUserApp.length;
        return res.status(200).json({
            success: true,
            data: totalApplications,
        });
    }
    static async updateUserApplication(req, res) {
        const { id, action, firstName, lastName, email, password, group, gender, referral } = req.body;
        await sequelize.transaction(async (t) => {
            if (action == 'accept') {
                await UserApplication.update(
                    { status: 'success' },
                    {
                        where: {
                            id: id,
                        },
                    },
                );

                // Create new user
                try {
                    await UserService.createUser(
                        id,
                        action,
                        firstName,
                        lastName,
                        email,
                        password,
                        group,
                        gender,
                        referral,
                    );

                    LogService.createLog('AUTH', null, 'user', 'user registration accepted');

                    AuthMailService.sendRegistrationAction({ action, email, firstName, lastName });
                } catch (e) {
                    throw new InternalServerError('Unable to create user');
                }
            } else if (action == 'reject') {
                await UserApplication.update(
                    { status: 'failed' },
                    {
                        where: {
                            id: id,
                        },
                    },
                );

                LogService.createLog('AUTH', null, 'user', 'user registration rejected');

                AuthMailService.sendRegistrationAction({ action, email, firstName, lastName });
            } else {
                throw new BadRequestError('failed');
            }

            return res.status(200).json({
                success: true,
                message: 'successful',
            });
        });
    }

    static async getAllUserApplications(req, res, next) {
        await sequelize.transaction(async (t) => {
            const page = req.query.page ? Number(req.query.page) : 1;
            const size = req.query.size ? Number(req.query.size) : 10;

            if (page < 1 || size < 0) return next(new BadRequestError('Invalid pagination parameters'));

            let limit = null;
            let offset = null;

            if (page && size) {
                ({ limit, offset } = getPagination(page, size));
            }
            const userApplications = await UserApplication.findAndCountAll(
                {
                    where: {},
                    order: [['createdAt', 'DESC']],
                    limit,
                    offset,
                },
                { transaction: t },
            );

            const specificCount = userApplications.rows.length;

            if (specificCount === 0) return next(new NotFoundError('No user applications found'));

            const response = getPagingData(userApplications, page, limit, 'result');

            if (response.totalPages === null) {
                response.totalPages = 1;
            }
            return res.status(200).json({ success: true, data: response });
        });
    }

    static async getAllUserApplicationsByGroups(req, res, next) {
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

        let userApplications;

        if (groupId == masterGroup.id) {
            userApplications = await UserApplication.findAndCountAll({
                where: {},
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        } else {
            userApplications = await UserApplication.findAndCountAll({
                where: {
                    groupId,
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        }

        const specificCount = userApplications.rows.length;

        if (specificCount === 0) return next(new NotFoundError('No user applications found'));

        const response = getPagingData(userApplications, page, limit, 'result');

        if (response.totalPages === null) {
            response.totalPages = 1;
        }
        return res.status(200).json({ success: true, data: response });
    }
}

module.exports = UserApplicationsController;
