module.exports = (sequelize, DataTypes) => {
    const WithdrawRequest = sequelize.define(
        'WithdrawRequest',
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
            status: {
                type: DataTypes.ENUM('successful', 'unsuccessful', 'pending'),
                defaultValue: 'pending',
                allowNull: false,
            },
        },
        {
            tableName: 'withdraw_requests',
            timestamps: true,
            underscored: true,
        },
    );

    // Association: A WithdrawRequest belongs to a user
    WithdrawRequest.associate = (models) => {
        WithdrawRequest.belongsTo(models.User, {
            foreignKey: 'withdrawRequestId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return WithdrawRequest;
};
