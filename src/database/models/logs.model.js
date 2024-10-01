module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define(
        'Logs',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: true, // Nullable for system actions
            },
            action: {
                type: DataTypes.STRING,
                defaultValue: 'SYSTEM',
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('system', 'finance', 'ticket', 'user'),
                defaultValue: 'system',
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                defaultValue: 'log for specified action',
                allowNull: false,
            },
            details: {
                type: DataTypes.JSON, // to store contextual data
                allowNull: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'logs',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    Logs.associate = (models) => {
        Logs.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Logs;
};
