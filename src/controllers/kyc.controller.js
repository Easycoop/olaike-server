const db = require('../database/models/index');
const Kyc = db.Kyc;
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/error');

class KycController {
    // Create a new KYC record
    static async createKyc(req, res, next) {
        const { userId, documentType, documentUrl } = req.body;

        if (!userId || !documentType || !documentUrl) {
            return next(new BadRequestError('userId, documentType, and documentUrl are required'));
        }

        try {
            const kyc = await Kyc.create({ userId, documentType, documentUrl });
            res.status(201).json({
                status: 'success',
                data: { kyc },
            });
        } catch (error) {
            next(new InternalServerError('Failed to create KYC record'));
        }
    }

    // Get KYC details by user ID
    static async getKycByUserId(req, res, next) {
        const userId = req.params.userId;

        try {
            const kyc = await Kyc.findOne({ where: { userId } });

            if (!kyc) {
                throw new NotFoundError(`KYC record not found for user with id ${userId}`);
            }

            res.status(200).json({
                status: 'success',
                data: { kyc },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all KYC records
    static async getAllKyc(req, res, next) {
        try {
            const kycs = await Kyc.findAll(); // Retrieves all KYC records

            res.status(200).json({
                status: 'success',
                data: { kycs },
            });
        } catch (error) {
            next(new InternalServerError('Failed to retrieve KYC records'));
        }
    }

    // Update KYC status
    static async updateKycStatus(req, res, next) {
        const { userId } = req.params;
        const { status, rejectionReason } = req.body;

        try {
            const kyc = await Kyc.findOne({ where: { userId } });

            if (!kyc) {
                throw new NotFoundError(`KYC record not found for user with id ${userId}`);
            }

            kyc.status = status;
            if (status === 'rejected') {
                kyc.rejectionReason = rejectionReason || 'No reason provided';
            }
            await kyc.save();

            res.status(200).json({
                status: 'success',
                data: { kyc },
            });
        } catch (error) {
            next(new InternalServerError('Failed to update KYC status'));
        }
    }

    // Delete KYC record
    static async deleteKyc(req, res, next) {
        const userId = req.params.userId;

        try {
            const kyc = await Kyc.destroy({ where: { userId } });

            if (!kyc) {
                throw new NotFoundError(`KYC record not found for user with id ${userId}`);
            }

            res.status(204).send();
        } catch (error) {
            next(new InternalServerError('Failed to delete KYC record'));
        }
    }

    // Accept KYC
    static async acceptKYC(req, res, next) {
        const kycId = req.params.id;

        const kycRecord = await KYC.findOne({ where: { id: kycId } });

        if (!kycRecord) {
            throw new NotFoundError(`KYC record with id ${kycId} not found`);
        }

        kycRecord.status = 'accepted'; // Update the status
        await kycRecord.save();

        res.status(200).json({
            status: 'success',
            message: 'KYC record accepted successfully',
            data: { kycRecord },
        });
    }

    // Reject KYC
    static async rejectKYC(req, res, next) {
        const kycId = req.params.id;
        const { reason } = req.body; // Get rejection reason from request body

        const kycRecord = await KYC.findOne({ where: { id: kycId } });

        if (!kycRecord) {
            throw new NotFoundError(`KYC record with id ${kycId} not found`);
        }

        kycRecord.status = 'rejected'; // Update the status
        kycRecord.rejectionReason = reason; // Set the rejection reason
        await kycRecord.save();

        res.status(200).json({
            status: 'success',
            message: 'KYC record rejected successfully',
            data: { kycRecord },
        });
    }
}

module.exports = KycController;
