// controllers/budgetController.js
const { Budget, Category, Transaction } = require('../database/models/index');

class BudgetController {
    static async createBudget(req, res) {
        const { userId } = req.user;
        const { categoryId, amount, period, startDate, endDate } = req.body;

        try {
            const budget = await Budget.create({
                userId,
                categoryId,
                amount,
                period,
                startDate,
                endDate,
            });

            res.status(201).json({
                status: 'success',
                data: budget,
                message: 'Budget created successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to create budget',
                error: error.message,
            });
        }
    }

    static async getBudgets(req, res) {
        const { userId } = req.user;

        try {
            const budgets = await Budget.findAll({
                where: { userId },
                include: { model: Category },
            });

            res.status(200).json({
                status: 'success',
                data: budgets,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch budgets',
                error: error.message,
            });
        }
    }

    // Update budget
    static async updateBudget(req, res) {
        const { id } = req.params;
        const { amount, period, startDate, endDate } = req.body;
        const { userId } = req.user;

        try {
            const budget = await Budget.findOne({ where: { id, userId } });
            if (!budget) {
                return res.status(404).json({ message: 'Budget not found' });
            }

            budget.amount = amount;
            budget.period = period;
            budget.startDate = startDate;
            budget.endDate = endDate;
            await budget.save();

            res.status(200).json({
                status: 'success',
                message: 'Budget updated successfully',
                data: budget,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to update budget',
                error: error.message,
            });
        }
    }

    // Delete budget
    static async deleteBudget(req, res) {
        const { id } = req.params;
        const { userId } = req.user;

        try {
            const budget = await Budget.findOne({ where: { id, userId } });
            if (!budget) {
                return res.status(404).json({ message: 'Budget not found' });
            }

            await budget.destroy();
            res.status(200).json({
                status: 'success',
                message: 'Budget deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to delete budget',
                error: error.message,
            });
        }
    }
}

module.exports = BudgetController;
