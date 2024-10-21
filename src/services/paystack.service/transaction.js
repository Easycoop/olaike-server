const request = require('./utils/request');
const post = request.post;
const get = request.get;

/**
 * Initializes a transaction on Paystack.
 * @param {object} transactionData - The payment details (amount, email, etc.)
 * @returns {Promise<object>} - Paystack response
 */
class Transaction {
    static async Initialize(transactionData) {
        if (!transactionData?.email || !transactionData?.amount) {
            return null;
        }

        const data = await post('/transaction/initialize', transactionData);
        if (!data) {
            throw new InternalServerError('Paystack payment initialization failed');
        }
        return data;
    }

    /**
     * Verifies the transaction reference with Paystack.
     * @param {string} reference - Transaction reference to verify
     * @returns {Promise<object>} - Paystack verification response
     */
    static async Verify(reference) {
        if (reference === '') {
            return null;
        }
        const data = await get(`/transaction/verify/${reference}`);
        if (!data) {
            throw new InternalServerError('Payment not verified');
        }
        return data;
    }

    /**
     * Handles the creation of a new transfer recipient to generate recipient code to pass in the transfer data
     * @param {object} transferRecipientData
     * @returns
     */
    static async createTransferRecipient(transferRecipientData) {
        if (!transferRecipientData) {
            return null;
        }
        const data = await post('/transferrecipient', transferRecipientData);
        if (!data) {
            throw new InternalServerError('Paystack transfer recipient creation failed');
        }
        return data;
    }

    /**
     * Handles transfer to recipients outside root wallets
     * @param {object} transferData
     * @returns
     */
    static async Transfer(transferData) {
        if (!transferData) {
            return null;
        }
        const data = await post('/transfer', transferData);
        if (!data) {
            throw new InternalServerError('Paystack transfer failed');
        }
        return data;
    }

    /*
		export the transactions made through the gateway
	*/
    static async Export() {}

    /*
		charge the customer without the customer undergoing the payment process again
	*/
    static async Charge() {}
    /*
	    list transactions made
	*/
    static async List() {}
    /*
		fetch a particular transaction
	*/
    static async Fetch() {}
    /*
		transaction timelime details the transaction flow
	*/
    static async Timeline() {}
}

module.exports = Transaction;
