module.exports = (sequelize, DataTypes) => {
    // Permissions model
    const Permission = sequelize.define(
        'Permission',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: 'permissions',
            paranoid: true,
            underscored: true,

            timestamps: true,
        },
    );

    //  =========== PERMISSION ASSOCIATIONS =========== //
    Permission.associate = (models) => {
        Permission.belongsToMany(models.Role, { through: models.RolePermissions });
        Permission.belongsToMany(models.User, { through: models.UserPermissions });
    };

    return Permission;
};
