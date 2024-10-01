module.exports = (sequelize, DataTypes) => {
    // RolePermissions model
    const RolePermissions = sequelize.define(
        'RolePermissions',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            roleId: {
                type: DataTypes.UUID,
                references: {
                    model: 'Role',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            permissionId: {
                type: DataTypes.UUID,
                references: {
                    model: 'Permissions',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            tableName: 'role_permissions',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    return RolePermissions;
};
