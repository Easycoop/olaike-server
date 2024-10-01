module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(
        'Payment',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            method: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gateway: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
            },
            currency: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            extra: {
                type: DataTypes.JSON,
                allowNull: false,
            },
        },
        {
            tableName: 'payments',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    // ============ PAYMENT ASSOCIATIONS ============//
    Payment.associate = (models) => {
        Payment.belongsTo(models.Transaction);
    };

    return Payment;
};
