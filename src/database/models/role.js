module.exports = (sequelize, DataTypes) => {
    // Role model
    const Role = sequelize.define(
        'Role',
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
            tableName: 'roles',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    //  =========== ROLE ASSOCIATIONS =========== //
    Role.associate = (models) => {
        Role.belongsToMany(models.User, { through: models.UserRoles });
        Role.belongsToMany(models.Permission, { through: models.RolePermissions });
    };

    return Role;
};
