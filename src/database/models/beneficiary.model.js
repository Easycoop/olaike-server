module.exports = (sequelize, DataTypes) => {
    const Beneficiary = sequelize.define(
        'Beneficiary',
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
            accountNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            bankName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            swiftCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'beneficiaries',
            timestamps: true,
            underscored: true,
        },
    );

    // Association: A beneficiary belongs to a user
    Beneficiary.associate = (models) => {
        Beneficiary.belongsTo(models.User, {
            foreignKey: 'beneficiaryId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Beneficiary;
};
