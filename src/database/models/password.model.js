const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
    const Password = sequelize.define(
        'Password',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },

        {
            tableName: 'passwords',
            paranoid: true,
            underscored: true,
            timestamps: true,

            hooks: {
                // Hash password before creating
                beforeCreate: async (passwordInstance) => {
                    if (passwordInstance.password) {
                        const salt = await bcrypt.genSalt(10);
                        passwordInstance.password = await bcrypt.hash(passwordInstance.password, salt);
                    }
                },
                // Hash password before updating
                beforeUpdate: async (passwordInstance) => {
                    if (passwordInstance.changed('password')) {
                        const salt = await bcrypt.genSalt(10);
                        passwordInstance.password = await bcrypt.hash(passwordInstance.password, salt);
                    } else {
                        console.log('Password was not changed, skipping hashing.');
                    }
                },
            },
        },
    );

    // Compare plain password with hashed password
    Password.prototype.comparePassword = function (enteredPassword) {
        return bcrypt.compareSync(enteredPassword, this.password);
    };

    // =========== PASSWORD ASSOCIATIONS =========== //

    Password.associate = (models) => {
        Password.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Password;
};
