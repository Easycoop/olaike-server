const db = require('../database/models/index');
const Beneficiary = db.Beneficiary;
const NotificationService = require('../helpers/notification/notification.service');

class BeneficiaryController {
    // Create a new beneficiary
    static async createBeneficiary(req, res) {
        const { name, accountNumber, bankName, swiftCode } = req.body;
        const { userId } = req.user; // Assume user is authenticated

        try {
            const newBeneficiary = await Beneficiary.create({
                name,
                accountNumber,
                bankName,
                swiftCode,
                userId,
            });

            await NotificationService.createNotification({
                message: `Beneficiary "${newBeneficiary.name}" has been added to your account.`,
                userId,
            });

            res.status(201).json({
                status: 'success',
                message: 'Beneficiary added successfully',
                data: newBeneficiary,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to add beneficiary',
                error: error.message,
            });
        }
    }

    // Get all beneficiaries for the logged-in user
    static async getBeneficiaries(req, res) {
        const { userId } = req.user;

        try {
            const beneficiaries = await Beneficiary.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json({
                status: 'success',
                data: beneficiaries,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch beneficiaries',
                error: error.message,
            });
        }
    }

    // Update a beneficiary's details
    static async updateBeneficiary(req, res) {
        const { id } = req.params;
        const { name, accountNumber, bankName, swiftCode } = req.body;
        const { userId } = req.user;

        try {
            const beneficiary = await Beneficiary.findOne({
                where: { id, userId },
            });

            if (!beneficiary) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Beneficiary not found',
                });
            }

            beneficiary.name = name;
            beneficiary.accountNumber = accountNumber;
            beneficiary.bankName = bankName;
            beneficiary.swiftCode = swiftCode;
            await beneficiary.save();

            res.status(200).json({
                status: 'success',
                message: 'Beneficiary updated successfully',
                data: beneficiary,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to update beneficiary',
                error: error.message,
            });
        }
    }

    // Delete a beneficiary
    static async deleteBeneficiary(req, res) {
        const { id } = req.params;
        const { userId } = req.user;

        try {
            const beneficiary = await Beneficiary.findOne({
                where: { id, userId },
            });

            if (!beneficiary) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Beneficiary not found',
                });
            }

            await beneficiary.destroy();

            await NotificationService.createNotification({
                message: `Beneficiary "${beneficiary.name}" has been removed your account.`,
                userId,
            });

            res.status(200).json({
                status: 'success',
                message: 'Beneficiary deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to delete beneficiary',
                error: error.message,
            });
        }
    }
}

module.exports = BeneficiaryController;
