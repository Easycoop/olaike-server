module.exports = (sequelize, DataTypes) => {
    const Rate = sequelize.define(
        'Rate',
        {
            id: {
                type: DataTypes.BIGINT,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            currencyPair: {
                type: DataTypes.ENUM(['NGN/USD', 'NGN/EUR', 'NGN/AUD']),
                defaultValue: 'NGN/USD',
                allowNull: false,
            },
            rate: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'rates',
            paranoid: true,
            underscored: true,

            timestamps: true,
        },
    );

    return Rate;
};
