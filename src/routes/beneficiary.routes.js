const express = require('express');
const router = express.Router();

const BeneficiaryController = require('../controllers/beneficiary.controller');

// Add a new beneficiary
router.post('/beneficiaries', BeneficiaryController.createBeneficiary);

// Get all beneficiaries
router.get('/beneficiaries', BeneficiaryController.getBeneficiaries);

// Update a beneficiary
router.put('/beneficiaries/:id', BeneficiaryController.updateBeneficiary);

// Delete a beneficiary
router.delete('/beneficiaries/:id', BeneficiaryController.deleteBeneficiary);

module.exports = { router };
