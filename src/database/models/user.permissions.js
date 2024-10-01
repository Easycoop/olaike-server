module.exports = (sequelize, DataTypes) => {
    // UserPermissions model
    const UserPermissions = sequelize.define(
        'UserPermissions',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                references: {
                    model: 'User',
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
            tableName: 'user_permissions',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    return UserPermissions;
};
