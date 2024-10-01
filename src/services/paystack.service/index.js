/*
   export the paystack classes 
*/

const Transaction = require('./transaction');
const Subscription = require('./subscription');
const Plan = require('./plan');
const HandleEvent = require('./webhooks/paystack.webhook');

const Paystack = {
    Transaction,
    Subscription,
    Plan,
    HandleEvent,
};

module.exports = Paystack;
