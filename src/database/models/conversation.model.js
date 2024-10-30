module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define(
        'Conversation',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId1: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            userId1Name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId2: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            userId2Name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastMessageId: {
                type: DataTypes.UUID,
                allowNull: true, // References the last message id
            },
            lastMessageContent: {
                type: DataTypes.STRING(2000),
                allowNull: true, // References the last message content
            },
        },
        {
            tableName: 'conversations',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    Conversation.associate = (models) => {
        Conversation.hasMany(models.Message, { foreignKey: 'conversationId' });
    };

    return Conversation;
};
