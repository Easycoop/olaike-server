const db = require('../database/models/index');
// const Paystack = require('../util/index');
const Paystack = require('../services/paystack');
const Wallet = db.Wallet;
const Payment = db.Payment;
const Transaction = db.Transaction;
const Subscription = db.Subscription;

const paymentMethods = ['card', 'bank'];

class PaymentController {
    static async InitializeSubscription(req, res, next) {
        const { email, currency, amount, walletid, subscriptionId, interval, payment_method } = req.data;

        if (!paymentMethods.includes(payment_method)) {
            throw new InternalServerError('payment method not accepted');
        }

        const wallet = await Wallet.findOne({ where: { id: walletid } });
        if (!wallet) {
            throw new InternalServerError('Wallet with the wallet id not found');
        }

        const subscription = await Subscription.findOne({ where: { id: subscriptionId } });
        if (!subscription) {
            throw new InternalServerError('internal error');
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
            plan: subscription.code,
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

    static async CreatePlan(req, res, next) {
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
        const newSubscription = await Subscription.create({
            currency: currency,
            name: name,
            interval: interval,
            amount: amount,
            code: plan_code,
            status: 'pending',
        });

        if (!newSubscription) {
            res.status(201).json({
                status: 'failed',
                message: 'subscription creation failed ',
                data: null,
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'subscription creation successfull ',
            data: null,
        });
    }

    static async Webhook(req, res, next) {
        //validate event
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        if (hash == req.headers['x-paystack-signature']) {
            // Retrieve the request's body
            const event = req.body;
            // Do something with event
            Paystack.HandleEvent(event);
        }
        res.send(200);
    }
}

module.exports = PaymentController;
