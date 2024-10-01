module.exports = (sequelize, DataTypes) => {
    // Subscriptions plans model
    const SubscriptionPlan = sequelize.define(
        'SubscriptionPlan',
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
                type: DataTypes.ENUM('active', 'inactive'),
                defaultValue: 'active',
                allowNull: false,
            },
        },
        {
            tableName: 'subscription_plan',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    //  =========== SUBSCRIPTION PLAN ASSOCIATIONS =========== //
    SubscriptionPlan.associate = (models) => {
        SubscriptionPlan.hasMany(models.Subscription, {
            foreignKey: 'subscriptionPlanId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return SubscriptionPlan;
};
