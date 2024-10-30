const Paystack = require('../../services/paystack.service');
const { BadRequestError, InternalServerError } = require('../../utils/error');
const db = require('../../database/models/index');
const FeesService = require('../../helpers/fees/fees.service');
const Wallet = db.Wallet;
const SubWallet = db.SubWallet;
const Payment = db.Payment;
const Transaction = db.Transaction;
const User = db.User;

const paymentMethods = ['card', 'bank'];

class TransactionController {
    /**
     * Handles payment initialization.
     * @param {object} req - request object containing email and amount payload
     * @param {object} res - response object
     */
    static async initiatePayment(req, res) {
        const { email, amount, currency, paymentMethod, description } = req.body;

        try {
            // if (!paymentMethods.includes(paymentMethod)) {
            //     throw new InternalServerError('payment method not accepted');
            // }

            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                throw new BadRequestError('User with the email not found');
            }
            const wallet = await Wallet.findOne({ where: { userId: user.id } });
            if (!wallet) {
                throw new InternalServerError('Wallet with the email not found');
            }

            const newTransaction = await Transaction.create({
                currency: currency,
                amount: amount,
                description: description,
                walletId: wallet.id,
                groupId: user.groupId,
                status: 'pending',
                metaData: {
                    from: {
                        senderid: user.id,
                        senderName: user.firstName + ' ' + user.lastName,
                    },
                    to: {
                        receiverId: null,
                        receiverName: 'root',
                    },
                    bank: {
                        name: null,
                    },
                },
            });

            const paymentData = {
                email,
                amount: amount * 100, // Convert to kobo
                // channel: paymentMethod,
                // callback_url: 'https://your-domain.com/payment/callback',
            };

            const data = await Paystack.Transaction.Initialize(paymentData);

            if (!data?.status || !data?.data) {
                return res.status(201).json({
                    status: 'failed',
                    message: 'transaction initiation failed',
                    data: null,
                });
            }

            const { access_code, reference, authorization_url } = data.data;
            newTransaction.code = access_code;
            newTransaction.reference = reference;
            await newTransaction.save();

            res.status(200).json({
                status: 'success',
                message: 'Transaction successfully initialized',
                data: data,
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to initiate payment', error: error.message });
        }
    }

    /**
     * Handles payment initialization for entrance fee.
     * @param {object} req - request object containing email and amount payload
     * @param {object} res - response object
     */
    static async initiatePaymentEntry(req, res) {
        const { email, amount, currency, paymentMethod, description, group, firstName, lastName } = req.body;

        try {
            // if (!paymentMethods.includes(paymentMethod)) {
            //     throw new InternalServerError('payment method not accepted');
            // }

            const wallet = await Wallet.findOne({ where: { groupId: group } });
            if (!wallet) {
                throw new InternalServerError('Wallet with the group id not found');
            }

            const newTransaction = await Transaction.create({
                currency: currency,
                amount: amount,
                description: description,
                walletId: wallet.id,
                groupId: group,
                status: 'pending',
                metaData: {
                    from: {
                        senderid: null,
                        senderName: firstName + ' ' + lastName,
                    },
                    to: {
                        receiverId: null,
                        receiverName: 'root',
                    },
                    bank: {
                        name: null,
                    },
                },
            });

            const paymentData = {
                email,
                amount: amount * 100, // Convert to kobo
                // channel: paymentMethod,
                // callback_url: 'https://your-domain.com/payment/callback',
            };

            const data = await Paystack.Transaction.Initialize(paymentData);

            if (!data?.status || !data?.data) {
                return res.status(201).json({
                    status: 'failed',
                    message: 'transaction initiation failed',
                    data: null,
                });
            }

            const { access_code, reference, authorization_url } = data.data;
            newTransaction.code = access_code;
            newTransaction.reference = reference;
            await newTransaction.save();

            res.status(200).json({
                status: 'success',
                message: 'Transaction successfully initialized',
                data: data,
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to initiate payment', error: error.message });
        }
    }

    /**
     * Handles payment verification for donation
     * @param {object} req
     * @param {object} res
     * @returns
     */
    static async verifyTransaction(req, res) {
        const { reference } = req.params;

        try {
            if (!reference) {
                throw new BadRequestError('Payment reference required');
            }

            const transaction = await Transaction.findOne({ where: { reference: reference } });
            if (!transaction) {
                throw new InternalServerError('Payment not valid');
            }

            const wallet = await Wallet.findOne({ where: { groupId: transaction.groupId } });
            if (!wallet) {
                throw new InternalServerError('Wallet not found');
            }

            const { status, data } = await Paystack.Transaction.Verify(reference);

            if (status && data.status === 'failed') {
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

            if (transaction.amount != data.amount / 100) {
                transaction.status = 'failed';
                await transaction.save();
                return res.status(201).json({
                    status: 'failed',
                    message: 'Transaction not verified',
                });
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

            await wallet.increment('balance', { by: transaction.amount });

            res.status(201).json({
                status: 'success',
                message: 'Transaction verified',
                data: newPayment.total,
            });
        } catch (error) {
            res.status(500).json({ message: 'Transaction verification failed', error: error.message });
        }
    }

    /**
     * Handles payment verification for funding
     * @param {object} req
     * @param {object} res
     * @returns
     */
    static async verifyTransactionFund(req, res) {
        const totalFee = 150;
        const fee = {
            building: 50,
            development: 30,
            insurance: 20,
            maintenance: 50,
        };

        const { reference } = req.params;

        try {
            if (!reference) {
                throw new BadRequestError('Payment reference required');
            }

            const transaction = await Transaction.findOne({ where: { reference: reference } });
            if (!transaction) {
                throw new InternalServerError('Payment not valid');
            }

            const wallet = await Wallet.findOne({ where: { id: transaction.walletId } });
            if (!wallet) {
                throw new InternalServerError('Wallet not found');
            }

            const buildingWallet = await SubWallet.findOne({ where: { walletId: transaction.walletId } });
            if (!buildingWallet) {
                throw new InternalServerError('Building Wallet not found');
            }

            const { status, data } = await Paystack.Transaction.Verify(reference);

            if (status && data.status === 'failed') {
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

            if (transaction.amount != data.amount / 100) {
                transaction.status = 'failed';
                await transaction.save();
                return res.status(201).json({
                    status: 'failed',
                    message: 'Transaction not verified',
                });
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

            const walletAmmount = transaction.amount - totalFee;

            await wallet.increment('balance', { by: walletAmmount });
            await buildingWallet.increment('balance', { by: fee.building });
            const fee1 = await FeesService.createFee('building', fee.building, 'paid', wallet.id);
            const fee2 = await FeesService.createFee('development', fee.development, 'paid', wallet.id);
            const fee3 = await FeesService.createFee('maintenance', fee.maintenance, 'paid', wallet.id);
            const fee4 = await FeesService.createFee('insurance', fee.insurance, 'paid', wallet.id);

            res.status(201).json({
                status: 'success',
                message: 'Transaction verified',
                data: newPayment.total,
            });
        } catch (error) {
            res.status(500).json({ message: 'Transaction verification failed', error: error.message });
        }
    }

    /**
     * Handles payment verification for entrance fee
     * @param {object} req
     * @param {object} res
     * @returns
     */
    static async verifyTransactionEntry(req, res) {
        const { reference } = req.params;

        try {
            if (!reference) {
                throw new BadRequestError('Payment reference required');
            }

            const transaction = await Transaction.findOne({ where: { reference: reference } });
            if (!transaction) {
                throw new InternalServerError('Payment not valid');
            }

            const wallet = await Wallet.findOne({ where: { groupId: transaction.groupId } });
            if (!wallet) {
                throw new InternalServerError('Wallet not found');
            }

            const { status, data } = await Paystack.Transaction.Verify(reference);

            if (status && data.status === 'failed') {
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

            if (transaction.amount != data.amount / 100) {
                transaction.status = 'failed';
                await transaction.save();
                return res.status(201).json({
                    status: 'failed',
                    message: 'Transaction not verified',
                });
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

            await wallet.increment('balance', { by: transaction.amount });

            res.status(201).json({
                status: 'success',
                message: 'Transaction verified',
                data: newPayment.total,
            });
        } catch (error) {
            res.status(500).json({ message: 'Transaction verification failed', error: error.message });
        }
    }

    /**
     * Handles payment verification for funding savings
     * @param {object} req
     * @param {object} res
     * @returns
     */
    static async verifyTransactionSavings(req, res) {
        const { reference } = req.params;

        try {
            if (!reference) {
                throw new BadRequestError('Payment reference required');
            }

            const transaction = await Transaction.findOne({ where: { reference: reference } });
            if (!transaction) {
                throw new InternalServerError('Payment not valid');
            }

            const wallet = await Wallet.findOne({ where: { id: transaction.walletId } });
            if (!wallet) {
                throw new InternalServerError('Wallet not found');
            }

            const subWallet = await SubWallet.findOne({ where: { walletId: wallet.id, name: 'Savings Wallet' } });

            if (!subWallet) {
                throw new InternalServerError('Savings wallet not found');
            }

            const { status, data } = await Paystack.Transaction.Verify(reference);

            if (status && data.status === 'failed') {
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

            if (transaction.amount != data.amount / 100) {
                transaction.status = 'failed';
                await transaction.save();
                return res.status(201).json({
                    status: 'failed',
                    message: 'Transaction not verified',
                });
            }

            await transaction.update({
                status: 'success',
                description: 'extra savings',
            });
            // transaction.status = 'success';
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

            await subWallet.increment('balance', { by: transaction.amount });

            res.status(201).json({
                status: 'success',
                message: 'Transaction verified',
                data: newPayment.total,
            });
        } catch (error) {
            res.status(500).json({ message: 'Transaction verification failed', error: error.message });
        }
    }

    /**
     * Handles payment verification for loan repayment
     * @param {object} req
     * @param {object} res
     * @returns
     */
    static async verifyTransactionLoan(req, res) {
        const { reference } = req.params;

        try {
            if (!reference) {
                throw new BadRequestError('Payment reference required');
            }

            const transaction = await Transaction.findOne({ where: { reference: reference } });
            if (!transaction) {
                throw new InternalServerError('Payment not valid');
            }

            const wallet = await Wallet.findOne({ where: { id: transaction.walletId } });
            if (!wallet) {
                throw new InternalServerError('Wallet not found');
            }

            const user = await User.findOne({ where: { id: wallet.userId } });
            if (!user) {
                throw new InternalServerError('User not found');
            }

            const { status, data } = await Paystack.Transaction.Verify(reference);

            if (status && data.status === 'failed') {
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

            if (transaction.amount != data.amount / 100) {
                transaction.status = 'failed';
                await transaction.save();
                return res.status(201).json({
                    status: 'failed',
                    message: 'Transaction not verified',
                });
            }

            await transaction.update({
                status: 'success',
                description: 'loan repayment',
            });
            // transaction.status = 'success';
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

            await user.increment('loanBalance', { by: -transaction.amount });

            res.status(201).json({
                status: 'success',
                message: 'Transaction verified',
                data: newPayment.total,
            });
        } catch (error) {
            res.status(500).json({ message: 'Transaction verification failed', error: error.message });
        }
    }

    /**
     * Handles withdrawal of funds
     * @param {req} req
     * @param {res} res
     * @returns
     */
    static async withdraw(req, res) {
        const userId = req.authPayload.id;
        const { amount, bank_code, account_number } = req.body;

        // Find user's wallet
        const wallet = await Wallet.findOne({ where: { userId: userId } });

        if (wallet.balance < amount * 100) {
            return res.status(400).json({
                status: 'failed',
                message: 'Insufficient balance',
            });
        }

        // Initiate transfer to user's bank account
        const transferRecipient = await Paystack.TransferRecipient.create({
            type: 'nuban', //nuban for nigerian banks
            name: req.user.name,
            account_number: account_number,
            bank_code: bank_code,
            currency: 'NGN',
        });

        const transferData = {
            source: 'balance', // use paystack account balance
            amount: amount * 100, // Amount in kobo
            recipient: transferRecipient.data.recipient_code,
            reason: 'Withdrawal from wallet',
        };

        const transfer = await Paystack.Transfer.initiate(transferData);

        // Update wallet balance
        wallet.balance -= amount * 100;
        await wallet.save();

        res.status(200).json({
            status: 'success',
            message: 'Withdrawal successful',
            data: { balance: wallet.balance },
        });
    }
}

module.exports = TransactionController;
