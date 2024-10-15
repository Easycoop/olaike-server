const db = require('../database/models/index');
const User = db.User;
const Role = db.Role;
const Permission = db.Permission;
const { NotFoundError, InternalServerError, BadRequestError } = require('../utils/error');

class RolePermissions {
    static async createRole(req, res) {
        const { name } = req.body;

        const existingRole = await Role.findOne({ where: { name: name } });

        if (existingRole) {
            return res.status(201).json({ message: 'Role with the same name already exists' });

            // throw new BadRequestError('Role with the same name already exists');
        }
        const role = await Role.create({
            name: name,
        });

        res.status(201).json({ status: 'success', data: { role: role } });
    }

    static async getRoles(req, res) {
        try {
            const roles = await Role.findAll();
            res.status(200).json({ status: 'success', data: { roles: roles } });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching roles', error });
        }
    }

    static async updateRole(req, res) {
        const { roleId } = req.params;
        const { name } = req.body;

        try {
            const role = await Role.findByPk(roleId);
            if (role) {
                role.name = name || role.name;
                await role.save();
                res.status(200).json(role);
            } else {
                res.status(404).json({ message: 'Role not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating role', error });
        }
    }

    static async deleteRole(req, res) {
        const { roleId } = req.params;

        try {
            const role = await Role.findByPk(roleId);
            if (role) {
                await role.destroy();
                res.status(200).json({ message: 'Role deleted successfully' });
            } else {
                res.status(404).json({ message: 'Role not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting role', error });
        }
    }

    static async createPermission(req, res) {
        const { name } = req.body;

        try {
            const existingPermission = await Permission.findOne({ where: { name: name } });

            if (existingPermission) {
                res.status(400).json({ message: 'Permission with the same name already exists' });
            }

            const permission = await Permission.create({ name });
            res.status(201).json(permission);
        } catch (error) {
            res.status(500).json({ message: 'Error creating permission', error });
        }
    }

    static async getPermissions(req, res) {
        try {
            const permissions = await Permission.findAll();
            res.status(200).json(permissions);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching permissions', error });
        }
    }

    static async updatePermission(req, res) {
        const { permissionId } = req.params;
        const { name } = req.body;

        try {
            const permission = await Permission.findByPk(permissionId);
            if (permission) {
                permission.name = name || permission.name;
                await permission.save();
                res.status(200).json(permission);
            } else {
                res.status(404).json({ message: 'Permission not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating permission', error });
        }
    }

    static async deletePermission(req, res) {
        const { permissionId } = req.params;

        try {
            const permission = await Permission.findByPk(permissionId);
            if (permission) {
                await permission.destroy();
                res.status(200).json({ message: 'Permission deleted successfully' });
            } else {
                res.status(404).json({ message: 'Permission not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting permission', error });
        }
    }

    static async assignPermissionToRole(req, res) {
        const { roleId, permissionId } = req.body;

        try {
            const role = await Role.findByPk(roleId);
            const permission = await Permission.findByPk(permissionId);

            if (role && permission) {
                await role.addPermission(permission);
                res.status(200).json({ message: `Permission ${permissionId} assigned to role ${roleId}` });
            } else {
                res.status(404).json({ message: 'Role or Permission not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error assigning permission to role', error });
        }
    }

    static async removePermissionFromRole(req, res) {
        const { roleId, permissionId } = req.body;

        try {
            const role = await Role.findByPk(roleId);
            const permission = await Permission.findByPk(permissionId);

            if (role && permission) {
                await role.removePermission(permission);
                res.status(200).json({ message: `Permission ${permissionId} removed from role ${roleId}` });
            } else {
                res.status(404).json({ message: 'Role or Permission not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error removing permission from role', error });
        }
    }

    static async assignUserToRole(req, res) {
        const { userId, roleId } = req.body;

        try {
            const user = await User.findByPk(userId);
            const role = await Role.findByPk(roleId);

            if (user && role) {
                await user.addRole(role);
                res.status(200).json({ message: `Role ${roleId} assigned to user ${userId}` });
            } else {
                res.status(404).json({ message: 'User or Role not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error assigning user to role', error });
        }
    }

    static async removeRoleFromUser(req, res) {
        const { userId, roleId } = req.body;

        try {
            const user = await User.findByPk(userId);
            const role = await Role.findByPk(roleId);

            if (user && role) {
                await user.removeRole(role);
                res.status(200).json({ message: `Role ${roleId} removed from user ${userId}` });
            } else {
                res.status(404).json({ message: 'User or Role not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error removing role from user', error });
        }
    }

    static async assignPermissionToUser(req, res) {
        const { userId, permissionId } = req.body;

        try {
            const user = await User.findByPk(userId);
            const permission = await Permission.findByPk(permissionId);

            if (user && permission) {
                await user.addPermission(permission);
                res.status(200).json({
                    status: 'success',
                    message: `Permission ${permissionId} assigned to user ${userId}`,
                });
            } else {
                res.status(404).json({ message: 'User or permission not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error assigning permission to user', error });
        }
    }

    static async removePermissionFromUser(req, res) {
        const { userId, permissionId } = req.body;

        try {
            const user = await User.findByPk(userId);
            const permission = await Permission.findByPk(permissionId);

            if (user && permission) {
                await user.removePermission(permission);
                res.status(200).json({
                    status: 'success',
                    message: `Permission ${permissionId} removed from user ${userId}`,
                });
            } else {
                res.status(404).json({ message: 'User or permission not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error removing permission from user', error });
        }
    }
}

module.exports = RolePermissions;
