module.exports = (sequelize, DataTypes) => {
    // ChatroomUsers model
    const ChatroomUsers = sequelize.define(
        'ChatroomUsers',
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
            chatroomId: {
                type: DataTypes.UUID,
                references: {
                    model: 'Chatroom',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            tableName: 'chatroom_users',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    return ChatroomUsers;
};
