module.exports = (sequelize, DataTypes) => {
    // User application model
    const UserApplication = sequelize.define(
        'UserApplication',
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
            phone: {
                type: DataTypes.BIGINT,
                unique: true,
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
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
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
            status: {
                type: DataTypes.ENUM('pending', 'success', 'failed'),
                defaultValue: 'pending',
                allowNull: false,
            },
        },
        {
            tableName: 'user_application',
            paranoid: true,
            underscored: true,
            timestamps: true,
        },
    );

    return UserApplication;
};
