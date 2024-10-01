'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Insert Permissions
        await queryInterface.bulkInsert(
            'Permission',
            [
                { name: 'create_user', created_at: new Date(), updated_at: new Date() },
                { name: 'update_user', created_at: new Date(), updated_at: new Date() },
                { name: 'delete_user', created_at: new Date(), updated_at: new Date() },
                { name: 'read_user', created_at: new Date(), updated_at: new Date() },
            ],
            {},
        );

        // Insert Roles
        await queryInterface.bulkInsert(
            'Role',
            [
                { name: 'SuperAdmin', created_at: new Date(), updated_at: new Date() },
                { name: 'Admin', created_at: new Date(), updated_at: new Date() },
                { name: 'EndUser', created_at: new Date(), updated_at: new Date() },
            ],
            {},
        );

        // Fetch Permissions to associate with Roles
        const [createUser, editUser, deleteUser, viewUser] = await queryInterface.sequelize.query(
            `SELECT id from Permissions WHERE name IN ('create_user', 'update_user', 'delete_user', 'read_user')`,
        );

        // Fetch Role IDs
        const [superAdmin] = await queryInterface.sequelize.query(`SELECT id FROM Roles WHERE name = 'SuperAdmin'`);
        const [admin] = await queryInterface.sequelize.query(`SELECT id FROM Roles WHERE name = 'Admin'`);
        const [editor] = await queryInterface.sequelize.query(`SELECT id FROM Roles WHERE name = 'Editor'`);

        // Assign Permissions to SuperAdmin (all permissions)
        const superAdminPermissions = [createUser[0].id, editUser[0].id, deleteUser[0].id, viewUser[0].id];

        for (let permissionId of superAdminPermissions) {
            await queryInterface.bulkInsert(
                'RolePermissions',
                [
                    {
                        role_id: superAdmin[0].id,
                        permission_id: permissionId,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ],
                {},
            );
        }

        // Assign Permissions to Admin (only user-related permissions)
        const adminPermissions = [createUser[0].id, editUser[0].id, deleteUser[0].id, viewUser[0].id];

        for (let permissionId of adminPermissions) {
            await queryInterface.bulkInsert(
                'RolePermissions',
                [{ role_id: admin[0].id, permission_id: permissionId, created_at: new Date(), updated_at: new Date() }],
                {},
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('RolePermissions', null, {});
        await queryInterface.bulkDelete('Role', null, {});
        await queryInterface.bulkDelete('Permission', null, {});
    },
};
