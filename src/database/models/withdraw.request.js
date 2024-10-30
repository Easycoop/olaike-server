module.exports = (sequelize, DataTypes) => {
    const RequestWithdraw = sequelize.define(
        'RequestWithdraw',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },

            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            reason: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'request_withdraw',
            timestamps: true,
            underscored: true,
        },
    );

    // Association: A RequestWithdraw belongs to a user
    RequestWithdraw.associate = (models) => {
        RequestWithdraw.belongsTo(models.User, {
            foreignKey: 'requestWithdrawId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return RequestWithdraw;
};
