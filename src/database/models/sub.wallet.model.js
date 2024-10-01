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
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.0,
            },
            isDefault: {
                type: DataTypes.BOOLEAN, // Identifies the default sub-wallet
                defaultValue: false,
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
        SubWallet.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        SubWallet.belongsTo(models.Wallet, {
            foreignKey: 'subwalletId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return SubWallet;
};
