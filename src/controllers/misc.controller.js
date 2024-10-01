const db = require('../database/models/index');
const Permission = db.Permission;
const Role = db.Role;
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

    static async createMasterGroup(req, res) {
        // Create master group

        try {
            const masterGroup = await Group.create({
                name: 'master',
                description: 'master group has access to all other groups resources',
            });
            res.status(200).json({
                status: 'success',
                message: 'Master Group created successfully',
            });
        } catch (e) {
            throw new InternalServerError('Error creating master group', e);
        }
    }
}

module.exports = MiscController;
