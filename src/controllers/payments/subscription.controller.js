const Paystack = require('../../services/paystack.service');
const { BadRequestError, InternalServerError } = require('../../utils/error');
const db = require('../../database/models/index');
const Subscription = db.Subscription;
const SubscriptionPlan = db.SubscriptionPlan;
const Transaction = db.Transaction;
const Wallet = db.Wallet;

const paymentMethods = ['card', 'bank'];

class SubscriptionController {
    /**
     * Handles creation of plan for a subsription
     * @param {object} req
     * @param {object} res
     */
    static async CreatePlan(req, res) {
        const { currency, name, interval, amount } = req.body;

        const data = {
            name: name,
            interval: interval,
            amount: amount * 100,
            currency: currency,
        };

        const planData = Paystack.Plan.Create(data);

        if (!planData?.status || !planData?.data) {
            res.status(201).json({
                status: 'failed',
                message: 'subscription creation failed ',
                data: null,
            });
        }

        const { plan_code } = planData.data;
        const newSubscriptionPlan = await SubscriptionPlan.create({
            currency: currency,
            name: name,
            interval: interval,
            amount: amount,
            code: plan_code,
            status: 'active',
        });

        if (!newSubscriptionPlan) {
            res.status(201).json({
                status: 'failed',
                message: 'subscription plan creation failed ',
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'subscription plan creation successfull ',
            data: null,
        });
    }

    /**
     * Handles subscription activation
     * @param {object} req
     * @param {object} res
     */
    static async InitializeSubscription(req, res) {
        const { email, currency, amount, walletid, subscriptionPlanId, interval, payment_method } = req.data;

        if (!paymentMethods.includes(payment_method)) {
            throw new InternalServerError('payment method not accepted');
        }

        const wallet = await Wallet.findOne({ where: { id: walletid } });
        if (!wallet) {
            throw new InternalServerError('Wallet with the wallet id not found');
        }

        const subscriptionPlan = await SubscriptionPlan.findOne({ where: { id: subscriptionPlanId } });
        if (!subscriptionPlan) {
            throw new InternalServerError('internal error: subscription plan not found');
        }

        const newSubscription = await Subscription.Create({
            currency: currency,
            amount: amount,
            walletid: walletid,
            interval: interval,
            status: 'pending',
        });

        const newTransaction = await Transaction.Create({
            currency: currency,
            amount: amount,
            walletid: walletid,
            subscriptionId: newSubscription.id,
            status: 'pending',
        });
        const transaction_data = {
            email: email,
            plan: subscriptionPlan.code,
            channel: payment_method,
        };
        const data = await Paystack.Transaction.Initialize(transaction_data);

        if (!data?.status || !data?.data) {
            res.status(201).json({
                status: 'failed',
                message: 'transaction initiation failed',
                data: null,
            });
        }

        const { access_code, authorization_url, reference } = data.data;
        newTransaction.code = access_code;
        newTransaction.reference = data.reference;
        await newTransaction.save();

        res.status(201).json({
            status: 'success',
            message: 'transaction successfully initiated',
            data: null,
        });
    }

    /**
     * Handles subscription confirmation
     * @param {object} req
     * @param {object} res
     */
    static async Confirm(req, res, next) {
        const reference = req.params.reference;
        if (reference === '') {
            res.status(201).json({
                status: 'failed',
                message: 'payment reference required',
                data: null,
            });
        }

        const { status, data } = await Paystack.Transaction.Verify(reference);

        const transaction = Transaction.findOne({ where: { reference: reference } });
        if (!transaction) {
            throw new InternalServerError('Payment not valid');
        } else if (status && data.status === 'failed') {
            transaction.status = 'failed';
            await transaction.save();

            const newPayment = Payment.create({
                transactionid: transaction.id,
                gateway: 'paystack',
                total: data.amount,
                status: 'failed',
                currency: data.currency,
                method: data.channel,
                extra: JSON.stringify(data),
            });

            res.status(201).json({
                status: 'failed',
                message: 'payment not successful',
                data: newPayment.total,
            });
            return;
        }

        const subscribeData = await Paystack.Subscription.Create(data);

        if (!subscribeData.status) {
            res.status(201).json({
                status: 'failed',
                message: 'subscription failed',
                data: null,
            });
            return;
        }

        transaction.status = 'success';
        await transaction.save();

        const newPayment = Payment.create({
            transactionid: transaction.id,
            gateway: 'paystack',
            total: data.amount,
            status: 'sucess',
            currency: data.currency,
            method: data.channel,
            extra: JSON.stringify(data),
        });

        res.status(201).json({
            status: 'success',
            message: 'payment made successfully',
            data: newPayment.total,
        });
    }
}

module.exports = SubscriptionController;
