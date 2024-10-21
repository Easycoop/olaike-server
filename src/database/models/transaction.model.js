module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define(
        'Transaction',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            currency: {
                type: DataTypes.STRING,
                defaultValue: 'NGN',
                allowNull: false,
            },
            reference: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM('credit', 'debit'),
                defaultValue: 'credit',
                allowNull: false,
            },
            class: {
                type: DataTypes.ENUM('charge', 'transaction'),
                defaultValue: 'transaction',
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('pending', 'success', 'failed'),
                defaultValue: 'pending',
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            metaData: {
                type: DataTypes.JSON,
                allowNull: false, // This ensures the entire `meta_data` field is required
                validate: {
                    notNull: {
                        msg: 'meta_data is required',
                    },
                },
                // This will define the inner structure of `meta_data`
                defaultValue: {
                    from: {
                        senderid: '',
                        senderName: '',
                    },
                    to: {
                        receiverId: '',
                        receiverName: '',
                    },
                    bank: {
                        name: '',
                    },
                },
            },
        },
        {
            tableName: 'transactions',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    // =========== TRANSACTION ASSOCIATIONS =========== //
    Transaction.associate = (models) => {
        Transaction.belongsTo(models.Wallet, {
            foreignKey: 'transactionId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        Transaction.belongsTo(models.Category, {
            foreignKey: 'transactionId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        Transaction.hasOne(models.Payment, {
            foreignKey: 'transactionId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        Transaction.belongsTo(models.Group, {
            foreignKey: 'transactionId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Transaction;
};
