const db = require('../database/models/index');
const User = db.User;
const Password = db.Password;
const UserApplication = db.UserApplication;
const { BadRequestError, InternalServerError } = require('../utils/error');
const path = require('path');
const { sequelize } = require('../database/models/index.js');
const { AuthMailService } = require('../services/mail.service/mail/index.js');
const { getPagination, getPagingData } = require('../../utils/pagination.js');

class UserApplicationsController {
    static async newUserApplication(req, res) {
        await sequelize.transaction(async (t) => {
            const { firstName, lastName, email, password, phone } = req.body;

            try {
                const newApplication = await UserApplication.create({
                    firstName,
                    lastName,
                    email,
                    password,
                    phone,
                    status: 'pending',
                });

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
        const id = req.params.id;
        await sequelize.transaction(async (t) => {
            const singleUserApplication = await UserApplication.findOne({ where: { id: id } });
            if (!singleUserApplication) {
                throw new NotFoundError(`User application with id ${req.params.id} not found`);
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
        const { action, firstName, lastName, email, password, phone } = req.body;
        await sequelize.transaction(async (t) => {
            if (action == 'accept') {
                await PropertyApplication.update(
                    { status: 'success' },
                    {
                        where: {
                            id: req.params.id,
                        },
                    },
                );

                // Create new user
                try {
                    await User.create({
                        firstName,
                        lastName,
                        email,
                        password,
                        phone,
                    });
                } catch (e) {
                    console.log(e);
                }
                // sendPropertyRegSuccessEmail(email);
            } else if (action == 'reject') {
                await UserApplication.update(
                    { status: 'failed' },
                    {
                        where: {
                            id: req.params.id,
                        },
                    },
                );
                // sendPropertyRegFailedEmail(email);
            } else {
                throw new BadRequestError('failed');
            }

            return res.status(200).json({
                success: true,
                message: 'successful',
            });
        });
    }

    static getAllUserApplications = asyncWrapper(async (req, res, next) => {
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

            const response = getPagingData(userApplications, page, limit, 'userApplications');

            if (response.totalPages === null) {
                response.totalPages = 1;
            }

            return res.status(200).json({ success: true, data: response });
        });
    });
}

module.exports = UserApplicationsController;
