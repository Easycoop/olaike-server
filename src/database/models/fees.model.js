module.exports = (sequelize, DataTypes) => {
    const Fees = sequelize.define(
        'Fees',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM(
                    'building',
                    'development',
                    'maintenance',
                    'insurance',
                    'late_loan_repayment',
                    'late_recurrent_payment',
                    'entrance_fee',
                ),
                allowNull: false,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            currency: {
                type: DataTypes.STRING,
                defaultValue: 'NGN',
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('paid', 'unpaid'),
                allowNull: false,
            },
        },
        {
            tableName: 'fees',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    Fees.associate = (models) => {
        Fees.belongsTo(models.Wallet, { foreignKey: 'feesId' });
    };

    return Fees;
};
