module.exports = (sequelize, DataTypes) => {
    const Kyc = sequelize.define(
        'Kyc',
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
            identificationDocument: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            documentIdentifier: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            documentFile: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            kegowId:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
                defaultValue: 'pending', // Initial status is pending
                allowNull: false,
            },
            rejectionReason: {
                type: DataTypes.STRING,
                allowNull: true, // Reason only needed if rejected
            },
            // Add any other fields as necessary
        },
        {
            tableName: 'kyc_records',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    Kyc.associate = (models) => {
        Kyc.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Kyc;
};
