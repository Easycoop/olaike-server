// models/category.js
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        'Category',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('income', 'expense'),
                allowNull: false,
            },
        },
        {
            tableName: 'categories',
            timestamps: true,
            underscored: true,
        },
    );

    Category.associate = (models) => {
        Category.hasMany(models.Budget, { foreignKey: 'categoryId' });
        Category.hasMany(models.Transaction, { foreignKey: 'categoryId' });
    };

    return Category;
};
