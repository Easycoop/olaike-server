module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define(
        'Message',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            senderId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            recipientId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            fileUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('sent', 'delivered', 'read'),
                defaultValue: 'sent',
            },
        },
        {
            tableName: 'messages',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    Message.associate = (models) => {
        Message.belongsTo(models.User, { foreignKey: 'messageId' });
    };

    return Message;
};
