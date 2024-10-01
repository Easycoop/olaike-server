const { ForbiddenError } = require('../utils/error');

// Middleware to check if user has specific role
function checkRoles(roles) {
    return function (req, res, next) {
        // Validate if roles is an array
        if (!Array.isArray(roles) || roles.length === 0) {
            return res.status(400).json({ message: 'Invalid roles. Expected a non-empty array.' });
        }

        const userRole = req.authPayload.user.roles;
        const hasCommonItem = userRole.some((item) => roles.includes(item));

        if (!hasCommonItem) {
            throw new ForbiddenError('Forbidden: you do not have the right access');
        }
        next();
    };
}

// Middleware to check if user has specific permission
function checkPermissions(permissions) {
    return function (req, res, next) {
        // Validate if permissions is an array
        if (!Array.isArray(permissions) || permissions.length === 0) {
            return res.status(400).json({ message: 'Invalid permissions. Expected a non-empty array.' });
        }

        const userPermissions = req.authPayload.user.permissions;
        const hasCommonItem = userPermissions.some((item) => permissions.includes(item));

        if (!hasCommonItem) {
            throw new ForbiddenError('Forbidden: you do not have the right permissions');
        }
        next();
    };
}

module.exports = { checkRoles, checkPermissions };
