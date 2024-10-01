module.exports = (sequelize, DataTypes) => {
    // Subscriptions model
    const Subscription = sequelize.define(
        'Subscription',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            currency: {
                type: DataTypes.STRING,
                defaultValue: 'NGN',
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            interval: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('active', 'non-renewing', 'attention', 'completed', 'cancelled'),
                allowNull: false,
            },
        },
        {
            tableName: 'subscriptions',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    //  =========== SUBSCRIPTION ASSOCIATIONS =========== //
    Subscription.associate = (models) => {
        Subscription.belongsTo(models.Wallet);
        Subscription.belongsTo(models.Subscription, {
            foreignKey: 'subscriptionId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Subscription;
};
