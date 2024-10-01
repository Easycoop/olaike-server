const db = require('../index');
const User = db.User;
const Role = db.Role;
const Permission = db.Permission;

async function getProfile(user) {
    // Fetch user roles and their associated permissions
    const userWithRolesAndPermissions = await User.findOne({
        where: { email: user.email },
        include: [
            {
                model: Role,
                as: 'Roles',
                include: [
                    {
                        model: Permission,
                        as: 'Permissions',
                    },
                ],
            },
            {
                model: Permission, // Directly assigned permissions to the user
                as: 'Permissions',
            },
        ],
    });

    if (!userWithRolesAndPermissions) {
        throw new BadRequestError('User not found');
    }

    // Extract roles
    const userRoles = userWithRolesAndPermissions.Roles.map((role) => role.name);

    // Extract permissions from roles
    const rolePermissions = userWithRolesAndPermissions.Roles.reduce((permissions, role) => {
        role.Permissions.forEach((permission) => {
            if (!permissions.includes(permission.name)) {
                permissions.push(permission.name);
            }
        });
        return permissions;
    }, []);

    // Extract direct permissions tied to the user
    const directPermissions = userWithRolesAndPermissions.Permissions.map((permission) => permission.name);

    // Combine role-based and direct permissions, ensuring no duplicates
    const allPermissions = Array.from(new Set([...rolePermissions, ...directPermissions]));

    return {
        roles: userRoles,
        permissions: allPermissions,
    };
}

module.exports = {
    getProfile,
};
