const { Role, Wallet, Group, Permission, sequelize, Password, User } = require('../database/models/index');
const LogService = require('../helpers/logs/logs.service');

const { InternalServerError } = require('../utils/error');

class MiscController {
    static async initializeRolesandPermissions(req, res) {
        try {
            // Create initial permissions
            const permissionsList = [
                'manageUsers',
                'createUser',
                'updateUser',
                'deleteUser',
                'viewUser',
                'manageRoles',
                'assignRoles',
                'viewTransactions',
                'approveTransactions',
                'refundTransactions',
                'reverseTransactions',
                'viewReports',
                'generateReports',
                'manageKYC',
                'approveKYC',
                'manageAML',
                'freezeAccount',
                'unfreezeAccount',
                'manageCustomerSupport',
                'resolveTickets',
                'viewLogs',
                'accessAuditLogs',
                'exportData',
                'manageSystemSettings',
                'viewSystemHealth',
                'manageAPIs',
                'manageIntegrations',
                'deployCode',
                'accessCodebase',
                'manageFinances',
                'initiatePayouts',
                'viewPayouts',
                'viewOwnTransactions',
                'manageOwnAccount',
                'submitKYC',
                'accessAPI',
            ];

            for (const permission of permissionsList) {
                await Permission.create({ name: permission });
            }

            // Create initial roles
            const rolesList = [
                'SuperAdmin',
                'Admin',
                'OperationsManager',
                'ComplianceOfficer',
                'CustomerSupport',
                'Auditor',
                'Developer',
                'Accountant',
                'Merchant',
                'EndUser',
                'Guest',
                'APIUser',
            ];

            const roleObjects = {};
            for (const role of rolesList) {
                roleObjects[role] = await Role.create({ name: role });
            }

            // Assign permissions to roles
            const permissionAssignments = {
                SuperAdmin: [
                    'manageUsers',
                    'manageRoles',
                    'viewReports',
                    'manageSystemSettings',
                    'accessAuditLogs',
                    'manageIntegrations',
                    'manageAPIs',
                    'viewSystemHealth',
                    'deployCode',
                    'manageKYC',
                    'manageAML',
                    'viewTransactions',
                    'approveTransactions',
                    'reverseTransactions',
                    'refundTransactions',
                    'generateReports',
                ],
                Admin: [
                    'manageUsers',
                    'viewTransactions',
                    'approveTransactions',
                    'refundTransactions',
                    'viewReports',
                    'generateReports',
                    'manageKYC',
                    'viewSystemHealth',
                    'manageCustomerSupport',
                ],
                OperationsManager: [
                    'viewTransactions',
                    'approveTransactions',
                    'viewReports',
                    'manageCustomerSupport',
                    'resolveTickets',
                ],
                ComplianceOfficer: [
                    'manageKYC',
                    'approveKYC',
                    'manageAML',
                    'freezeAccount',
                    'unfreezeAccount',
                    'viewReports',
                    'accessAuditLogs',
                ],
                CustomerSupport: ['viewUser', 'resolveTickets', 'viewTransactions', 'refundTransactions'],
                Auditor: ['viewReports', 'accessAuditLogs', 'exportData'],
                Developer: ['accessCodebase', 'deployCode', 'manageAPIs', 'viewLogs'],
                Accountant: ['viewReports', 'manageFinances', 'initiatePayouts', 'viewTransactions'],
                Merchant: ['viewOwnTransactions', 'initiatePayouts', 'viewPayouts', 'manageOwnAccount'],
                EndUser: ['viewOwnTransactions', 'manageOwnAccount', 'submitKYC'],
                Guest: ['viewUser'],
                APIUser: ['accessAPI'],
            };

            for (const [role, permissions] of Object.entries(permissionAssignments)) {
                const roleObject = roleObjects[role];
                for (const permission of permissions) {
                    const permissionObject = await Permission.findOne({ where: { name: permission } });
                    await roleObject.addPermission(permissionObject);
                }
            }

            res.status(200).json({
                status: 'success',
                message: 'Initial roles and permissions created and assigned successfully',
            });
        } catch (e) {
            throw new InternalServerError('Error initializing roles and permissions', e);
        }
    }

    // Create master group
    static async createMasterGroup(req, res) {
        const t = await sequelize.transaction();

        const existingMasterGroup = await Group.findOne({ where: { name: `master` }, transaction: t });

        if (existingMasterGroup) {
            throw new InternalServerError('Master group already exists');
        }

        const masterGroup = await Group.create(
            {
                name: 'master',
                description: 'master group has access to all other groups resources',
                entranceFee: 0,
            },
            { transaction: t },
        );

        // Create wallet for master
        const newWallet = await Wallet.create(
            {
                groupId: masterGroup.id,
                balance: 0,
                currency: 'NGN',
            },
            { transaction: t },
        );

        await masterGroup.update({ walletId: newWallet.id });
        await masterGroup.save();

        await t.commit();

        LogService.createLog('SERVICE', null, 'system', 'master group created');

        res.status(200).json({
            status: 'success',
            message: 'Master Group created successfully',
        });
    }

    // Create super admin
    static async createSuperAdmin(req, res, next) {
        const { firstName, lastName, email, password, phone } = req.body;
        const t = await sequelize.transaction();

        try {
            // Find the master group
            const masterGroup = await Group.findOne({ where: { name: `master` }, transaction: t });

            // Create new user
            const newUser = await User.create(
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    groupId: masterGroup.id,
                },
                { transaction: t },
            );

            // Find the EndUser role
            const userRole = await Role.findOne({ where: { name: `SuperAdmin` }, transaction: t });
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
}

module.exports = MiscController;
