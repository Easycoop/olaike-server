// routes/budgetRoutes.js
const express = require('express');
const { verifyAuth } = require('../middlewares/auth');

const { AuthTokenType } = require('../utils/token');
const BudgetController = require('../controllers/budget.controller');

const router = express.Router();

// Route to create a new budget
router.post('/budgets', verifyAuth(AuthTokenType.Access), BudgetController.createBudget);

// Route to get all budgets for the authenticated user
router.get('/budgets', verifyAuth(AuthTokenType.Access), BudgetController.getBudgets);

// Route to update an existing budget
router.put('/budgets/:id', verifyAuth(AuthTokenType.Access), BudgetController.updateBudget);

// Route to delete a budget
router.delete('/budgets/:id', verifyAuth(AuthTokenType.Access), BudgetController.deleteBudget);

module.exports = { router };
