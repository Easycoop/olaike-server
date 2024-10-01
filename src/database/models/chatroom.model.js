module.exports = (sequelize, DataTypes) => {
    const Chatroom = sequelize.define(
        'Chatroom',
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
            },
            type: {
                type: DataTypes.ENUM('private', 'public'),
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'chatrooms',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    Chatroom.associate = (models) => {
        Chatroom.belongsToMany(models.User, {
            through: models.ChatroomUsers,
        });
    };

    return Chatroom;
};
