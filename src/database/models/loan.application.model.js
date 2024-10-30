module.exports = (sequelize, DataTypes) => {
    const LoanApplication = sequelize.define(
        'LoanApplication',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },

            firstName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                set(value) {
                    if (value)
                        // remove whitespaces and convert to lowercase
                        this.setDataValue('email', value.trim().toLowerCase());
                },
            },
            phone: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            dob: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            employmentStatus: {
                type: DataTypes.ENUM('employed', 'unemployed', 'selfEmployed'),
                allowNull: true,
            },
            employerName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            jobTitle: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            employmentAddress: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nokFirstName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nokLastName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            nokEmail: {
                type: DataTypes.STRING,
                allowNull: true,
                set(value) {
                    if (value)
                        // remove whitespaces and convert to lowercase
                        this.setDataValue('nokEmail', value.trim().toLowerCase());
                },
            },
            nokPhone: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            nokRelationship: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bvn: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            verificationDocument: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            guarantorFirstName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            guarantorLastName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            guarantorEmail: {
                type: DataTypes.STRING,
                allowNull: true,
                set(value) {
                    if (value)
                        // remove whitespaces and convert to lowercase
                        this.setDataValue('guarantorEmail', value.trim().toLowerCase());
                },
            },
            guarantorPhone: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            guarantorOccupation: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            guarantorOfficeAddress: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            guarantorHomeAddress: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'pending'),
                defaultValue: 'inactive',
                allowNull: false,
            },
        },
        {
            tableName: 'loan_applications',
            timestamps: true,
            underscored: true,
        },
    );

    // Association: A LoanApplication belongs to a user
    LoanApplication.associate = (models) => {
        LoanApplication.belongsTo(models.User, {
            foreignKey: 'loanApplicationId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return LoanApplication;
};
