module.exports = (sequelize, DataTypes) => {
    const Budget = sequelize.define(
        'Budget',
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
            categoryId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            period: {
                type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
                defaultValue: 'monthly',
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            tableName: 'budgets',
            timestamps: true,
            underscored: true,
        },
    );

    Budget.associate = (models) => {
        Budget.belongsTo(models.User, { foreignKey: 'budgetId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Budget.belongsTo(models.Category, { foreignKey: 'budgetId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    };

    return Budget;
};
