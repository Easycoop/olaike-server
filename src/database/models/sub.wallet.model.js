module.exports = (sequelize, DataTypes) => {
    const SubWallet = sequelize.define(
        'SubWallet',
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
                type: DataTypes.ENUM('typeA', 'typeB', 'typeC'),
                defaultValue: 'typeA',
                allowNull: false,
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            currency: {
                type: DataTypes.STRING,
                defaultValue: 'NGN',
                allowNull: false,
            },
        },
        {
            tableName: 'sub_wallets',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    // =========== SUB-WALLET ASSOCIATIONS =========== //
    SubWallet.associate = (models) => {
        SubWallet.belongsTo(models.Wallet, {
            foreignKey: 'subwalletId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return SubWallet;
};
