module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define(
        'Notification',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            message: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            ticketId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            tableName: 'notifications',
            timestamps: true,
            underscored: true,
        },
    );

    Notification.associate = (models) => {
        Notification.belongsTo(models.User, {
            foreignKey: 'notificationId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        Notification.belongsTo(models.Ticket, {
            foreignKey: 'notificationId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Notification;
};
