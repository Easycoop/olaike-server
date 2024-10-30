module.exports = (sequelize, DataTypes) => {
    // User model
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,

                // remove empty spaces
                set(value) {
                    if (value) this.setDataValue('firstName', value.trim().toLowerCase());
                },
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,

                // remove empty spaces
                set(value) {
                    if (value) this.setDataValue('lastName', value.trim().toLowerCase());
                },
            },
            fullName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.first_name} ${this.last_name}`;
                },
                set(value) {
                    throw new Error('Do not try to set the `fullName` value!');
                },
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: true,
                    notNull: {
                        msg: 'Please enter a valid Email address',
                    },
                },
                allowNull: false,
                set(value) {
                    if (value)
                        // remove whitespaces and convert to lowercase
                        this.setDataValue('email', value.trim().toLowerCase());
                },
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone: {
                type: DataTypes.BIGINT,
                allowNull: true,
                validate: {
                    len: {
                        args: [10, 15],
                        msg: 'Phone number should be between 10 and 15 digits!',
                    },
                    isNumeric: {
                        msg: 'Please enter a valid numeric Phone number!',
                    },
                },
            },
            kycStatus: {
                type: DataTypes.ENUM('pending', 'verified', 'rejected'),
                defaultValue: 'pending',
                allowNull: false,
            },
            isActivated: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: true,
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            profileImage: { type: DataTypes.STRING(), allowNull: true },
            referralCode: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            uniqueString: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            otpExpiry: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            loanBalance: {
                type: DataTypes.DECIMAL(20, 2),
                defaultValue: 0,
                allowNull: false,
            },
            loanStatus: {
                type: DataTypes.ENUM('active', 'inactive', 'pending'),
                defaultValue: 'inactive',
                allowNull: false,
            },
            loanApplicationId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            walletId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            tableName: 'users',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    //  =========== USER ASSOCIATIONS =========== //

    User.associate = (models) => {
        User.hasOne(models.Password, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        // Many-to-Many relationship with Role
        // A user can have multiple roles, and a role can be assigned to multiple users
        User.belongsToMany(models.Role, { through: models.UserRoles });

        // Many-to-Many relationship with Permission
        // A user can have direct permissions, separate from roles
        User.belongsToMany(models.Permission, { through: models.UserPermissions });

        User.hasOne(models.Wallet, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        User.hasMany(models.Kyc, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        User.hasMany(models.Beneficiary, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        User.hasMany(models.Ticket, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        User.hasMany(models.Budget, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        User.hasMany(models.Message, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasMany(models.Conversation, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasMany(models.RequestWithdraw, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        User.hasMany(models.LoanApplication, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        User.belongsToMany(models.Chatroom, { through: models.ChatroomUsers });
    };

    return User;
};
