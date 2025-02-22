const request = require('./utils/request');
const post = request.post;
const get = request.get;

class Transaction {
    /**
     * Get list of banks for wallet-to-bank transfers.
     * @returns {Promise} - Response from the API.
     */
    static async getBanks() {
        const path = '/transfers/wallet-to-bank/banks';
        return await get(path);
    }

    /**
     * Perform a name enquiry for wallet-to-bank transfers.
     * @param {Object} data - Request body for name enquiry.
     * @returns {Promise} - Response from the API.
     */
    static async nameEnquiry(data) {
        const path = '/wallet-to-bank/name-enquiry';
        return await post(path, data);
    }

    /**
     * Initiate a wallet-to-bank transfer.
     * @param {Object} data - Request body for the transfer.
     * @returns {Promise} - Response from the API.
     */
    static async walletToBankTransfer(data) {
        const path = '/transfers/wallet-to-bank';
        return await post(path, data);
    }

    /**
     * Get a list of transactions within a date range.
     * @param {string} startDate - Start date in YYYY-MM-DD format.
     * @param {string} endDate - End date in YYYY-MM-DD format.
     * @param {number} page - Page number for pagination.
     * @param {number} limit - Number of items per page.
     * @returns {Promise} - Response from the API.
     */
    static async getTransactions(startDate, endDate, page = 1, limit = 200) {
        const path = `/business/me/transactions?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`;
        return await get(path);
    }

    /**
     * Get details of a specific transaction.
     * @param {string} transactionId - The ID of the transaction.
     * @returns {Promise} - Response from the API.
     */
    static async getTransactionDetail(transactionId) {
        const path = `/business/me/transactions/${transactionId}`;
        return await get(path);
    }
}

module.exports = Transaction;