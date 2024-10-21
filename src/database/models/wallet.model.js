module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define(
        'Wallet',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
                allowNull: false,
            },
            currency: {
                type: DataTypes.STRING,
                defaultValue: 'NGN',
                allowNull: false,
            },
            reference: {
                type: DataTypes.STRING,
            },
            type: {
                type: DataTypes.ENUM('typeA', 'typeB'),
                defaultValue: 'typeA',
                allowNull: false,
            },
            pin: {
                type: DataTypes.STRING,
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            tableName: 'wallets',
            paranoid: true,
            underscored: true,
            timestamps: true,

            hooks: {
                // Hash pin before creating
                beforeCreate: async (walletInstance) => {
                    if (walletInstance.pin) {
                        const salt = await bcrypt.genSalt(10);
                        walletInstance.pin = await bcrypt.hash(walletInstance.pin, salt);
                    }
                },
                // Hash pin before updating
                beforeUpdate: async (walletInstance) => {
                    if (walletInstance.changed('pin')) {
                        const salt = await bcrypt.genSalt(10);
                        walletInstance.pin = await bcrypt.hash(walletInstance.pin, salt);
                    } else {
                        console.log('Pin was not changed, skipping hashing.');
                    }
                },
            },
        },
    );

    // Compare plain pin with hashed pin
    Wallet.prototype.comparePassword = function (enteredPin) {
        return bcrypt.compareSync(enteredPin, this.pin);
    };

    // =========== WALLET ASSOCIATIONS =========== //
    Wallet.associate = (models) => {
        Wallet.hasMany(models.Transaction, {
            foreignKey: 'walletId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        Wallet.hasMany(models.Subscription, {
            foreignKey: 'walletId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        Wallet.belongsTo(models.User, {
            foreignKey: 'walletId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        Wallet.belongsTo(models.Group, {
            foreignKey: 'walletId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        Wallet.hasMany(models.SubWallet, {
            foreignKey: 'walletId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Wallet;
};
