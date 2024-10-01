module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define(
        'Ticket',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('open', 'in_progress', 'closed'),
                defaultValue: 'open',
                allowNull: false,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            tableName: 'tickets',
            timestamps: true,
            underscored: true,
        },
    );

    // Ticket associations
    Ticket.associate = (models) => {
        Ticket.belongsTo(models.User, {
            foreignKey: 'ticketId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return Ticket;
};
