const request = require('./utils/request');
const post = request.post;
const get = request.get;

class Wallet
{
     /**
     * Triggers OTP code for phone number verification.
     * @returns {Promise} - Response from the API.
     */
     static async requestPhoneVerificationOTP(phone) {
        const path = `/wallets/request-otp?phoneNumber=${phone}`;
        return await get(path);
    }

     /**
     * verify phone number via OTP
     * @param {Object} data - Request body for name enquiry.
     * @returns {Promise} - Response from the API.
     */
    static async verifyPhoneWithOTP(phoneNumber, OTP) {
        const path = `/wallets/validate-otp?phoneNumber=${phoneNumber}`;
        return await post(path, {phoneNumber, OTP});
    }

    static async verifyNin(nin, dateOfBirth, photoUrl) {
        const path = `/nin/verify-nin`;
        return await post(path, {photoUrl, nin, dateOfBirth});
    }

    /**
     * Creates walle for a user on kegow.
     * @param {Object} data - Request body for name enquiry.
     * @returns {Promise} - Response from the API.
     */
    static async create(walletReference, walletName, tid, phoneVerificationId) {
        // console.log(walletReference, walletName, tid, phoneVerificationId);
        // return false;
        phoneVerificationId = parseInt(phoneVerificationId);
        const path = '/wallets';
        return await post(path, {walletReference, walletName, tid, phoneVerificationId});
    }
}

module.exports = Wallet;