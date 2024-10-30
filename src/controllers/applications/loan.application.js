const { getPagination, getPagingData } = require('../../utils/pagination');
const db = require('../../database/models/index');
const LogService = require('../../helpers/logs/logs.service');
const LoanApplication = db.LoanApplication;
const User = db.User;
const Group = db.Group;
const Wallet = db.Wallet;
const { NotFoundError, InternalServerError, BadRequestError } = require('../../utils/error');
const Op = require('sequelize').Op;

class LoanApplicationController {
    static async saveChanges(req, res, next) {
        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            dob,
            address,
            employmentStatus,
            employerName,
            jobTitle,
            employmentAddress,
            nokFirstName,
            nokLastName,
            nokEmail,
            nokPhone,
            nokRelationship,
            bvn,
            verificationDocument,
            guarantorFirstName,
            guarantorLastName,
            guarantorEmail,
            guarantorPhone,
            guarantorOccupation,
            guarantorHomeAddress,
            guarantorOfficeAddress,
            userId,
        } = req.body;

        console.log('laos', nokEmail);

        let updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (email) updateFields.email = email;
        if (phone) updateFields.phone = phone;
        if (gender) updateFields.gender = gender;
        if (dob) updateFields.dob = dob;
        if (address) updateFields.address = address;
        if (employmentStatus) updateFields.employmentStatus = employmentStatus;
        if (employerName) updateFields.employerName = employerName;
        if (jobTitle) updateFields.jobTitle = jobTitle;
        if (employmentAddress) updateFields.employmentAddress = employmentAddress;
        if (nokFirstName) updateFields.nokFirstName = nokFirstName;
        if (nokLastName) updateFields.nokLastName = nokLastName;
        if (nokEmail) updateFields.nokEmail = nokEmail;
        if (nokPhone) updateFields.nokPhone = nokPhone;
        if (nokRelationship) updateFields.nokRelationship = nokRelationship;
        if (bvn) updateFields.bvn = bvn;
        if (verificationDocument) updateFields.verificationDocument = verificationDocument;
        if (guarantorFirstName) updateFields.guarantorFirstName = guarantorFirstName;
        if (guarantorLastName) updateFields.guarantorLastName = guarantorLastName;
        if (guarantorEmail) updateFields.guarantorEmail = guarantorEmail;
        if (guarantorPhone) updateFields.guarantorPhone = guarantorPhone;
        if (guarantorOccupation) updateFields.guarantorOccupation = guarantorOccupation;
        if (guarantorHomeAddress) updateFields.guarantorHomeAddress = guarantorHomeAddress;
        if (guarantorOfficeAddress) updateFields.guarantorOfficeAddress = guarantorOfficeAddress;
        if (userId) updateFields.userId = userId;

        if (!userId) {
            throw new BadRequestError('User id cannot be null');
        }

        const user = await User.findOne({ where: { id: userId } });
        const existingApplication = await LoanApplication.findOne({ where: { userId: userId } });
        if (!existingApplication) {
            const application = await LoanApplication.create({
                firstName,
                lastName,
                email,
                phone,
                gender,
                dob,
                address,
                employmentStatus,
                employerName,
                jobTitle,
                employmentAddress,
                nokFirstName,
                nokLastName,
                nokEmail,
                nokPhone,
                nokRelationship,
                bvn,
                verificationDocument,
                guarantorFirstName,
                guarantorLastName,
                guarantorEmail,
                guarantorPhone,
                guarantorOccupation,
                guarantorHomeAddress,
                guarantorOfficeAddress,
                userId,
                status: 'inactive',
            });

            await user.update({ loanApplicationId: application.id });
            await user.save();
            return res.status(201).json({
                status: 'success',
                message: 'Loan application updated successfully',
                data: {
                    application: application,
                    user: user,
                },
            });
        }

        await existingApplication.update(updateFields);

        res.status(201).json({
            status: 'success',
            message: 'Loan application updated successfully',
            data: {
                application: existingApplication,
                user: user,
            },
        });
    }

    static async submitLoan(req, res, next) {
        const {
            firstName,
            lastName,
            email,
            phone,
            gender,
            dob,
            address,
            employmentStatus,
            employerName,
            jobTitle,
            employmentAddress,
            nokFirstName,
            nokLastName,
            nokEmail,
            nokPhone,
            nokRelationship,
            bvn,
            verificationDocument,
            guarantorFirstName,
            guarantorLastName,
            guarantorEmail,
            guarantorPhone,
            guarantorOccupation,
            guarantorHomeAddress,
            guarantorOfficeAddress,
            userId,
        } = req.body;

        if (
            !userId ||
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !gender ||
            !address ||
            !employmentStatus ||
            !employerName ||
            !jobTitle ||
            !employmentAddress ||
            !nokFirstName ||
            !nokLastName ||
            !nokEmail ||
            !nokPhone ||
            !nokRelationship ||
            !bvn ||
            // !verificationDocument ||
            !guarantorFirstName ||
            !guarantorLastName ||
            !guarantorEmail ||
            !guarantorPhone ||
            !guarantorOccupation ||
            !guarantorHomeAddress ||
            !guarantorOfficeAddress
        ) {
            // throw new BadRequestError('fields must be complete');
            return res.status(200).json({
                status: 'error',
                message: 'All fields must be complete',
            });
        }

        const application = await LoanApplication.create({
            firstName,
            lastName,
            email,
            phone,
            gender,
            dob,
            address,
            employmentStatus,
            employerName,
            jobTitle,
            employmentAddress,
            nokFirstName,
            nokLastName,
            nokEmail,
            nokPhone,
            nokRelationship,
            bvn,
            verificationDocument,
            guarantorFirstName,
            guarantorLastName,
            guarantorEmail,
            guarantorPhone,
            guarantorOccupation,
            guarantorHomeAddress,
            guarantorOfficeAddress,
            userId,
            status: 'pending',
        });

        const user = await User.findOne({ where: { id: userId } });
        await user.update({ loanStatus: 'pending' });
        await user.save();

        res.status(201).json({
            status: 'success',
            message: 'Loan application successful',
        });
    }

    static async getApplication(req, res) {
        const applicationId = req.params.applicationId;
        if (!applicationId) throw new BadRequestError('Invalid application id');

        const application = await LoanApplication.findOne({ where: { id: applicationId } });

        if (!application) throw new InternalServerError(`Loan application with ID: ${applicationId} not found`);

        const user = await User.findOne({ where: { loanApplicationId: applicationId } });

        res.status(200).json({
            status: 'success',
            data: {
                application: application,
                user: user,
            },
        });
    }

    static async deleteApplication(req, res, next) {
        const { applicationId } = req.params;

        const application = await LoanApplication.findOne({ where: { id: applicationId } });

        if (!application) {
            throw new NotFoundError(`application with id ${applicationId} not found`);
        }

        await application.destroy();

        res.status(204).json({
            status: 'success',
            message: `Loan application with id ${applicationId} has been deleted`,
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

        let loanApplications;

        if (groupId == masterGroup.id) {
            loanApplications = await LoanApplication.findAndCountAll({
                where: {},
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        } else {
            loanApplications = await LoanApplication.findAndCountAll({
                where: {
                    groupId,
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
            });
        }

        const specificCount = loanApplications.rows.length;

        if (specificCount === 0) return next(new NotFoundError('No loan applications found'));

        const response = getPagingData(loanApplications, page, limit, 'result');

        if (response.totalPages === null) {
            response.totalPages = 1;
        }
        return res.status(200).json({ success: true, data: response });
    }
}

module.exports = LoanApplicationController;
