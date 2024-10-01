module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define(
        'Group',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
            type: {
                type: DataTypes.ENUM('typeA', 'typeB'),
                defaultValue: 'typeA',
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'groups',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    // =========== GROUP ASSOCIATIONS =========== //
    Group.associate = (models) => {
        Group.hasMany(models.User, {
            foreignKey: 'groupId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        Group.hasOne(models.Wallet, {
            foreignKey: 'groupId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Group;
};
