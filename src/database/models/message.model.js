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
                type: DataTypes.TEXT,
                allowNull: true,
            },
            fileUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            readStatus: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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
        Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
        Message.belongsTo(models.User, { foreignKey: 'recipientId', as: 'recipient' });
    };

    return Message;
};
