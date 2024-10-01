module.exports = (sequelize, DataTypes) => {
    // UserRoles model
    const UserRoles = sequelize.define(
        'UserRoles',
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
            roleId: {
                type: DataTypes.UUID,
                references: {
                    model: 'Role',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            tableName: 'user_roles',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    return UserRoles;
};
